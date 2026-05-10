import { z } from 'zod'
import { createError } from 'h3'
import { executeWrite, queryFirst } from '~/server/utils/db'
import { normalizeDateString, normalizeTimeString } from '~/utils/cinema-time'

const bodySchema = z.object({
  movie_id: z.coerce.number().int().min(1),
  show_date: z.string().min(8),
  show_time: z.string().min(4),
  total_seats: z.coerce.number().int().min(10).max(10),
  status: z.enum(['available', 'limited', 'full', 'closed'])
})

export default defineEventHandler(async (event) => {
  const body = bodySchema.parse(await readBody(event))
  const show_date = normalizeDateString(body.show_date)
  const show_time = normalizeTimeString(body.show_time)

  if (!show_date || !show_time) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid show_date/show_time' })
  }

  const existing = await queryFirst<{ id: number }>(
    `SELECT id
     FROM showtimes
     WHERE movie_id = :movieId AND show_date = :showDate AND show_time = :showTime
     LIMIT 1`,
    { movieId: body.movie_id, showDate: show_date, showTime: show_time }
  )

  if (existing?.id) {
    throw createError({ statusCode: 409, statusMessage: 'Showtime already exists' })
  }

  const insertResult = await executeWrite(
    `INSERT INTO showtimes
      (movie_id, show_date, show_time, total_seats, status)
     VALUES
      (:movie_id, :show_date, :show_time, :total_seats, :status)`,
    { ...body, show_date, show_time }
  )

  const insertId = insertResult.insertId

  for (let seat = 1; seat <= body.total_seats; seat += 1) {
    await executeWrite(
      'INSERT INTO seats (showtime_id, seat_number, is_booked) VALUES (:showtimeId, :seatNumber, 0)',
      { showtimeId: insertId, seatNumber: seat }
    )
  }

  return { ok: true }
})
