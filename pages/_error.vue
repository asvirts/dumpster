<script setup lang="ts">
// Unexpected loader/render failures and HTTPExceptions. Production shows a generic message.
// Inline type, not ErrorPageProps from @void/vue: imported prop types break under TS 7 (Void #932).
defineProps<{ error: { status: number; message: string } }>();
</script>

<template>
  <div class="container-page py-24 text-center">
    <p class="font-display text-7xl text-brand-500 sm:text-8xl">{{ error.status }}</p>
    <div class="hazard-bar mx-auto mt-6 max-w-xs" aria-hidden="true"></div>
    <h1 class="mt-6 font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">Something went wrong</h1>
    <p class="mt-3 text-muted">{{ error.message }}</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="/" class="btn-primary">Go home</a>
      <a href="/search" class="btn-secondary">Search operators</a>
    </div>
  </div>
</template>
