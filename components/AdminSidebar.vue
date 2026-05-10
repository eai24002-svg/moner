<script setup lang="ts">
const { withAdminPath } = useAdminAccess()
const loggedIn = useCookie('admin_logged_in')
const route = useRoute()

const links = [
  { label: 'نظرة عامة', to: '/admin' },
  { label: 'الأفلام', to: '/admin/movies' },
  { label: 'مواعيد العرض', to: '/admin/showtimes' },
  { label: 'الفعاليات', to: '/admin/events' },
  { label: 'الإعدادات', to: '/admin/settings' }
]

const isActive = (path: string) => route.path === path

const logout = async () => {
  await $fetch('/api/admin/logout', { method: 'POST' })
  loggedIn.value = null
  await navigateTo('/admin/login')
}
</script>

<template>
  <aside class="w-full md:min-h-screen md:w-80 md:p-4">
    <div class="panel-soft rounded-[2rem] border border-white/10 bg-black/40 p-4 md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:p-5">
      <div class="flex items-center gap-3 border-b border-white/10 pb-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/10 to-white/5 text-lg font-black text-gold">
          ر
        </div>
        <div>
          <p class="text-xs tracking-[0.22em] text-zinc-500">ADMIN PANEL</p>
          <h2 class="mt-1 text-lg font-black text-amber-50">لوحة التحكم</h2>
        </div>
      </div>

      <div class="mt-5 stat-card">
        <p class="text-xs tracking-[0.22em] text-zinc-500">WORKSPACE</p>
        <p class="mt-2 text-base font-bold text-amber-50">إدارة المحتوى والمواعيد</p>
        <p class="mt-2 text-sm text-zinc-400">نفس الهوية الحديثة مع تركيز أعلى على السرعة والتنظيم داخل الإدارة.</p>
      </div>

      <nav class="mt-5 grid gap-2">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="withAdminPath(link.to)"
          class="rounded-[1.25rem] border px-4 py-3 text-sm font-medium transition-all"
          :class="isActive(link.to) ? 'border-amber-300/35 bg-amber-300/10 text-amber-50' : 'border-white/10 bg-white/5 text-zinc-200 hover:border-white/20 hover:bg-white/10'"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <button class="mt-5 w-full rounded-[1.25rem] border border-red-500/25 bg-red-500/10 px-4 py-3 text-right text-sm font-medium text-red-200 transition hover:bg-red-500/15" @click="logout">
        تسجيل الخروج
      </button>
    </div>
  </aside>
</template>
