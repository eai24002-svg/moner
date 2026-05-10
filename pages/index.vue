<script setup lang="ts">
import type { Settings } from '~/types'

const {
  public: { wazeUrl, instagramUrl }
} = useRuntimeConfig()

const { data: settingsData } = await useAsyncData('home-settings', () => $fetch<{ data: Settings | null }>('/api/public/settings'))

const heroContent = computed(() => ({
  badge: settingsData.value?.data?.hero_badge || 'ROWAIDA ART EXPERIENCE',
  line1: settingsData.value?.data?.hero_title_line_1 || 'مساحة فنية راقية',
  line2: settingsData.value?.data?.hero_title_line_2 || 'تجمع السينما والفعاليات',
  line3: settingsData.value?.data?.hero_title_line_3 || 'بطابع مختلف تمامًا',
  description:
    settingsData.value?.data?.hero_description ||
    'رويدة آرت ليست مجرد موقع عروض، بل واجهة أنيقة لتجربة متكاملة تضم أفلامًا مختارة، ورشًا إبداعية، وفعاليات بهوية بصرية هادئة وفاخرة.'
}))

const featuredLinks = [
  {
    title: 'السينما',
    description: 'برنامج عرض مرتب، مقاعد واضحة، وتجربة حجز مباشرة بدون تشتيت.',
    action: 'ادخل إلى قسم السينما',
    to: '/cinema',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'غرفة الفن',
    description: 'جلسات رسم تفاعلية، ورش تطوير مهارات، وفعاليات فنية بإخراج احترافي.',
    action: 'اكتشف غرفة الفن',
    to: '/events',
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'الفعاليات',
    description: 'مواعيد مرتبة وتجربة استعراض أنظف لكل ندوة أو لقاء أو أمسية خاصة.',
    action: 'تصفح الفعاليات',
    to: '/events',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  }
]

</script>

<template>
  <section class="space-y-10 lg:space-y-14">
    <div class="section-shell surface-grid overflow-hidden">
      <div class="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-amber-300/35 to-transparent" />
      <div class="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div class="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-burgundy/20 blur-3xl" />

      <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div class="relative flex flex-col justify-between">
          <div>
            <div class="eyebrow">
              <span class="h-2 w-2 rounded-full bg-gold animate-pulseGlow" />
              <span>{{ heroContent.badge }}</span>
            </div>

            <h1 class="mt-5 max-w-4xl text-4xl font-black leading-[1.25] text-amber-50 sm:text-5xl lg:text-6xl">
              {{ heroContent.line1 }}
              <span class="block text-gold">{{ heroContent.line2 }}</span>
              <span class="block text-zinc-100">{{ heroContent.line3 }}</span>
            </h1>

            <p class="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              {{ heroContent.description }}
            </p>
          </div>

          <div class="mt-8 flex flex-col gap-4">
            <div class="flex flex-wrap gap-3">
              <NuxtLink to="/cinema" class="btn-primary">اكتشف برنامج السينما</NuxtLink>
              <NuxtLink to="/events" class="btn-secondary">تصفح الفعاليات الفنية</NuxtLink>
            </div>
          </div>
        </div>

        <div class="panel relative overflow-hidden p-5 sm:p-6">
          <div class="absolute -left-10 top-0 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
          <div class="absolute -bottom-12 right-0 h-44 w-44 rounded-full bg-burgundy/15 blur-3xl" />

          <div class="relative">
            <div class="eyebrow">الوصول والتواصل</div>
            <h2 class="mt-4 text-2xl font-black text-amber-50">
              الوصول إلى رويدة آرت
              <span class="block text-gold">والحساب الرسمي</span>
            </h2>

            <div class="mt-7 grid gap-4 sm:grid-cols-[0.92fr_1.08fr]">
              <a
                :href="wazeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative flex min-h-[220px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-sky-950/70 via-zinc-950 to-black p-6 transition-all hover:-translate-y-1 hover:border-sky-300/45 hover:shadow-glow"
              >
                <div class="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />
                <div class="relative flex h-full w-full flex-col justify-between">
                  <div class="flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-sky-400/30 bg-sky-500/10 text-2xl font-black text-sky-300">
                    W
                  </div>

                  <div>
                    <p class="text-2xl font-black text-white">موقعنا</p>
                    <p class="mt-2 text-sm text-sky-100/75">Waze</p>
                  </div>
                </div>
              </a>

              <a
                :href="instagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex min-h-[220px] items-center justify-between rounded-[1.6rem] border border-white/10 bg-gradient-to-r from-black via-zinc-950 to-zinc-900 p-6 transition-all hover:-translate-y-1 hover:border-amber-300/50 hover:shadow-glow"
              >
                <div class="flex items-center gap-4">
                  <div class="flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-pink-400/30 bg-gradient-to-br from-pink-500/20 to-orange-400/10 text-pink-300">
                    <svg viewBox="0 0 24 24" class="h-8 w-8 fill-none stroke-current" stroke-width="1.8">
                      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                      <circle cx="12" cy="12" r="4.2" />
                      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-black text-amber-50">إنستكرام</p>
                    <p class="mt-2 text-sm text-pink-200/70">Instagram</p>
                  </div>
                </div>
                <span class="text-lg font-bold text-gold transition-transform group-hover:-translate-x-1">←</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      <NuxtLink
        v-for="section in featuredLinks"
        :key="section.title"
        :to="section.to"
        class="group relative block min-h-[280px] overflow-hidden rounded-[1.85rem] border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/60 hover:shadow-glow"
      >
        <img
          :src="section.image"
          :alt="section.title"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35" />
        <div class="absolute inset-0 bg-gradient-to-r from-burgundy/20 to-amber-400/10 opacity-90" />

        <div class="relative flex h-full flex-col justify-end p-6">
          <div class="mb-4 inline-flex w-fit rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] tracking-[0.18em] text-amber-100/85">
            رحلة مصقولة
          </div>

          <h3 class="text-2xl font-black text-amber-50 transition group-hover:text-gold">
            {{ section.title }}
          </h3>
          <p class="mt-3 max-w-xs text-sm leading-7 text-zinc-200/85">
            {{ section.description }}
          </p>

          <div class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold">
            <span>{{ section.action }}</span>
            <span class="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
