<script setup lang="ts">
const route = useRoute()
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const navItems = [
  { label: 'الرئيسية', to: '/' },
  { label: 'السينما', to: '/cinema' },
  { label: 'غرفة الفن والفعاليات', to: '/events' }
]

const isActive = (path: string) => route.path === path

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)

onMounted(() => {
  const update = () => {
    isScrolled.value = window.scrollY > 6
  }
  update()
  window.addEventListener('scroll', update, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', update))
})
</script>

<template>
  <header class="sticky top-0 z-40 pt-3">
    <div class="container-premium">
      <div
        class="panel-soft rounded-[1.75rem] border border-white/10 bg-black/45 px-4 py-3 shadow-soft backdrop-blur-xl transition-all sm:px-5"
        :class="isScrolled ? 'bg-black/55 shadow-card' : ''"
      >
        <div class="flex items-center justify-between gap-4">
          <NuxtLink to="/" class="group relative flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/10 to-white/5 text-lg font-black text-gold shadow-inset">
              ر
            </div>
            <span class="flex flex-col leading-tight">
              <span class="brand-title text-lg font-extrabold tracking-[0.08em] sm:text-xl">رويدة آرت</span>
              <span dir="ltr" class="text-[11px] tracking-[0.24em] text-amber-200/70 transition group-hover:text-amber-100">
                ROWAIDA ART
              </span>
            </span>
          </NuxtLink>

          <nav class="hidden items-center gap-1 rounded-[1.25rem] border border-white/10 bg-white/5 p-1.5 text-sm lg:flex">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="nav-pill"
              :class="isActive(item.to) ? 'bg-amber-300/10 text-amber-50 shadow-inset' : ''"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <div class="hidden items-center gap-2 lg:flex">
            <NuxtLink to="/cinema" class="btn-secondary px-4 py-2.5 text-sm">احجز الآن</NuxtLink>
          </div>

          <button
            type="button"
            class="btn-ghost lg:hidden"
            :aria-expanded="mobileMenuOpen"
            aria-label="فتح القائمة"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span class="text-lg">{{ mobileMenuOpen ? '×' : '≡' }}</span>
          </button>
        </div>

        <div v-if="mobileMenuOpen" class="mt-4 space-y-3 border-t border-white/10 pt-4 lg:hidden">
          <nav class="grid gap-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="rounded-2xl border px-4 py-3 text-sm font-medium transition-all"
              :class="isActive(item.to) ? 'border-amber-300/35 bg-amber-300/10 text-amber-50' : 'border-white/10 bg-white/5 text-zinc-200'"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
          <NuxtLink to="/cinema" class="btn-primary flex w-full">ابدأ من برنامج السينما</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
