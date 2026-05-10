import type { Movie } from '~/types'
import { queryRows } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const rows = await queryRows<Movie>('SELECT * FROM movies ORDER BY created_at DESC')
  return { data: rows }
})
