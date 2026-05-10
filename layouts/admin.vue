<template>
  <div class="relative min-h-screen overflow-hidden bg-noir text-ivory md:flex">
    <div class="pointer-events-none fixed inset-0 -z-20 bg-aurora opacity-70" />
    <div class="pointer-events-none fixed inset-0 -z-20 bg-mesh opacity-50" />
    <div class="pointer-events-none fixed right-[-14rem] top-[-6rem] -z-10 h-[24rem] w-[24rem] rounded-full bg-gold/10 blur-3xl" />
    <div class="pointer-events-none fixed bottom-[-8rem] left-[-10rem] -z-10 h-[20rem] w-[20rem] rounded-full bg-burgundy/20 blur-3xl" />
    <AdminSidebar />
    <main class="flex-1 p-4 md:p-6 lg:p-8">
      <slot />
    </main>
  </div>
</template>
