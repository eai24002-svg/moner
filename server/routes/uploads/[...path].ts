import { access, stat } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { isAbsolute, normalize, relative, resolve } from 'node:path'

const contentTypeMap: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const routePath = getRouterParam(event, 'path')

  if (!routePath) {
    throw createError({ statusCode: 404, statusMessage: 'الصورة غير موجودة' })
  }

  const parts = routePath.split('/').filter(Boolean)
  const relativePath = normalize(parts.join('/'))

  if (relativePath.includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'مسار غير صالح' })
  }

  const baseUploadDir = resolve(
    isAbsolute(config.uploadDir) ? config.uploadDir : resolve(process.cwd(), config.uploadDir)
  )
  const filePath = resolve(baseUploadDir, relativePath)
  const pathOutsideBase = relative(baseUploadDir, filePath).startsWith('..')

  if (pathOutsideBase) {
    throw createError({ statusCode: 400, statusMessage: 'مسار غير صالح' })
  }

  try {
    await access(filePath)
    const fileStat = await stat(filePath)
    const extension = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()

    setHeader(event, 'Content-Type', contentTypeMap[extension] || 'application/octet-stream')
    setHeader(event, 'Content-Length', fileStat.size)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

    return sendStream(event, createReadStream(filePath))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'الصورة غير موجودة' })
  }
})
