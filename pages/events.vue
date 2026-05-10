<script setup lang="ts">
import type { EventItem, Settings } from '~/types'

const [{ data: eventsData, status, error }, { data: settingsData }] = await Promise.all([
  useAsyncData('public-events', () => $fetch<{ data: EventItem[] }>('/api/public/events')),
  useAsyncData('public-settings-events', () => $fetch<{ data: Settings | null }>('/api/public/settings'))
])

const eventCount = computed(() => eventsData.value?.data.length || 0)
</script>

<template>
  <section class="space-y-6 lg:space-y-8">
    <SectionTitle
      title="غرفة الفن والفعاليات"
      badge="EVENTS EXPERIENCE"
      subtitle="انضم إلى جلسات الرسم، ورش العمل، الندوات، وأمسيات اللاونج المختارة."
    />

    <div class="section-shell">
      <div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <div class="eyebrow">برنامج متجدد</div>
          <h2 class="mt-4 text-2xl font-black text-amber-50">استعراض الفعاليات أصبح أوضح وأقرب للمستخدم</h2>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            كل بطاقة تعرض الموعد والسعة ونوع الفعالية بأسلوب أبسط وأكثر احترافية، مع إبراز سريع لما يهم المستخدم فعلاً قبل التواصل للحجز.
          </p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="stat-card">
            <p class="text-xs tracking-[0.22em] text-zinc-500">ACTIVE EVENTS</p>
            <p class="mt-2 text-lg font-bold text-amber-50">{{ eventCount }} فعالية</p>
          </div>
          <div class="stat-card">
            <p class="text-xs tracking-[0.22em] text-zinc-500">BOOKING FLOW</p>
            <p class="mt-2 text-lg font-bold text-amber-50">تواصل مباشر وواضح</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="status === 'pending'" class="panel p-6 text-zinc-300">جاري تحميل الفعاليات...</div>
    <div v-else-if="error" class="panel p-6 text-red-300">تعذر تحميل الفعاليات حالياً.</div>
    <div v-else-if="!eventsData?.data.length" class="panel p-6 text-zinc-300">لا توجد فعاليات متاحة الآن.</div>

    <div v-else class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <EventCard
        v-for="eventItem in eventsData.data"
        :key="eventItem.id"
        :event-item="eventItem"
        :settings="settingsData?.data || null"
      />
    </div>
  </section>
</template>
