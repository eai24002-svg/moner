import type { H3Event } from 'h3'
import { getRequestHeader, getRequestURL } from 'h3'

/** True when the incoming request is HTTPS (including behind typical reverse proxies). */
export const isHttpsRequest = (event: H3Event) => {
  const forwardProto = getRequestHeader(event, 'x-forwarded-proto')?.split(',')[0]?.trim()
  if (forwardProto === 'https') {
    return true
  }
  try {
    return getRequestURL(event).protocol === 'https:'
  } catch {
    return false
  }
}

export const adminAuthCookieBase = (event: H3Event) => ({
  path: '/' as const,
  sameSite: 'lax' as const,
  secure: isHttpsRequest(event)
})
