import { z } from 'zod'
import { adminAuthCookieBase } from '~/server/utils/public-request'

const bodySchema = z.object({
  password: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = bodySchema.parse(await readBody(event))

  if (!config.adminPassword || body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'كلمة المرور غير صحيحة' })
  }

  const cookieBase = adminAuthCookieBase(event)
  const maxAge = 60 * 60 * 12

  setCookie(event, 'admin_session', config.adminPassword, {
    ...cookieBase,
    httpOnly: true,
    maxAge
  })

  setCookie(event, 'admin_logged_in', '1', {
    ...cookieBase,
    httpOnly: false,
    maxAge
  })

  return { ok: true }
})
