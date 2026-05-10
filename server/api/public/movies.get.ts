import type { Movie, Seat, Showtime } from '~/types'
import { queryRows } from '~/server/utils/db'
import { getRuntimeShowStatus } from '~/server/utils/domain'
import { getCurrentDateString, normalizeDateString } from '~/utils/cinema-time'

export default defineEventHandler(async (event) => {
  const rawDate = getQuery(event).date as string | undefined
  const selectedDate = normalizeDateString(rawDate) || getCurrentDateString()

  // Simplified: user sees all active showtimes for the selected calendar day
  // (auto-generated + manually added), grouped by movie.
  type JoinedRow = {
    showtime_id: number
    movie_id: number
    show_date: string
    show_time: string
    total_seats: number
    status: Showtime['status']
    id: number
    title: string
    slug: string
    description: string
    duration_minutes: number
    classification: Movie['classification']
    trailer_url: string
    poster_url: string
    is_active: number
    created_at: string
    updated_at: string
  }

  const showtimes = await queryRows<JoinedRow>(
    `SELECT
       s.id as showtime_id,
       s.movie_id,
       DATE_FORMAT(s.show_date, '%Y-%m-%d') as show_date,
       TIME_FORMAT(s.show_time, '%H:%i:%s') as show_time,
       s.total_seats,
       s.status,
       m.id,
       m.title,
       m.slug,
       m.description,
       m.duration_minutes,
       m.classification,
       m.trailer_url,
       m.poster_url,
       m.is_active,
       m.created_at,
       m.updated_at
     FROM showtimes s
     INNER JOIN movies m ON m.id = s.movie_id
     WHERE s.show_date = :selectedDate
       AND m.is_active = 1
     ORDER BY s.show_time ASC`,
    { selectedDate }
  )

  const byMovieId = new Map<number, Movie & { showtimes: Array<Showtime & { seats: Seat[], booked_count: number }> }>()

  for (const row of showtimes) {
    const showtime: Showtime = {
      id: row.showtime_id,
      movie_id: row.movie_id,
      show_date: row.show_date,
      show_time: row.show_time,
      total_seats: row.total_seats,
      status: row.status
    }

    const seats = await queryRows<Seat>(
      `SELECT * FROM seats
       WHERE showtime_id = :showtimeId
       ORDER BY seat_number ASC`,
      { showtimeId: showtime.id }
    )

    const bookedCount = seats.filter((seat) => seat.is_booked === 1).length
    const runtimeStatus = getRuntimeShowStatus(showtime, bookedCount)
    const hydratedShow = {
      ...showtime,
      status: runtimeStatus,
      seats,
      booked_count: bookedCount
    }

    if (hydratedShow.status === 'expired' || hydratedShow.status === 'closed') {
      continue
    }

    const movieId = row.movie_id
    const existing = byMovieId.get(movieId)
    if (existing) {
      existing.showtimes.push(hydratedShow)
      continue
    }

    byMovieId.set(movieId, {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      duration_minutes: row.duration_minutes,
      classification: row.classification,
      trailer_url: row.trailer_url,
      poster_url: row.poster_url,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      showtimes: [hydratedShow]
    })
  }

  return {
    data: Array.from(byMovieId.values()).filter((movie) => movie.showtimes.length > 0),
    meta: { date: selectedDate }
  }
})
