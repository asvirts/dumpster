<script setup lang="ts">
defineProps<{ guides: { id: string; title: string; description: string; category: string }[] }>();
</script>

<template>
  <div class="border-b-2 border-charcoal-900 bg-charcoal-900 py-12 text-white">
    <div class="container-page">
      <p class="eyebrow text-brand-400">Field manuals</p>
      <h1 class="mt-2 font-display text-3xl uppercase tracking-tight sm:text-5xl">Dumpster rental guides</h1>
      <p class="mt-4 max-w-2xl text-lg text-charcoal-200">
        Practical education to avoid overages, permit surprises, and wrong-size containers.
      </p>
    </div>
  </div>
  <div class="container-page py-12">
    <ul class="grid gap-5 sm:grid-cols-2">
      <li v-for="g in guides" :key="g.id">
        <a :href="`/guides/${g.id}`" class="card block p-6 text-ink no-underline">
          <p class="eyebrow text-muted">{{ g.category }}</p>
          <h2 class="mt-2 text-lg font-bold">{{ g.title }}</h2>
          <p class="mt-2 text-sm text-muted">{{ g.description }}</p>
          <p class="mt-4 font-mono text-xs font-semibold uppercase tracking-widest text-brand-600">
            Read the guide →
          </p>
        </a>
      </li>
    </ul>
  </div>
</template>
