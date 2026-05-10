import { mkdir, writeFile } from 'node:fs/promises'
import { basename, extname, isAbsolute, join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])

const sanitizeName = (name: string) =>
  basename(name)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')

export const saveUploadedImage = async (file: { filename?: string; type?: string; data: Buffer }, folder: 'movies' | 'events') => {
  if (!file.type || !allowedMimeTypes.has(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'نوع الملف غير مدعوم' })
  }

  const filename = sanitizeName(file.filename || 'image')
  const extension = extname(filename) || '.jpg'
  const finalName = `${Date.now()}-${randomUUID()}${extension}`
  const config = useRuntimeConfig()
  const baseUploadDir = isAbsolute(config.uploadDir)
    ? config.uploadDir
    : resolve(process.cwd(), config.uploadDir)
  const targetDir = join(baseUploadDir, folder)

  await mkdir(targetDir, { recursive: true })
  await writeFile(join(targetDir, finalName), file.data)

  return `/uploads/${folder}/${finalName}`
}
