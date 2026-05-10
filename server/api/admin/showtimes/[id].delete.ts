import { executeWrite } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  await executeWrite('DELETE FROM seats WHERE showtime_id = :id', { id })
  await executeWrite('DELETE FROM showtimes WHERE id = :id', { id })
  return { ok: true }
})
