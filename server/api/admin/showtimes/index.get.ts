import type { Seat, Showtime } from '~/types'
import { queryRows } from '~/server/utils/db'
import { getRuntimeShowStatus } from '~/server/utils/domain'
import { getCurrentDateString, normalizeDateString } from '~/utils/cinema-time'

type Row = Showtime & { movie_title: string }

export default defineEventHandler(async (event) => {
  const rawDate = getQuery(event).date as string | undefined
  const selectedDate = normalizeDateString(rawDate) || getCurrentDateString()

  const showtimes = await queryRows<Row>(
    `SELECT
       s.id,
       s.movie_id,
       DATE_FORMAT(s.show_date, '%Y-%m-%d') as show_date,
       TIME_FORMAT(s.show_time, '%H:%i:%s') as show_time,
       s.total_seats,
       s.status,
       m.title as movie_title
     FROM showtimes s
     INNER JOIN movies m ON m.id = s.movie_id
     WHERE s.show_date = :selectedDate
       AND m.is_active = 1
     ORDER BY s.show_time ASC`,
    { selectedDate }
  )

  const hydrated = await Promise.all(
    showtimes.map(async (showtime) => {
      const seats = await queryRows<Seat>(
        `SELECT * FROM seats
         WHERE showtime_id = :showtimeId
         ORDER BY seat_number ASC`,
        { showtimeId: showtime.id }
      )

      const bookedCount = seats.filter((seat) => seat.is_booked === 1).length

      return {
        ...showtime,
        status: getRuntimeShowStatus(showtime, bookedCount),
        seats
      }
    })
  )

  return {
    data: hydrated,
    meta: { date: selectedDate }
  }
})
