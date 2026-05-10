<script setup lang="ts">
import type { Movie, Settings, ShowStatus, Showtime } from '~/types'
import { isShowtimeExpired } from '~/utils/cinema-time'

const props = defineProps<{
  movie: Movie
  settings: Settings | null
}>()

const { callHref, whatsappHref } = useContactActions()
const { formatDateSupportLabel, formatNumericDate, formatTime, formatUserFacingDate } = useArabicDate()

const selectedShowtimeId = ref<number | null>(null)
const selectedSeats = ref<number[]>([])
const customerName = ref('')
const customerPhone = ref('')
const nowTick = ref(Date.now())
/** DOM timers are `number` here; Node typings use `Timeout` — keep client-only and use `number`. */
let nowTimer: number | null = null

const statusLabel = (status: ShowStatus) => {
  if (status === 'limited') return 'محدود'
  if (status === 'full') return 'ممتلئ'
  if (status === 'closed') return 'مغلق'
  if (status === 'expired') return 'منتهي'
  return 'متاح'
}

const isBookingDisabledStatus = (status: ShowStatus) => ['full', 'closed', 'expired'].includes(status)
const resolveShowtimeStatus = (showtime: Showtime): ShowStatus => {
  void nowTick.value

  if (showtime.status === 'closed') {
    return 'closed'
  }

  if (isShowtimeExpired(showtime.show_date, showtime.show_time, new Date(nowTick.value))) {
    return 'expired'
  }

  return showtime.status
}

const activeShowtime = computed<Showtime | null>(() => {
  return props.movie.showtimes?.find((showtime) => showtime.id === selectedShowtimeId.value) || null
})
const activeShowtimeStatus = computed<ShowStatus | null>(() => (activeShowtime.value ? resolveShowtimeStatus(activeShowtime.value) : null))

const selectedSeatLabel = computed(() => [...selectedSeats.value].sort((left, right) => left - right).join('، '))
const bookedSeatsCount = computed(() => activeShowtime.value?.seats?.filter((seat) => seat.is_booked).length || 0)
const availableSeatsCount = computed(() => {
  if (!activeShowtime.value?.seats?.length) return 0
  return activeShowtime.value.seats.length - bookedSeatsCount.value
})
const canBookActiveShowtime = computed(() => (activeShowtimeStatus.value ? !isBookingDisabledStatus(activeShowtimeStatus.value) : false))
const visibleAvailableSeatsCount = computed(() => (canBookActiveShowtime.value ? availableSeatsCount.value : 0))
const showtimeDetails = (showtime: Showtime) => `${formatUserFacingDate(showtime.show_date)}، ${formatTime(showtime.show_time)}`

const whatsappMessage = computed(() => {
  const showtime = activeShowtime.value

  if (!showtime || !selectedSeats.value.length) {
    return `مرحباً، أرغب بحجز فيلم ${props.movie.title}.`
  }

  const lines = [
    'مرحباً، أرغب بحجز عبر واتساب.',
    `الفيلم: ${props.movie.title}`,
    `الموعد: ${showtimeDetails(showtime)}`,
    `المقاعد: ${selectedSeatLabel.value}`
  ]

  if (customerName.value.trim()) {
    lines.push(`الاسم: ${customerName.value.trim()}`)
  }

  if (customerPhone.value.trim()) {
    lines.push(`الهاتف: ${customerPhone.value.trim()}`)
  }

  return lines.join('\n')
})

const bookingHref = computed(() => whatsappHref(props.settings?.whatsapp_number, whatsappMessage.value))

const selectShowtime = (showtimeId: number) => {
  selectedShowtimeId.value = showtimeId
  selectedSeats.value = []
}

const toggleSeat = (seatNumber: number) => {
  if (!activeShowtime.value || !canBookActiveShowtime.value) {
    return
  }

  const isBooked = activeShowtime.value.seats?.some((seat) => seat.seat_number === seatNumber && seat.is_booked)

  if (isBooked) {
    return
  }

  if (selectedSeats.value.includes(seatNumber)) {
    selectedSeats.value = selectedSeats.value.filter((value) => value !== seatNumber)
    return
  }

  selectedSeats.value = [...selectedSeats.value, seatNumber]
}

watch(
  () => props.movie.showtimes,
  (showtimes) => {
    const firstShowtimeId = showtimes?.find((showtime) => !isBookingDisabledStatus(resolveShowtimeStatus(showtime)))?.id || showtimes?.[0]?.id || null
    const hasCurrentShowtime = showtimes?.some((showtime) => showtime.id === selectedShowtimeId.value)

    if (!hasCurrentShowtime) {
      selectedShowtimeId.value = firstShowtimeId
      selectedSeats.value = []
    }
  },
  { immediate: true }
)

onMounted(() => {
  nowTimer = window.setInterval(() => {
    nowTick.value = Date.now()
  }, 30000)
})

onBeforeUnmount(() => {
  if (nowTimer) {
    window.clearInterval(nowTimer)
  }
})
</script>

<template>
  <article class="panel overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow">
    <div class="grid gap-0 lg:grid-cols-[330px,1fr]">
      <div class="relative min-h-[300px] overflow-hidden">
        <img :src="movie.poster_url" :alt="movie.title" class="absolute inset-0 h-full w-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div class="absolute inset-x-0 bottom-0 p-5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="chip bg-black/35 text-amber-50">{{ movie.classification }}</span>
            <span class="chip bg-black/35">{{ movie.duration_minutes }} دقيقة</span>
          </div>
          <p class="mt-3 text-xl font-black text-white">{{ movie.title }}</p>
        </div>
      </div>

      <div class="space-y-6 p-5 sm:p-6">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div class="eyebrow">تجربة الحجز</div>
            <h3 class="mt-4 text-2xl font-black text-amber-50">{{ movie.title }}</h3>
            <p class="mt-3 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">{{ movie.description }}</p>
          </div>

          <div class="min-w-[220px]">
            <div class="stat-card">
              <p class="text-xs tracking-[0.22em] text-zinc-500">CATEGORY</p>
              <p class="mt-2 text-lg font-bold text-amber-50">{{ movie.classification }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-sm">
          <a :href="movie.trailer_url" target="_blank" class="btn-secondary px-4 py-2.5 text-sm">
            مشاهدة الإعلان
          </a>
          <a :href="callHref(settings?.phone_number)" class="btn-ghost">
            اتصال مباشر
          </a>
          <a v-if="settings?.whatsapp_number" :href="whatsappHref(settings.whatsapp_number, `مرحباً، أريد الاستفسار عن فيلم ${movie.title}.`)" target="_blank" class="btn-ghost">
            واتساب
          </a>
        </div>

        <div v-if="movie.showtimes?.length" class="space-y-4">
          <div>
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-amber-100">اختر الموعد المناسب</p>
              <span class="text-xs text-zinc-500">اختر وقتاً ثم اختر مقاعدك</span>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <button
                v-for="showtime in movie.showtimes"
                :key="showtime.id"
                type="button"
                class="rounded-[1.4rem] border p-4 text-right transition-all duration-300 ease-premium"
                :class="[
                  selectedShowtimeId === showtime.id
                    ? 'border-amber-300/40 bg-amber-300/10 text-amber-50 shadow-glow'
                    : 'border-white/10 bg-black/20 text-zinc-100 hover:border-white/20 hover:bg-white/10',
                  isBookingDisabledStatus(resolveShowtimeStatus(showtime)) ? 'opacity-70' : ''
                ]"
                @click="selectShowtime(showtime.id)"
              >
                <span class="text-xs text-zinc-500">{{ formatDateSupportLabel(showtime.show_date) }}</span>
                <span class="mt-1 block text-lg font-black">{{ formatTime(showtime.show_time) }}</span>
                <span class="mt-1 block text-sm text-zinc-300">{{ formatUserFacingDate(showtime.show_date) }}</span>
                <span class="mt-2 block text-xs text-zinc-500">{{ formatNumericDate(showtime.show_date) }} • {{ statusLabel(resolveShowtimeStatus(showtime)) }}</span>
              </button>
            </div>
          </div>

          <div v-if="activeShowtime" class="panel-soft rounded-[1.6rem] border border-white/10 bg-black/25 p-4 sm:p-5">
            <div class="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-start">
              <div>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-amber-100">المقاعد المتاحة</p>
                    <p class="mt-1 text-sm text-zinc-400">{{ showtimeDetails(activeShowtime) }}</p>
                  </div>
                  <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="{
                    'bg-emerald-600/30 text-emerald-300': activeShowtimeStatus === 'available',
                    'bg-amber-600/30 text-amber-200': activeShowtimeStatus === 'limited',
                    'bg-red-700/30 text-red-300': activeShowtimeStatus === 'full' || activeShowtimeStatus === 'closed',
                    'bg-zinc-700/50 text-zinc-200': activeShowtimeStatus === 'expired'
                  }">
                    {{ statusLabel(activeShowtimeStatus || 'closed') }}
                  </span>
                </div>
              </div>

              <div class="flex flex-wrap gap-3 text-xs text-zinc-400 xl:flex-col xl:text-right">
                <span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded bg-emerald-600/80" /> متاح</span>
                <span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded bg-red-700/80" /> محجوز</span>
                <span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded bg-gold" /> اختيارك</span>
              </div>
            </div>

            <div class="mt-5 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <SeatGrid
                :seats="activeShowtime.seats || []"
                :selectable="canBookActiveShowtime"
                :selected-seats="selectedSeats"
                @toggle-seat="toggleSeat"
              />
            </div>

            <div class="mt-5 grid gap-3 md:grid-cols-2">
              <input
                v-model="customerName"
                class="input-premium"
                placeholder="الاسم (اختياري)"
              >
              <input
                v-model="customerPhone"
                class="input-premium"
                placeholder="رقم الهاتف (اختياري)"
              >
            </div>

            <div class="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p class="text-xs text-zinc-500">المقاعد المختارة</p>
                <p class="mt-2 text-sm font-medium text-zinc-200">
                  {{ selectedSeatLabel || 'لم يتم اختيار مقاعد بعد' }}
                </p>
              </div>

              <a
                v-if="selectedSeats.length && canBookActiveShowtime"
                :href="bookingHref"
                target="_blank"
                class="btn-primary"
              >
                احجز عبر واتساب
              </a>
              <button
                v-else-if="activeShowtimeStatus && isBookingDisabledStatus(activeShowtimeStatus)"
                type="button"
                disabled
                class="cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-500"
              >
                {{ activeShowtimeStatus === 'expired' ? 'انتهى وقت هذا العرض' : `هذا العرض ${statusLabel(activeShowtimeStatus)}` }}
              </button>
              <button
                v-else
                type="button"
                disabled
                class="cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-500"
              >
                اختر المقاعد أولاً
              </button>
            </div>
          </div>
        </div>

        <div v-else class="rounded-[1.4rem] border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
          لا توجد مواعيد متاحة لهذا الفيلم في اليوم المحدد.
        </div>
      </div>
    </div>
  </article>
</template>
