<script setup lang="ts">
import type { Movie, Seat, Showtime } from '~/types'
import { getCurrentDateString, normalizeTimeString } from '~/utils/cinema-time'

definePageMeta({ layout: 'admin' })

type ShowtimeRow = Showtime & {
  movie_title: string
  seats: Seat[]
}

const { adminFetch } = useAdminAccess()
const { formatDateTime, formatTime, formatUserFacingDate } = useArabicDate()

const selectedDate = ref(getCurrentDateString())

const formMessage = ref('')
const formIsError = ref(false)
const submitting = ref(false)
const deleting = ref<Record<number, boolean>>({})

const [{ data: moviesData }, { data: showtimesData, refresh: refreshShowtimes }] = await Promise.all([
  useAsyncData('admin-showtime-movies', () => adminFetch<{ data: Movie[] }>('/api/admin/movies')),
  useAsyncData(
    'admin-showtimes',
    () => adminFetch<{ data: ShowtimeRow[], meta: { date: string } }>('/api/admin/showtimes', {
      query: { date: selectedDate.value }
    }),
    { watch: [selectedDate] }
  )
])

const activeMovies = computed(() => (moviesData.value?.data || []).filter((movie) => movie.is_active === 1))

const initialForm = {
  movie_id: 0,
  show_date: selectedDate.value,
  show_time: '19:00',
  status: 'available' as Showtime['status']
}

const form = reactive({ ...initialForm })
const editingId = ref<number | null>(null)

const seatDrafts = ref<Record<number, Seat[]>>({})
const savingSeats = ref<Record<number, boolean>>({})
const saveMessage = ref<Record<number, string>>({})

watch(selectedDate, (value) => {
  form.show_date = value
})

watch(activeMovies, () => {
  if (!form.movie_id) {
    form.movie_id = activeMovies.value[0]?.id || 0
  }
}, { immediate: true })

watchEffect(() => {
  if (!showtimesData.value?.data) {
    return
  }

  const nextDrafts: Record<number, Seat[]> = {}

  for (const show of showtimesData.value.data) {
    nextDrafts[show.id] = show.seats.map((seat) => ({ ...seat }))
  }

  seatDrafts.value = nextDrafts
})

const resetForm = () => {
  editingId.value = null
  formMessage.value = ''
  formIsError.value = false
  Object.assign(form, {
    ...initialForm,
    show_date: selectedDate.value,
    movie_id: activeMovies.value[0]?.id || 0
  })
}

const editShowtime = (row: ShowtimeRow) => {
  editingId.value = row.id
  formMessage.value = ''
  formIsError.value = false
  form.movie_id = row.movie_id
  form.show_date = row.show_date
  form.show_time = row.show_time.slice(0, 5)
  form.status = row.status
}

const submitShowtime = async () => {
  formMessage.value = ''
  formIsError.value = false

  const normalizedTime = normalizeTimeString(form.show_time)
  if (!form.movie_id || !form.show_date || !normalizedTime) {
    formIsError.value = true
    formMessage.value = 'تأكد من اختيار فيلم وتحديد تاريخ ووقت صحيح.'
    return
  }

  submitting.value = true
  try {
    const payload = {
      movie_id: form.movie_id,
      show_date: form.show_date,
      show_time: normalizedTime,
      total_seats: 10,
      status: form.status
    }

    if (editingId.value) {
      await adminFetch(`/api/admin/showtimes/${editingId.value}`, { method: 'PUT', body: payload })
      formMessage.value = 'تم تحديث العرض.'
    } else {
      await adminFetch('/api/admin/showtimes', { method: 'POST', body: payload })
      formMessage.value = 'تم إضافة العرض.'
    }

    await refreshShowtimes()
    resetForm()
  } catch {
    formIsError.value = true
    formMessage.value = 'تعذر الحفظ. قد يكون هناك عرض بنفس الوقت موجود مسبقاً.'
  } finally {
    submitting.value = false
  }
}

const deleteShowtime = async (id: number) => {
  deleting.value[id] = true
  try {
    await adminFetch(`/api/admin/showtimes/${id}`, { method: 'DELETE' })
    await refreshShowtimes()
    if (editingId.value === id) {
      resetForm()
    }
  } finally {
    deleting.value[id] = false
  }
}

const markFull = async (show: ShowtimeRow) => {
  await adminFetch(`/api/admin/showtimes/${show.id}`, {
    method: 'PUT',
    body: {
      movie_id: show.movie_id,
      show_date: show.show_date,
      show_time: show.show_time,
      total_seats: show.total_seats,
      status: 'full'
    }
  })
  await refreshShowtimes()
}

const toggleSeat = (showId: number, seatNumber: number) => {
  const seats = seatDrafts.value[showId]
  if (!seats) return

  const seat = seats.find((item) => item.seat_number === seatNumber)
  if (!seat) return

  seat.is_booked = seat.is_booked === 1 ? 0 : 1
}

const saveSeats = async (showId: number) => {
  savingSeats.value[showId] = true
  saveMessage.value[showId] = ''

  try {
    const draft = seatDrafts.value[showId] || []
    await adminFetch(`/api/admin/showtimes/${showId}/seats`, {
      method: 'PUT',
      body: {
        seats: draft.map((seat) => ({
          seat_number: seat.seat_number,
          is_booked: seat.is_booked
        }))
      }
    })
    await refreshShowtimes()
    saveMessage.value[showId] = 'تم حفظ المقاعد'
  } finally {
    savingSeats.value[showId] = false
  }
}

const arabicStatus = (status: ShowtimeRow['status']) => {
  if (status === 'available') return 'متاح'
  if (status === 'limited') return 'محدود'
  if (status === 'full') return 'ممتلئ'
  if (status === 'expired') return 'منتهي'
  return 'مغلق'
}
</script>

<template>
  <section class="space-y-6">
    <div class="section-shell">
      <div class="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <div class="eyebrow">SHOWTIME CONTROL</div>
          <h1 class="mt-4 text-3xl font-black text-amber-50">إدارة مواعيد العرض (يدوي بالكامل)</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            أضف عرضاً بدقة (فيلم + تاريخ + وقت)، عدّل أو احذف، ثم أدِر المقاعد لكل عرض بشكل مباشر.
          </p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="stat-card">
            <p class="text-xs tracking-[0.22em] text-zinc-500">SELECTED DATE</p>
            <p class="mt-2 text-lg font-bold text-amber-50">{{ formatUserFacingDate(selectedDate) }}</p>
          </div>
          <div class="stat-card">
            <p class="text-xs tracking-[0.22em] text-zinc-500">MODE</p>
            <p class="mt-2 text-lg font-bold text-amber-50">Manual CRUD</p>
          </div>
        </div>
      </div>
    </div>

    <div class="panel space-y-4 p-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-amber-100">{{ editingId ? 'تعديل عرض' : 'إضافة عرض جديد' }}</h2>
          <p class="text-xs text-zinc-400">المقاعد تُنشأ تلقائياً عند إضافة عرض جديد.</p>
        </div>
        <label class="flex items-center gap-2 text-sm text-zinc-300">
          <span>تاريخ العرض</span>
          <input v-model="selectedDate" type="date" class="admin-input min-w-[220px]">
        </label>
      </div>

      <form class="grid gap-3 md:grid-cols-4" @submit.prevent="submitShowtime">
        <select v-model.number="form.movie_id" class="admin-input md:col-span-2" required>
          <option :value="0" disabled>اختر فيلم</option>
          <option v-for="movie in activeMovies" :key="movie.id" :value="movie.id">
            {{ movie.title }}
          </option>
        </select>
        <input v-model="form.show_time" type="time" class="admin-input" required>
        <select v-model="form.status" class="admin-input">
          <option value="available">متاح</option>
          <option value="limited">محدود</option>
          <option value="full">ممتلئ</option>
          <option value="closed">مغلق</option>
        </select>

        <div class="md:col-span-4 flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs text-zinc-500">
            التاريخ المختار: <span class="font-semibold text-amber-100">{{ formatUserFacingDate(selectedDate) }}</span>
          </p>
          <button class="btn-primary px-4 py-2 text-sm" :disabled="submitting">
            {{ submitting ? 'جاري الحفظ...' : (editingId ? 'تحديث العرض' : 'إضافة العرض') }}
          </button>
          <button type="button" class="btn-ghost" @click="resetForm">إلغاء/تفريغ</button>
        </div>
      </form>

      <p v-if="formMessage" class="text-sm" :class="formIsError ? 'text-red-300' : 'text-emerald-300'">
        {{ formMessage }}
      </p>
    </div>

    <div class="panel flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <h2 class="text-lg font-semibold text-amber-100">عروض اليوم</h2>
        <p class="text-xs text-zinc-400">تظهر للمستخدم حسب نفس التاريخ والوقت.</p>
      </div>
    </div>

    <div v-if="!showtimesData?.data.length" class="panel p-4">
      لا توجد عروض لهذا اليوم بعد.
    </div>

    <div v-else class="space-y-3">
      <div class="panel flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
        <p class="text-zinc-300">
          اليوم الحالي:
          <span class="font-semibold text-amber-100">{{ formatUserFacingDate(showtimesData.meta.date) }}</span>
        </p>
        <p class="text-zinc-500">عدد العروض: {{ showtimesData.data.length }}</p>
      </div>

      <div v-for="show in showtimesData.data" :key="show.id" class="panel space-y-5 p-5">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="font-semibold text-amber-100">{{ show.movie_title }}</p>
            <p class="mt-1 text-sm text-zinc-400">{{ formatDateTime(show.show_date, show.show_time) }}</p>
            <p class="mt-1 text-xs text-zinc-500">{{ arabicStatus(show.status) }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="btn-ghost px-3 py-2 text-sm" @click="editShowtime(show)">تعديل</button>
            <button class="btn-ghost border-amber-500/25 text-amber-100" @click="markFull(show)">تعيين كممتلئ</button>
            <button
              class="rounded-2xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              :disabled="deleting[show.id]"
              @click="deleteShowtime(show.id)"
            >
              {{ deleting[show.id] ? 'جاري الحذف...' : 'حذف' }}
            </button>
          </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-[1fr_auto]">
          <div>
            <p class="mb-3 text-sm font-semibold text-amber-100">إدارة المقاعد</p>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="seat in seatDrafts[show.id] || []"
                :key="seat.id"
                type="button"
                class="flex h-11 items-center justify-center rounded-xl border text-sm font-bold transition-all"
                :class="seat.is_booked === 1 ? 'border-red-500/30 bg-red-700/90 text-white' : 'border-emerald-400/25 bg-emerald-600/90 text-white'"
                @click="toggleSeat(show.id, seat.seat_number)"
              >
                {{ seat.seat_number }}
              </button>
            </div>
          </div>

          <div class="grid gap-3 xl:min-w-[220px]">
            <div class="stat-card">
              <p class="text-xs tracking-[0.22em] text-zinc-500">SHOWTIME</p>
              <p class="mt-2 text-base font-bold text-amber-50">{{ formatTime(show.show_time) }}</p>
            </div>
            <div class="stat-card">
              <p class="text-xs tracking-[0.22em] text-zinc-500">STATUS</p>
              <p class="mt-2 text-base font-bold text-amber-50">{{ arabicStatus(show.status) }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="btn-primary px-4 py-2 text-sm"
            :disabled="savingSeats[show.id]"
            @click="saveSeats(show.id)"
          >
            {{ savingSeats[show.id] ? 'جاري الحفظ...' : 'حفظ المقاعد' }}
          </button>
          <p v-if="saveMessage[show.id]" class="text-sm text-emerald-300">{{ saveMessage[show.id] }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
