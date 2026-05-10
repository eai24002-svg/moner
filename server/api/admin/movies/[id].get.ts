import type { Movie } from '~/types'
import { queryFirst } from '~/server/utils/db'
import { apiError } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const row = await queryFirst<Movie>('SELECT * FROM movies WHERE id = :id', { id })

  if (!row) {
    apiError(404, 'Movie not found')
  }

  return { data: row }
})
