import type { Settings } from '~/types'
import { queryFirst } from '~/server/utils/db'
import { ensureSettingsSchema } from '~/server/utils/settings-schema'

export default defineEventHandler(async () => {
  await ensureSettingsSchema()
  const settings = await queryFirst<Settings>('SELECT * FROM settings LIMIT 1')

  return {
    data: settings
  }
})
