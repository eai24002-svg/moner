<script setup lang="ts">
import type { Movie, Settings } from '~/types'
import { addDaysToDateString, getCurrentDateString, normalizeDateString } from '~/utils/cinema-time'

const { formatSmartDay, formatWeekday, formatDayMonth, formatUserFacingDate } = useArabicDate()

const route = useRoute()
const todayDate = getCurrentDateString()
const initialDate = typeof route.query.date === 'string' ? normalizeDateString(route.query.date) : ''
const selectedDate = ref(initialDate || todayDate)

const dateOptions = computed(() => {
  // Simpler: always show the next 7 days (today included).
  return Array.from({ length: 7 }, (_, offset) => {
    const date = addDaysToDateString(todayDate, offset)

    return {
      value: date,
      label: formatSmartDay(date),
      weekday: formatWeekday(date),
      dayMonth: formatDayMonth(date)
    }
  })
})

watch(selectedDate, async (value) => {
  if (route.query.date === value) {
    return
  }

  await navigateTo({ path: route.path, query: { ...route.query, date: value } }, { replace: true })
})

const [{ data: moviesData, status, error }, { data: settingsData }] = await Promise.all([
  useAsyncData(
    'public-movies',
    () => $fetch<{ data: Movie[], meta: { date: string } }>('/api/public/movies', {
      query: { date: selectedDate.value }
    }),
    { watch: [selectedDate] }
  ),
  useAsyncData('public-settings-cinema', () => $fetch<{ data: Settings | null }>('/api/public/settings'))
])

const totalShowtimes = computed(() => {
  const movies = moviesData.value?.data || []
  return movies.reduce((sum, movie) => sum + (movie.showtimes?.length || 0), 0)
})
</script>

<template>
  <section class="space-y-6 lg:space-y-8">
    <SectionTitle
      title="برنامج السينما"
      badge="CINEMA PROGRAM"
      subtitle="اختر اليوم، شاهد المقاعد المتاحة، ثم أكمل الحجز مباشرة عبر واتساب."
    />

    <div class="section-shell space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm font-semibold text-amber-100">اختر اليوم</p>
        <p class="text-xs text-zinc-500">يعرض فقط العروض المتاحة لهذا اليوم</p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          v-for="option in dateOptions"
          :key="option.value"
          type="button"
          class="rounded-[1.5rem] border p-4 text-right transition-all duration-300 ease-premium"
          :class="selectedDate === option.value ? 'border-amber-300/40 bg-amber-300/10 text-amber-50 shadow-glow' : 'border-white/10 bg-black/20 text-zinc-200 hover:border-white/20 hover:bg-white/10'"
          @click="selectedDate = option.value"
        >
          <span class="block text-sm font-semibold">{{ option.label }}</span>
          <span class="mt-1 block text-base font-bold">{{ option.weekday }}</span>
          <span class="mt-1 block text-xs text-zinc-400">{{ option.dayMonth }}</span>
        </button>
      </div>
    </div>

    <div v-if="status === 'pending'" class="panel p-6 text-zinc-300">جاري تحميل العروض...</div>
    <div v-else-if="error" class="panel p-6 text-red-300">تعذر تحميل بيانات السينما. حاول مرة أخرى.</div>
    <div v-else-if="!moviesData?.data.length" class="panel p-6 text-zinc-300">
      لا توجد عروض متاحة لهذا اليوم.
      <span class="block mt-2 text-xs text-zinc-500">جرّب اختيار يوم آخر، أو أضف عروضاً من لوحة التحكم.</span>
    </div>

    <div v-else class="space-y-5">
      <div class="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div class="panel p-5 text-sm">
          <p class="text-zinc-400">العروض المتاحة</p>
          <p class="mt-2 text-xl font-bold text-amber-50">{{ formatUserFacingDate(moviesData.meta.date) }}</p>
          <p class="mt-2 text-sm text-zinc-400">المواعيد تعرض بصياغة عربية أوضح وتبقى عملية في الاختيار السريع.</p>
        </div>
        <div class="panel flex items-center justify-between gap-6 p-5 text-sm lg:min-w-[260px]">
          <div>
            <p class="text-zinc-500">عدد العروض</p>
            <p class="mt-2 text-2xl font-black text-amber-50">{{ totalShowtimes }}</p>
          </div>
          <div class="h-12 w-px bg-white/10" />
          <div>
            <p class="text-zinc-500">الأفلام</p>
            <p class="mt-2 text-2xl font-black text-amber-50">{{ moviesData.data.length }}</p>
          </div>
        </div>
      </div>

      <MovieCard
        v-for="movie in moviesData.data"
        :key="movie.id"
        :movie="movie"
        :settings="settingsData?.data || null"
      />
    </div>
  </section>
</template>
