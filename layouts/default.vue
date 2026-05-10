<template>
  <div class="relative min-h-screen overflow-hidden bg-noir">
    <div class="pointer-events-none fixed inset-0 -z-20 bg-aurora opacity-80" />
    <div class="pointer-events-none fixed inset-0 -z-20 bg-mesh opacity-70" />
    <div class="pointer-events-none fixed right-[-18rem] top-[-8rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-3xl" />
    <div class="pointer-events-none fixed bottom-[-10rem] left-[-16rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-burgundy/20 blur-3xl" />
    <AppHeader />
    <main class="container-premium relative py-6 sm:py-8 lg:py-10">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
