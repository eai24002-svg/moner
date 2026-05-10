<script setup lang="ts">
import type { EventItem, Movie, Showtime } from '~/types'

definePageMeta({ layout: 'admin' })

const { adminFetch } = useAdminAccess()

type AdminShowtimeOverview = Showtime & { movie_title: string }
type ListBody<T> = { data: T[] }

const [{ data: movies }, { data: showtimes }, { data: events }] = await Promise.all([
  useAsyncData('admin-overview-movies', () => adminFetch<ListBody<Movie>>('/api/admin/movies')),
  useAsyncData('admin-overview-showtimes', () => adminFetch<ListBody<AdminShowtimeOverview>>('/api/admin/showtimes')),
  useAsyncData('admin-overview-events', () => adminFetch<ListBody<EventItem>>('/api/admin/events'))
])
</script>

<template>
  <section class="space-y-6">
    <div class="section-shell">
      <div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <div class="eyebrow">لوحة تحكم حديثة</div>
          <h1 class="mt-4 text-3xl font-black text-amber-50">نظرة عامة سريعة على حالة الموقع</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            الوصول السريع لأهم الأرقام والإدارات الرئيسية مع نفس الهوية الجديدة، لكن بتركيز وظيفي واضح على المحتوى والمواعيد.
          </p>
        </div>
        <div class="stat-card">
          <p class="text-xs tracking-[0.22em] text-zinc-500">SYSTEM STATUS</p>
          <p class="mt-2 text-lg font-bold text-amber-50">جاهز لإدارة السينما والفعاليات</p>
          <p class="mt-2 text-sm text-zinc-400">يمكنك الانتقال مباشرة إلى الأفلام أو المواعيد أو الإعدادات من الشريط الجانبي.</p>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="panel p-5">
        <p class="text-xs tracking-[0.22em] text-zinc-500">MOVIES</p>
        <p class="mt-3 text-3xl font-black text-amber-50">{{ movies?.data?.length || 0 }}</p>
        <p class="mt-2 text-sm text-zinc-400">إجمالي الأفلام داخل النظام</p>
      </div>
      <div class="panel p-5">
        <p class="text-xs tracking-[0.22em] text-zinc-500">SHOWTIMES</p>
        <p class="mt-3 text-3xl font-black text-amber-50">{{ showtimes?.data?.length || 0 }}</p>
        <p class="mt-2 text-sm text-zinc-400">مواعيد العروض المتاحة حاليًا</p>
      </div>
      <div class="panel p-5">
        <p class="text-xs tracking-[0.22em] text-zinc-500">EVENTS</p>
        <p class="mt-3 text-3xl font-black text-amber-50">{{ events?.data?.length || 0 }}</p>
        <p class="mt-2 text-sm text-zinc-400">الفعاليات والأنشطة المنشورة</p>
      </div>
    </div>
  </section>
</template>
