import { saveUploadedImage } from '~/server/utils/uploads'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData?.length) {
    throw createError({ statusCode: 400, statusMessage: 'لم يتم إرسال ملف' })
  }

  const file = formData.find((item) => item.name === 'file' && item.filename)
  const folderField = formData.find((item) => item.name === 'folder')
  const folderValue = folderField?.data?.toString('utf8')

  if (!file || !folderValue || !['movies', 'events'].includes(folderValue)) {
    throw createError({ statusCode: 400, statusMessage: 'بيانات الرفع غير صحيحة' })
  }

  const url = await saveUploadedImage(
    {
      filename: file.filename,
      type: file.type,
      data: file.data
    },
    folderValue as 'movies' | 'events'
  )

  return {
    data: {
      url
    }
  }
})
