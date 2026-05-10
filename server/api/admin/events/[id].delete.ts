import { executeWrite } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  await executeWrite('DELETE FROM events WHERE id = :id', { id })
  return { ok: true }
})
