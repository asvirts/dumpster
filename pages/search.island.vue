<script setup lang="ts">
import OperatorCard from '../src/components/OperatorCard.vue';
import SearchForm from '../src/components/SearchForm.vue';
import FilterBar from '../src/components/FilterBar.vue' with { island: 'load' };
import MapView from '../src/components/MapView.vue' with { island: 'visible' };
import QuoteForm from '../src/components/QuoteForm.vue' with { island: 'load' };

// Compare bar behaviour is a small delegated script added in search.server.ts head().
defineProps<{
  q: string;
  filters: {
    q: string;
    size: string;
    material: string;
    driveway: string;
    sameDay: string;
    verified: string;
    brokers: string;
    sort: string;
  };
  city: { id: string; name: string; state: string; slug: string; stateSlug: string; lat: number; lng: number } | null;
  results: {
    id: string;
    name: string;
    slug: string;
    phone: string | null;
    description: string | null;
    hqCity: string | null;
    hqState: string | null;
    pricingMin: number | null;
    pricingMax: number | null;
    drivewaySuitable: boolean | null;
    sameDayCapable: boolean | null;
    isBroker: boolean;
    verificationStatus: string;
    lastVerifiedAt: string | null;
    isDemo: boolean;
    sizes: number[];
    materials: string[];
    distanceMiles?: number;
  }[];
  markers: { id: string; name: string; slug: string; lat: number; lng: number }[];
  heading: string;
  defaultZip: string;
  quote: {
    actionUrl: string;
    sourcePath: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent: string;
    utmTerm: string;
    referrer: string;
    turnstileKey: string;
    feedback: { ok: boolean; message?: string; fieldErrors?: Record<string, string>; values?: Record<string, string> } | null;
  };
}>();
</script>

<template>
  <div class="border-b-2 border-charcoal-900 bg-charcoal-900 py-10 text-white">
    <div class="container-page">
      <p class="eyebrow text-brand-400">Operator search</p>
      <h1 class="mt-2 font-display text-3xl uppercase tracking-tight sm:text-4xl">{{ heading }}</h1>
      <p class="mt-3 font-mono text-xs uppercase tracking-widest text-charcoal-300">
        <span class="font-bold text-brand-400">{{ results.length }}</span> operator{{ results.length === 1 ? '' : 's' }}
        found
        <template v-if="city">
          ·
          <a
            :href="`/dumpster-rental/${city.stateSlug}/${city.slug}`"
            class="font-semibold text-brand-400 underline decoration-2 underline-offset-4 hover:text-brand-300"
          >
            City guide for {{ city.name }}
          </a>
        </template>
      </p>
      <div class="mt-6 max-w-2xl border-2 border-charcoal-600 bg-charcoal-800 p-3">
        <SearchForm :initial-q="filters.q" />
      </div>
    </div>
  </div>

  <div class="container-page py-8">
    <div class="grid gap-8 lg:grid-cols-[240px_1fr_minmax(280px,360px)]">
      <aside>
        <FilterBar v-bind="filters" />
      </aside>

      <div class="space-y-4">
        <QuoteForm
          mode="match"
          :source-city-id="city?.id"
          :default-zip="defaultZip"
          :default-size="filters.size"
          :default-material="filters.material"
          v-bind="quote"
        />
        <div v-if="results.length === 0" class="card p-8 text-center">
          <p class="font-display text-xl uppercase tracking-tight text-ink">No operators match</p>
          <p class="mt-2 text-sm text-muted">
            Try a priority city like Houston, TX or clear filters. Brokers are hidden by default.
          </p>
        </div>
        <OperatorCard v-for="op in results" v-else :key="op.id" :operator="op" />

        <div
          id="compare-bar"
          class="fixed inset-x-0 bottom-0 z-30 hidden border-t-4 border-brand-500 bg-charcoal-900 p-4 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
        >
          <div class="container-page flex flex-wrap items-center justify-between gap-3">
            <p class="font-mono text-xs font-semibold uppercase tracking-widest">
              <span id="compare-count" class="text-brand-400">0</span> selected for comparison (max 4)
            </p>
            <a id="compare-link" href="/compare" class="btn-primary pointer-events-none opacity-50">Compare</a>
          </div>
        </div>
      </div>

      <div class="hidden lg:block">
        <div class="sticky top-20">
          <MapView :markers="markers" :center-lat="city?.lat" :center-lng="city?.lng" :zoom="city ? 10 : 4" />
        </div>
      </div>
    </div>

    <div class="mt-8 lg:hidden">
      <MapView :markers="markers" :center-lat="city?.lat" :center-lng="city?.lng" :zoom="city ? 10 : 4" />
    </div>
  </div>
</template>
