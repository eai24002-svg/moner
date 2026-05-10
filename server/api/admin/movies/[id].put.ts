import { z } from 'zod'
import { executeWrite } from '~/server/utils/db'
import { toSlug } from '~/server/utils/domain'

const bodySchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  duration_minutes: z.coerce.number().int().min(1),
  classification: z.enum(['G', '+13', '+16', '+18']),
  trailer_url: z.string().url(),
  poster_url: z.string().min(1),
  is_active: z.coerce.number().int().min(0).max(1)
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = bodySchema.parse(await readBody(event))
  const slug = toSlug(body.title)

  await executeWrite(
    `UPDATE movies SET
      title = :title,
      slug = :slug,
      description = :description,
      duration_minutes = :duration_minutes,
      classification = :classification,
      trailer_url = :trailer_url,
      poster_url = :poster_url,
      is_active = :is_active,
      updated_at = NOW()
     WHERE id = :id`,
    { ...body, slug, id }
  )

  return { ok: true }
})
