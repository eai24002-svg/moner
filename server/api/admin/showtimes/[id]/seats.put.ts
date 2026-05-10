import { z } from 'zod'
import { executeWrite, queryFirst, queryRows } from '~/server/utils/db'
import { getShowStatusByAvailability } from '~/server/utils/domain'

const bodySchema = z.object({
  seats: z.array(
    z.object({
      seat_number: z.coerce.number().int().min(1).max(10),
      is_booked: z.coerce.number().int().min(0).max(1)
    })
  )
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = bodySchema.parse(await readBody(event))

  for (const seat of body.seats) {
    await executeWrite(
      `UPDATE seats
       SET is_booked = :isBooked
       WHERE showtime_id = :showtimeId AND seat_number = :seatNumber`,
      {
        isBooked: seat.is_booked,
        showtimeId: id,
        seatNumber: seat.seat_number
      }
    )
  }

  const seats = await queryRows<{ is_booked: number }>(
    'SELECT is_booked FROM seats WHERE showtime_id = :id',
    { id }
  )
  const currentShow = await queryFirst<{ status: 'available' | 'limited' | 'full' | 'closed', total_seats: number }>(
    'SELECT status, total_seats FROM showtimes WHERE id = :id',
    { id }
  )

  const booked = seats.filter((seat) => seat.is_booked === 1).length
  const status =
    currentShow?.status === 'closed'
      ? 'closed'
      : getShowStatusByAvailability(booked, currentShow?.total_seats || 10)

  await executeWrite('UPDATE showtimes SET status = :status WHERE id = :id', { status, id })

  return { ok: true }
})
