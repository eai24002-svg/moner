<script setup lang="ts">
import type { EventItem, Settings } from '~/types'

const props = defineProps<{
  eventItem: EventItem
  settings: Settings | null
}>()

const { whatsappHref } = useContactActions()
const { formatDateSupportLabel, formatDateTime, formatTime, formatUserFacingDate } = useArabicDate()

const prettyType = (type: string) => {
  if (type === 'drawing') return 'رسم'
  if (type === 'workshop') return 'ورشة'
  if (type === 'seminar') return 'ندوة'
  return 'لاونج'
}

const bookingCopy = computed(() => `مرحباً، أرغب بالحجز في فعالية ${props.eventItem.title} يوم ${formatDateTime(props.eventItem.event_date, props.eventItem.event_time)}.`)
</script>

<template>
  <article class="panel overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow">
    <div class="relative">
      <img :src="eventItem.image_url" :alt="eventItem.title" class="h-56 w-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
      <div class="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
        <span class="chip bg-black/35 text-amber-50">{{ prettyType(eventItem.event_type) }}</span>
        <span class="chip bg-black/35">{{ formatDateSupportLabel(eventItem.event_date) }}</span>
      </div>
      <div class="absolute inset-x-0 bottom-0 p-4">
        <p class="text-xl font-black text-white">{{ eventItem.title }}</p>
      </div>
    </div>

    <div class="space-y-4 p-5">
      <p class="text-sm leading-7 text-zinc-300">{{ eventItem.description }}</p>

      <div class="grid gap-3 sm:grid-cols-2">
        <div class="stat-card">
          <p class="text-xs tracking-[0.22em] text-zinc-500">DATE</p>
          <p class="mt-2 text-base font-bold text-amber-50">{{ formatUserFacingDate(eventItem.event_date) }}</p>
          <p class="mt-1 text-xs text-zinc-500">{{ formatTime(eventItem.event_time) }}</p>
        </div>
        <div class="stat-card">
          <p class="text-xs tracking-[0.22em] text-zinc-500">CAPACITY</p>
          <p class="mt-2 text-base font-bold text-amber-50">{{ eventItem.available_seats }} / {{ eventItem.capacity }}</p>
          <p class="mt-1 text-xs text-zinc-500">المقاعد المتاحة من إجمالي السعة</p>
        </div>
      </div>

      <div class="rounded-[1.3rem] border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
        {{ formatDateTime(eventItem.event_date, eventItem.event_time) }}
      </div>

      <a
        :href="whatsappHref(settings?.whatsapp_number, bookingCopy)"
        target="_blank"
        class="btn-primary flex w-full"
      >
        تواصل للحجز
      </a>
    </div>
  </article>
</template>
