import { adminAuthCookieBase } from '~/server/utils/public-request'

export default defineEventHandler(async (event) => {
  const cookieBase = adminAuthCookieBase(event)

  deleteCookie(event, 'admin_session', cookieBase)
  deleteCookie(event, 'admin_logged_in', cookieBase)

  return { ok: true }
})
