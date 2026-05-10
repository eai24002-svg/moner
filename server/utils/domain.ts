import type { ShowStatus, Showtime } from '~/types'
import { isShowtimeExpired } from '~/utils/cinema-time'

export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const getShowStatusByAvailability = (bookedSeats: number, totalSeats: number) => {
  const free = totalSeats - bookedSeats

  if (free <= 0) {
    return 'full'
  }

  if (free <= 3) {
    return 'limited'
  }

  return 'available'
}

export const getRuntimeShowStatus = (
  showtime: Pick<Showtime, 'show_date' | 'show_time' | 'status' | 'total_seats'>,
  bookedSeats: number
): ShowStatus => {
  if (showtime.status === 'closed') {
    return 'closed'
  }

  if (isShowtimeExpired(showtime.show_date, showtime.show_time)) {
    return 'expired'
  }

  return getShowStatusByAvailability(bookedSeats, showtime.total_seats)
}
