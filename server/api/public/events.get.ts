import type { EventItem } from '~/types'
import { queryRows } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const events = await queryRows<EventItem>(
    `SELECT * FROM events
     WHERE is_active = 1
     ORDER BY event_date ASC, event_time ASC`
  )

  return { data: events }
})
