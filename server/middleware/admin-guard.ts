export default defineEventHandler((event) => {
  const path = event.path || ''
  const isAdminPage = path.startsWith('/admin')
  const isAdminApi = path.startsWith('/api/admin')
  const isLoginPage = path === '/admin/login'
  const isLoginApi = path === '/api/admin/login'
  const isLogoutApi = path === '/api/admin/logout'

  if (!isAdminPage && !isAdminApi) {
    return
  }

  const config = useRuntimeConfig(event)
  const expectedPassword = config.adminPassword

  if (!expectedPassword) {
    throw createError({ statusCode: 404, statusMessage: 'غير موجود' })
  }

  if (isLoginApi || isLogoutApi) {
    return
  }

  const sessionCookie = getCookie(event, 'admin_session') || ''
  const isAuthenticated = sessionCookie === expectedPassword

  if (isLoginPage) {
    if (isAuthenticated) {
      return sendRedirect(event, '/admin')
    }

    return
  }

  if (!isAuthenticated && isAdminApi) {
    throw createError({ statusCode: 401, statusMessage: 'غير مصرح' })
  }

  if (!isAuthenticated && isAdminPage) {
    const redirect = encodeURIComponent(path)
    return sendRedirect(event, `/admin/login?redirect=${redirect}`)
  }
})
