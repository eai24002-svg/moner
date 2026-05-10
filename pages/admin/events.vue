<script setup lang="ts">
import type { EventItem } from '~/types'

definePageMeta({ layout: 'admin' })

const { adminFetch } = useAdminAccess()
const { formatDateTime } = useArabicDate()

const { data, refresh } = await useAsyncData('admin-events', () => adminFetch<{ data: EventItem[] }>('/api/admin/events'))

const initialForm = {
  title: '',
  description: '',
  event_type: 'drawing',
  event_date: '',
  event_time: '',
  capacity: 20,
  available_seats: 20,
  image_url: '',
  is_active: 1
}
const form = reactive({ ...initialForm })
const editingId = ref<number | null>(null)
const uploadingImage = ref(false)

const uploadEventImage = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingImage.value = true

  try {
    const multipart = new FormData()
    multipart.append('file', file)
    multipart.append('folder', 'events')

    const response = await adminFetch<{ data: { url: string } }>('/api/admin/upload', {
      method: 'POST',
      body: multipart
    })

    form.image_url = response.data.url
  } finally {
    uploadingImage.value = false
    input.value = ''
  }
}

const save = async () => {
  if (editingId.value) {
    await adminFetch(`/api/admin/events/${editingId.value}`, { method: 'PUT', body: form })
  } else {
    await adminFetch('/api/admin/events', { method: 'POST', body: form })
  }
  await refresh()
  Object.assign(form, initialForm)
  editingId.value = null
}

const edit = (eventItem: EventItem) => {
  editingId.value = eventItem.id
  Object.assign(form, eventItem)
}

const remove = async (id: number) => {
  await adminFetch(`/api/admin/events/${id}`, { method: 'DELETE' })
  await refresh()
}

const typeLabel = (type: EventItem['event_type']) => {
  if (type === 'drawing') return 'رسم'
  if (type === 'workshop') return 'ورشة'
  if (type === 'seminar') return 'ندوة'
  return 'لاونج'
}
</script>

<template>
  <section class="space-y-6">
    <div class="section-shell">
      <div class="eyebrow">EVENT MANAGEMENT</div>
      <h1 class="mt-4 text-3xl font-black text-amber-50">إدارة الفعاليات</h1>
      <p class="mt-3 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">أضف الفعالية، حدّد الموعد والسعة، وراجع القائمة داخل تخطيط أكثر وضوحًا.</p>
    </div>

    <form class="panel grid gap-3 p-4 md:grid-cols-2" @submit.prevent="save">
      <input v-model="form.title" class="admin-input" placeholder="عنوان الفعالية" required>
      <select v-model="form.event_type" class="admin-input">
        <option value="drawing">رسم</option>
        <option value="workshop">ورشة</option>
        <option value="seminar">ندوة</option>
        <option value="lounge">لاونج</option>
      </select>
      <textarea v-model="form.description" class="admin-input md:col-span-2" rows="3" placeholder="وصف الفعالية" />
      <input v-model="form.event_date" type="date" class="admin-input">
      <input v-model="form.event_time" type="time" class="admin-input">
      <input v-model.number="form.capacity" type="number" class="admin-input" placeholder="السعة">
      <input v-model.number="form.available_seats" type="number" class="admin-input" placeholder="المقاعد المتاحة">
      <div class="space-y-2 md:col-span-2">
        <input type="file" accept="image/png,image/jpeg,image/webp" class="admin-input" @change="uploadEventImage">
        <p class="text-xs text-zinc-500">{{ uploadingImage ? 'جاري رفع الصورة...' : 'ارفع صورة الفعالية من جهازك' }}</p>
      </div>
      <div v-if="form.image_url" class="md:col-span-2">
        <img :src="form.image_url" alt="Event preview" class="h-40 w-full max-w-xs rounded-2xl object-cover">
      </div>
      <button class="btn-primary md:col-span-2">{{ editingId ? 'تحديث' : 'إضافة' }} فعالية</button>
    </form>

    <div v-if="!data?.data.length" class="panel p-4">لا توجد فعاليات بعد.</div>
    <div v-else class="space-y-3">
      <div v-for="eventItem in data.data" :key="eventItem.id" class="panel flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="font-semibold text-amber-100">{{ eventItem.title }}</p>
          <p class="text-sm text-zinc-400">{{ typeLabel(eventItem.event_type) }} - {{ formatDateTime(eventItem.event_date, eventItem.event_time) }}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-ghost px-3 py-2 text-sm" @click="edit(eventItem)">تعديل</button>
          <button class="rounded-2xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-300" @click="remove(eventItem.id)">حذف</button>
        </div>
      </div>
    </div>
  </section>
</template>
