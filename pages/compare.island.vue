<script setup lang="ts">
import VerifiedBadge from '../src/components/VerifiedBadge.vue';

defineProps<{
  operators: {
    id: string;
    name: string;
    slug: string;
    lastVerifiedAt: string | null;
    isBroker: boolean;
    isDemo: boolean;
  }[];
  rows: { label: string; values: string[] }[];
}>();
</script>

<template>
  <div class="container-page py-10">
    <p class="eyebrow text-brand-600">Head to head</p>
    <h1 class="mt-2 font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">Compare dumpster operators</h1>
    <p class="mt-2 text-muted">Side-by-side spec sheet for up to 4 operators.</p>

    <div v-if="operators.length < 2" class="card mt-8 p-8 text-center">
      <p class="font-display text-xl uppercase tracking-tight text-ink">Select at least 2 operators</p>
      <p class="mt-2 text-sm text-muted">Use the Compare checkboxes on search results.</p>
      <a href="/search" class="btn-primary mt-5 inline-flex">Back to search</a>
    </div>
    <div v-else class="mt-8 overflow-x-auto border-2 border-charcoal-900 bg-white shadow-[4px_4px_0_0_#121417]">
      <table class="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr class="bg-charcoal-900 text-white">
            <th class="p-3 font-mono text-xs font-semibold uppercase tracking-widest text-charcoal-300">Feature</th>
            <th v-for="op in operators" :key="op.id" class="border-l-2 border-charcoal-700 p-3 align-bottom">
              <a :href="`/operator/${op.slug}`" class="font-bold text-white no-underline hover:text-brand-400">{{
                op.name
              }}</a>
              <div class="mt-2">
                <VerifiedBadge :last-verified-at="op.lastVerifiedAt" :is-broker="op.isBroker" :is-demo="op.isDemo" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(f, i) in rows"
            :key="f.label"
            :class="['border-t-2 border-charcoal-100', i % 2 === 1 && 'bg-charcoal-50']"
          >
            <th class="p-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted">{{ f.label }}</th>
            <td
              v-for="(value, j) in f.values"
              :key="operators[j]?.id ?? j"
              class="border-l-2 border-charcoal-100 p-3 font-mono text-xs font-medium text-charcoal-800"
            >
              {{ value }}
            </td>
          </tr>
          <tr class="border-t-2 border-charcoal-900">
            <th class="p-3"></th>
            <td v-for="op in operators" :key="op.id" class="border-l-2 border-charcoal-100 p-3">
              <a :href="`/operator/${op.slug}#quote`" class="btn-primary">Get a free quote</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
