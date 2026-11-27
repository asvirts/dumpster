<script setup lang="ts">
import OperatorCard from '../../../src/components/OperatorCard.vue';
import SearchForm from '../../../src/components/SearchForm.vue';
import MapView from '../../../src/components/MapView.vue' with { island: 'visible' };
import QuoteForm from '../../../src/components/QuoteForm.vue' with { island: 'load' };

defineProps<{
  city: {
    id: string;
    name: string;
    state: string;
    stateName: string;
    slug: string;
    stateSlug: string;
    lat: number;
    lng: number;
    typicalPricingNotes: string | null;
    localPermitSummary: string | null;
    specialRules: string | null;
  };
  operators: {
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
  nearby: { name: string; state: string; slug: string; stateSlug: string; miles: number }[];
  markers: { id: string; name: string; slug: string; lat: number; lng: number }[];
  faqs: { question: string; answer: string }[];
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
  <div class="border-b-2 border-charcoal-900 bg-charcoal-900 py-12 text-white">
    <div class="container-page">
      <nav aria-label="Breadcrumb" class="font-mono text-xs uppercase tracking-widest text-charcoal-400">
        <a href="/" class="text-charcoal-400 no-underline hover:text-brand-400">Home</a>
        <span class="mx-2 text-charcoal-600">/</span>
        <a :href="`/dumpster-rental/${city.stateSlug}`" class="text-charcoal-400 no-underline hover:text-brand-400">{{
          city.stateName
        }}</a>
        <span class="mx-2 text-charcoal-600">/</span>
        <span class="text-brand-400">{{ city.name }}</span>
      </nav>
      <p class="eyebrow mt-6 text-brand-400">{{ city.name }}, {{ city.state }}</p>
      <h1 class="mt-3 font-display text-3xl uppercase leading-tight tracking-tight sm:text-5xl">
        Dumpster rental in <span class="text-brand-500">{{ city.name }}</span>
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-charcoal-200">
        Verified local operators with transparent pricing ranges, driveway notes, and city-specific permit
        guidance.
      </p>
      <div class="mt-7 max-w-xl border-2 border-charcoal-600 bg-charcoal-800 p-3">
        <SearchForm :initial-q="`${city.name}, ${city.state}`" />
      </div>
      <p class="mt-4">
        <a href="#quote" class="btn-primary">Get free quotes in {{ city.name }}</a>
      </p>
      <p class="mt-4 font-mono text-xs uppercase tracking-widest text-charcoal-400">
        {{
          operators.length === 0
            ? 'Building the local lineup · request a quote via search or guides'
            : `${operators.length} verified operator${operators.length === 1 ? '' : 's'} listed · brokers excluded`
        }}
      </p>
    </div>
  </div>

  <div class="container-page grid gap-10 py-10 lg:grid-cols-[1fr_340px]">
    <div class="space-y-10">
      <section class="grid gap-5 sm:grid-cols-2">
        <div class="card p-6">
          <p class="eyebrow text-brand-600">Spec 01</p>
          <h2 class="mt-2 font-display text-xl uppercase tracking-tight text-ink">Local pricing snapshot</h2>
          <p class="mt-3 text-sm leading-relaxed text-charcoal-700">
            {{
              city.typicalPricingNotes ||
              'Pricing varies by size, weight, and dump fees. Compare ranges on operator profiles and always confirm an all-in quote.'
            }}
          </p>
        </div>
        <div class="card p-6">
          <p class="eyebrow text-brand-600">Spec 02</p>
          <h2 class="mt-2 font-display text-xl uppercase tracking-tight text-ink">Permit notes</h2>
          <p class="mt-3 text-sm leading-relaxed text-charcoal-700">
            {{
              city.localPermitSummary ||
              'Street placement often requires a municipal right-of-way permit. Private driveway placement is usually simpler — confirm with your city and the operator.'
            }}
          </p>
        </div>
      </section>

      <section v-if="city.specialRules" class="border-2 border-charcoal-900 bg-hazard shadow-[4px_4px_0_0_#121417]">
        <div class="hazard-bar" aria-hidden="true"></div>
        <div class="p-6">
          <h2 class="font-display text-xl uppercase tracking-tight text-charcoal-900">Local tips</h2>
          <p class="mt-2 text-sm font-medium leading-relaxed text-charcoal-900">{{ city.specialRules }}</p>
        </div>
      </section>

      <section id="quote">
        <QuoteForm mode="match" :source-city-id="city.id" :default-zip="`${city.name}, ${city.state}`" v-bind="quote" />
      </section>

      <section>
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="eyebrow text-brand-600">The lineup</p>
            <h2 class="mt-1 font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
              Top operators in {{ city.name }}
            </h2>
          </div>
          <a
            :href="`/search?q=${encodeURIComponent(`${city.name}, ${city.state}`)}`"
            class="font-mono text-xs font-semibold uppercase tracking-widest"
          >
            Full search with filters →
          </a>
        </div>
        <div class="mt-6 space-y-4">
          <div v-if="operators.length === 0" class="card border-2 border-dashed border-charcoal-300 p-8 text-center">
            <p class="font-display text-xl uppercase tracking-tight text-ink">Operators coming soon in {{ city.name }}</p>
            <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              We’re verifying local haulers for this metro. Meanwhile, use the guides for sizes, permits, and cost
              factors — or search nearby cities.
            </p>
            <div class="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/guides/dumpster-size-guide" class="btn-secondary text-sm">Size guide</a>
              <a href="/guides/how-much-do-dumpster-rentals-cost" class="btn-secondary text-sm">Cost guide</a>
              <a href="/search" class="btn-primary text-sm">Search operators</a>
            </div>
          </div>
          <OperatorCard v-for="op in operators" v-else :key="op.id" :operator="op" />
        </div>
      </section>

      <section class="card p-6">
        <p class="eyebrow text-brand-600">FAQ</p>
        <h2 class="mt-1 font-display text-xl uppercase tracking-tight text-ink">{{ city.name }} dumpster rental FAQ</h2>
        <dl class="mt-5 space-y-5">
          <div v-for="f in faqs" :key="f.question">
            <dt class="font-semibold text-ink">{{ f.question }}</dt>
            <dd class="mt-1.5 text-sm leading-relaxed text-charcoal-700">{{ f.answer }}</dd>
          </div>
        </dl>
      </section>

      <section class="card p-6">
        <p class="eyebrow text-brand-600">Nearby</p>
        <h2 class="mt-1 font-display text-xl uppercase tracking-tight text-ink">Dumpster rental near {{ city.name }}</h2>
        <ul v-if="nearby.length > 0" class="mt-4 grid gap-2.5 text-sm font-medium sm:grid-cols-2">
          <li v-for="n in nearby" :key="`${n.stateSlug}/${n.slug}`">
            <a :href="`/dumpster-rental/${n.stateSlug}/${n.slug}`">{{ n.name }}, {{ n.state }}</a>
            <span class="font-mono text-xs text-muted"> · {{ n.miles }} mi</span>
          </li>
        </ul>
        <p class="mt-4 text-sm font-medium">
          <a :href="`/dumpster-rental/${city.stateSlug}`">All {{ city.stateName }} dumpster rental cities →</a>
        </p>
      </section>

      <section class="card p-6">
        <p class="eyebrow text-brand-600">Read next</p>
        <h2 class="mt-1 font-display text-xl uppercase tracking-tight text-ink">Related guides</h2>
        <ul class="mt-4 space-y-2.5 text-sm font-medium">
          <li><a href="/guides/dumpster-size-guide">Dumpster size guide</a></li>
          <li><a href="/guides/how-much-do-dumpster-rentals-cost">How much do dumpster rentals cost</a></li>
          <li><a href="/guides/what-can-go-in-a-dumpster">What can go in a dumpster</a></li>
          <li><a href="/guides/dumpster-permits-overview">Permit overview</a></li>
          <li><a href="/guides/dumpster-rental-cost-factors">Cost factors</a></li>
        </ul>
      </section>
    </div>

    <aside class="space-y-4">
      <MapView :markers="markers" :center-lat="city.lat" :center-lng="city.lng" :zoom="10" height-class="h-80" />
      <div class="card p-4 text-sm text-muted">
        Map pins use operator HQ coordinates for illustration. Confirm delivery service area with the operator.
      </div>
    </aside>
  </div>
</template>
