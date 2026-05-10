export const useAdminRefresh = async (keys: string[]) => {
  await Promise.all(keys.map((key) => refreshNuxtData(key)))
}
