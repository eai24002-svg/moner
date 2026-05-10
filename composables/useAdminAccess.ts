export const useAdminAccess = () => {
  const withAdminPath = (path: string) => path

  const adminFetch = async <T>(url: string, options: Record<string, any> = {}) => {
    try {
      return await $fetch<T>(url, {
        ...options
      })
    } catch (error: any) {
      if (error?.statusCode === 401) {
        await navigateTo('/admin/login')
      }

      throw error
    }
  }

  return {
    withAdminPath,
    adminFetch
  }
}
