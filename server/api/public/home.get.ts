import { queryRows } from '~/server/utils/db'
import { getCurrentDateString } from '~/utils/cinema-time'

export default defineEventHandler(async () => {
  const todayBaghdad = getCurrentDateString()

  const [movieCount] = await queryRows<{ count: number }>(
    'SELECT COUNT(*) as count FROM movies WHERE is_active = 1'
  )
  const [eventCount] = await queryRows<{ count: number }>(
    'SELECT COUNT(*) as count FROM events WHERE is_active = 1'
  )
  const [showCount] = await queryRows<{ count: number }>(
    `SELECT COUNT(*) as count
     FROM showtimes
     WHERE show_date >= :todayBaghdad`,
    { todayBaghdad }
  )

  return {
    data: {
      movieCount: movieCount?.count || 0,
      eventCount: eventCount?.count || 0,
      showCount: showCount?.count || 0
    }
  }
})
