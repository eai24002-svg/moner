<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  badge?: string
}>()
</script>

<template>
  <div class="mb-7 space-y-3">
    <div v-if="badge" class="eyebrow">{{ badge }}</div>
    <h2 class="text-3xl font-black leading-tight text-amber-50 sm:text-4xl">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
      {{ subtitle }}
    </p>
    <div class="h-px w-full bg-gradient-to-l from-transparent via-white/10 to-transparent" />
  </div>
</template>
