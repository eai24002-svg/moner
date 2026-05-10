<script setup lang="ts">
const route = useRoute()
const loggedIn = useCookie('admin_logged_in')

const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const redirectPath = computed(() =>
  typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin')
    ? route.query.redirect
    : '/admin'
)

const login = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: {
        password: password.value
      }
    })

    // Keep client-side auth state in sync immediately after login.
    loggedIn.value = '1'
    await navigateTo(redirectPath.value, { replace: true })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'تعذر تسجيل الدخول'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="flex min-h-[calc(100vh-10rem)] items-center justify-center">
    <div class="panel w-full max-w-md p-6 sm:p-7">
      <div class="eyebrow">ADMIN ACCESS</div>
      <h1 class="mt-3 text-3xl font-black text-amber-50">دخول لوحة التحكم</h1>
      <p class="mt-3 text-sm leading-7 text-zinc-400">
        أدخل كلمة المرور للوصول إلى لوحة التحكم.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="login">
        <input
          v-model="password"
          type="password"
          class="input-premium"
          placeholder="كلمة المرور"
        >
        <button :disabled="loading" class="btn-primary w-full">
          {{ loading ? 'جاري الدخول...' : 'دخول' }}
        </button>
        <p v-if="errorMessage" class="text-sm text-red-300">{{ errorMessage }}</p>
      </form>
    </div>
  </section>
</template>
