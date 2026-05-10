import { z } from 'zod'
import { executeWrite } from '~/server/utils/db'

const bodySchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  event_type: z.enum(['drawing', 'workshop', 'seminar', 'lounge']),
  event_date: z.string().min(8),
  event_time: z.string().min(4),
  capacity: z.coerce.number().int().min(1),
  available_seats: z.coerce.number().int().min(0),
  image_url: z.string().min(1),
  is_active: z.coerce.number().int().min(0).max(1)
})

export default defineEventHandler(async (event) => {
  const body = bodySchema.parse(await readBody(event))
  await executeWrite(
    `INSERT INTO events
      (title, description, event_type, event_date, event_time, capacity, available_seats, image_url, is_active)
     VALUES
      (:title, :description, :event_type, :event_date, :event_time, :capacity, :available_seats, :image_url, :is_active)`,
    body
  )
  return { ok: true }
})
