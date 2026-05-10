export const apiError = (statusCode: number, statusMessage: string) => {
  throw createError({ statusCode, statusMessage })
}
