<script setup lang="ts">
import type { Settings } from '~/types'

definePageMeta({ layout: 'admin' })

const { adminFetch } = useAdminAccess()

const { data, refresh } = await useAsyncData('admin-settings', () => adminFetch<{ data: Settings | null }>('/api/admin/settings'))

const form = reactive({
  phone_number: '',
  whatsapp_number: '',
  hero_badge: 'ROWAIDA ART EXPERIENCE',
  hero_title_line_1: 'مساحة فنية راقية',
  hero_title_line_2: 'تجمع السينما والفعاليات',
  hero_title_line_3: 'بطابع مختلف تمامًا',
  hero_description: 'رويدة آرت ليست مجرد موقع عروض، بل واجهة أنيقة لتجربة متكاملة تضم أفلامًا مختارة، ورشًا إبداعية، وفعاليات بهوية بصرية هادئة وفاخرة.'
})

const message = ref('')
const errorMessage = ref('')

watchEffect(() => {
  if (data.value?.data) {
    form.phone_number = data.value.data.phone_number
    form.whatsapp_number = data.value.data.whatsapp_number
    form.hero_badge = data.value.data.hero_badge
    form.hero_title_line_1 = data.value.data.hero_title_line_1
    form.hero_title_line_2 = data.value.data.hero_title_line_2
    form.hero_title_line_3 = data.value.data.hero_title_line_3
    form.hero_description = data.value.data.hero_description
  }
})

const saving = ref(false)
const save = async () => {
  saving.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    await adminFetch('/api/admin/settings', { method: 'PUT', body: form })
    await refresh()
    await refreshNuxtData('home-settings')
    message.value = 'تم حفظ الإعدادات بنجاح.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'تعذر حفظ الإعدادات.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="space-y-6">
    <div class="section-shell">
      <div class="eyebrow">SETTINGS</div>
      <h1 class="mt-4 text-3xl font-black text-amber-50">إعدادات التواصل والواجهة الرئيسية</h1>
      <p class="mt-3 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">حدّث أرقام التواصل ونصوص الواجهة الرئيسية من مساحة أنظف وأكثر وضوحًا.</p>
    </div>
    <form class="panel max-w-3xl space-y-4 p-4" @submit.prevent="save">
      <div class="grid gap-3 md:grid-cols-2">
        <input v-model="form.phone_number" class="admin-input" placeholder="رقم الهاتف">
        <input v-model="form.whatsapp_number" class="admin-input" placeholder="رقم واتساب">
      </div>

      <div class="grid gap-3">
        <input v-model="form.hero_badge" class="admin-input" placeholder="النص الصغير أعلى العنوان">
        <input v-model="form.hero_title_line_1" class="admin-input" placeholder="السطر الأول من العنوان">
        <input v-model="form.hero_title_line_2" class="admin-input" placeholder="السطر الثاني من العنوان">
        <input v-model="form.hero_title_line_3" class="admin-input" placeholder="السطر الثالث من العنوان">
        <textarea
          v-model="form.hero_description"
          class="admin-input min-h-32"
          placeholder="وصف الواجهة الرئيسية"
        />
      </div>

      <button :disabled="saving" class="btn-primary px-4 py-2 text-sm">
        {{ saving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
      </button>
      <p v-if="message" class="text-sm text-emerald-300">{{ message }}</p>
      <p v-if="errorMessage" class="text-sm text-red-300">{{ errorMessage }}</p>
    </form>
  </section>
</template>
