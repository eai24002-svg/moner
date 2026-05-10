import { executeWrite } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  await executeWrite('DELETE FROM showtimes WHERE movie_id = :id', { id })
  await executeWrite('DELETE FROM movies WHERE id = :id', { id })

  return { ok: true }
})
