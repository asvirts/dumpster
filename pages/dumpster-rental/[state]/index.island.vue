<script setup lang="ts">
import SearchForm from '../../../src/components/SearchForm.vue';

defineProps<{
  state: { abbr: string; slug: string; name: string };
  cities: { name: string; slug: string; operatorCount: number }[];
  operators: { name: string; slug: string; hq: string | null; price: string | null; cityNames: string[] }[];
}>();
</script>

<template>
  <div class="border-b-2 border-charcoal-900 bg-charcoal-900 py-12 text-white">
    <div class="container-page">
      <nav aria-label="Breadcrumb" class="font-mono text-xs uppercase tracking-widest text-charcoal-400">
        <a href="/" class="text-charcoal-400 no-underline hover:text-brand-400">Home</a>
        <span class="mx-2 text-charcoal-600">/</span>
        <span class="text-brand-400">{{ state.name }}</span>
      </nav>
      <p class="eyebrow mt-6 text-brand-400">{{ state.name }}</p>
      <h1 class="mt-3 font-display text-3xl uppercase leading-tight tracking-tight sm:text-5xl">
        Dumpster rental in <span class="text-brand-500">{{ state.name }}</span>
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-charcoal-200">
        Verified local roll-off operators across {{ state.name }}, with pricing ranges, driveway notes, and
        city-specific permit guidance. Brokers are excluded.
      </p>
      <div class="mt-7 max-w-xl border-2 border-charcoal-600 bg-charcoal-800 p-3">
        <SearchForm :initial-q="state.name" />
      </div>
      <p class="mt-4 font-mono text-xs uppercase tracking-widest text-charcoal-400">
        {{
          operators.length === 0
            ? 'Building the local lineup · request a quote via search'
            : `${operators.length} verified operator${operators.length === 1 ? '' : 's'} · ${
                cities.filter((c) => c.operatorCount > 0).length
              } cit${cities.filter((c) => c.operatorCount > 0).length === 1 ? 'y' : 'ies'}`
        }}
      </p>
    </div>
  </div>

  <div class="container-page space-y-10 py-10">
    <section>
      <p class="eyebrow text-brand-600">By city</p>
      <h2 class="mt-1 font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
        {{ state.name }} dumpster rental by city
      </h2>
      <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="c in cities" :key="c.slug">
          <a
            v-if="c.operatorCount > 0"
            :href="`/dumpster-rental/${state.slug}/${c.slug}`"
            class="card block p-5 text-ink no-underline"
          >
            <span class="text-lg font-bold">{{ c.name }}, {{ state.abbr }}</span>
            <span class="mt-1 block font-mono text-xs uppercase tracking-widest text-brand-600">
              {{ c.operatorCount }} verified operator{{ c.operatorCount === 1 ? '' : 's' }} →
            </span>
          </a>
          <div v-else class="card border-dashed p-5 text-muted">
            <span class="text-lg font-bold">{{ c.name }}, {{ state.abbr }}</span>
            <span class="mt-1 block font-mono text-xs uppercase tracking-widest">Operators coming soon</span>
          </div>
        </li>
      </ul>
    </section>

    <section v-if="operators.length > 0">
      <p class="eyebrow text-brand-600">The lineup</p>
      <h2 class="mt-1 font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
        Dumpster rental companies in {{ state.name }}
      </h2>
      <ul class="mt-6 grid gap-4 sm:grid-cols-2">
        <li v-for="op in operators" :key="op.slug">
          <a :href="`/operator/${op.slug}`" class="card block p-5 text-ink no-underline">
            <span class="text-lg font-bold">{{ op.name }}</span>
            <span v-if="op.hq" class="mt-1 block text-sm text-muted">Based in {{ op.hq }}</span>
            <span class="mt-1 block text-sm text-charcoal-700">Serves {{ op.cityNames.join(', ') }}</span>
            <span v-if="op.price" class="mt-2 block font-mono text-xs uppercase tracking-widest text-brand-600">
              Published range {{ op.price }}
            </span>
          </a>
        </li>
      </ul>
    </section>

    <section class="card p-6">
      <p class="eyebrow text-brand-600">Read next</p>
      <h2 class="mt-1 font-display text-xl uppercase tracking-tight text-ink">Before you rent</h2>
      <ul class="mt-4 space-y-2.5 text-sm font-medium">
        <li><a href="/guides/how-much-do-dumpster-rentals-cost">How much do dumpster rentals cost</a></li>
        <li><a href="/guides/dumpster-size-guide">Dumpster size guide</a></li>
        <li><a href="/guides/dumpster-permits-overview">Permit overview</a></li>
        <li><a href="/guides/what-can-go-in-a-dumpster">What can go in a dumpster</a></li>
      </ul>
    </section>
  </div>
</template>
