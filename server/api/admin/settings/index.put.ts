import { z } from 'zod'
import { executeWrite, queryFirst } from '~/server/utils/db'
import { ensureSettingsSchema } from '~/server/utils/settings-schema'

const bodySchema = z.object({
  phone_number: z.string().min(5),
  whatsapp_number: z.string().min(5),
  hero_badge: z.string().min(2),
  hero_title_line_1: z.string().min(2),
  hero_title_line_2: z.string().min(2),
  hero_title_line_3: z.string().min(2),
  hero_description: z.string().min(10)
})

export default defineEventHandler(async (event) => {
  await ensureSettingsSchema()
  const body = bodySchema.parse(await readBody(event))
  const existing = await queryFirst<{ id: number }>('SELECT id FROM settings LIMIT 1')

  if (existing) {
    await executeWrite(
      `UPDATE settings SET
        phone_number = :phoneNumber,
        whatsapp_number = :whatsappNumber,
        hero_badge = :heroBadge,
        hero_title_line_1 = :heroTitleLine1,
        hero_title_line_2 = :heroTitleLine2,
        hero_title_line_3 = :heroTitleLine3,
        hero_description = :heroDescription
       WHERE id = :id`,
      {
        phoneNumber: body.phone_number,
        whatsappNumber: body.whatsapp_number,
        heroBadge: body.hero_badge,
        heroTitleLine1: body.hero_title_line_1,
        heroTitleLine2: body.hero_title_line_2,
        heroTitleLine3: body.hero_title_line_3,
        heroDescription: body.hero_description,
        id: existing.id
      }
    )
  } else {
    await executeWrite(
      `INSERT INTO settings
        (phone_number, whatsapp_number, hero_badge, hero_title_line_1, hero_title_line_2, hero_title_line_3, hero_description)
       VALUES
        (:phoneNumber, :whatsappNumber, :heroBadge, :heroTitleLine1, :heroTitleLine2, :heroTitleLine3, :heroDescription)`,
      {
        phoneNumber: body.phone_number,
        whatsappNumber: body.whatsapp_number,
        heroBadge: body.hero_badge,
        heroTitleLine1: body.hero_title_line_1,
        heroTitleLine2: body.hero_title_line_2,
        heroTitleLine3: body.hero_title_line_3,
        heroDescription: body.hero_description
      }
    )
  }

  return { ok: true }
})
