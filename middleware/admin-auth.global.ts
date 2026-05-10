export default defineNuxtRouteMiddleware((to) => {
  const isAdminRoute = to.path.startsWith('/admin')
  const isLoginRoute = to.path === '/admin/login'

  if (!isAdminRoute) {
    return
  }

  const loggedIn = useCookie('admin_logged_in')
  const hasSession = loggedIn.value === '1'

  if (isLoginRoute && hasSession) {
    return navigateTo('/admin')
  }

  if (!isLoginRoute && !hasSession) {
    return navigateTo({
      path: '/admin/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
})
