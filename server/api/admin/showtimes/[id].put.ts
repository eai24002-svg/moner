import { z } from 'zod'
import { createError } from 'h3'
import { executeWrite } from '~/server/utils/db'
import { normalizeDateString, normalizeTimeString } from '~/utils/cinema-time'

const bodySchema = z.object({
  movie_id: z.coerce.number().int().min(1),
  show_date: z.string().min(8),
  show_time: z.string().min(4),
  total_seats: z.coerce.number().int().min(10).max(10),
  status: z.enum(['available', 'limited', 'full', 'closed'])
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = bodySchema.parse(await readBody(event))
  const show_date = normalizeDateString(body.show_date)
  const show_time = normalizeTimeString(body.show_time)

  if (!show_date || !show_time) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid show_date/show_time' })
  }

  await executeWrite(
    `UPDATE showtimes SET
      movie_id = :movie_id,
      show_date = :show_date,
      show_time = :show_time,
      total_seats = :total_seats,
      status = :status
     WHERE id = :id`,
    { ...body, show_date, show_time, id }
  )

  return { ok: true }
})
