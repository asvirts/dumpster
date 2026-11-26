<script setup lang="ts">
import { MATERIALS, SIZE_GUIDE } from '../../src/lib/constants';
import { formatCurrency, formatDate, formatPhone } from '../../src/lib/geo';
import VerifiedBadge from '../../src/components/VerifiedBadge.vue';
import QuoteForm from '../../src/components/QuoteForm.vue' with { island: 'load' };
import ClaimListing from '../../src/components/ClaimListing.vue' with { island: 'load' };

const props = defineProps<{
  op: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    phone: string | null;
    hqCity: string | null;
    hqState: string | null;
    pricingMin: number | null;
    pricingMax: number | null;
    pricingNotes: string | null;
    includedTonnage: number | null;
    overageRate: number | null;
    drivewaySuitable: boolean | null;
    drivewayNotes: string | null;
    sameDayCapable: boolean | null;
    verificationStatus: string;
    lastVerifiedAt: string | null;
    insuranceVerified: boolean | null;
    licenseNotes: string | null;
    isBroker: boolean;
    isDemo: boolean;
    updatedAt: string | null;
    claimStatus: string;
  };
  hasPublishedPrice: boolean;
  areaAverage: { cityName: string; state: string; companies: number; avgMin: number; avgMax: number } | null;
  sizes: number[];
  materials: string[];
  cities: string[];
  websiteUrl: string | null;
  defaults: { zip: string; size: string; material: string };
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
  claim: {
    actionUrl: string;
    returnTo: string;
    feedback: { ok: boolean; message?: string; values?: Record<string, string> } | null;
  };
}>();

const op = props.op;
const priceLabel = props.hasPublishedPrice
  ? `${formatCurrency(op.pricingMin)}–${formatCurrency(op.pricingMax)}`
  : 'Request quote for pricing';
const possessive = op.name.endsWith('s') ? `${op.name}'` : `${op.name}'s`;
const materialLabel = (id: string) => MATERIALS.find((m) => m.id === id)?.label ?? id;
const sizeGuide = SIZE_GUIDE as Record<number, string | undefined>;
</script>

<template>
  <div class="border-b-2 border-charcoal-900 bg-charcoal-900 py-10 text-white">
    <div class="container-page">
      <nav aria-label="Breadcrumb" class="font-mono text-xs uppercase tracking-widest text-charcoal-400">
        <a href="/" class="text-charcoal-400 no-underline hover:text-brand-400">Home</a>
        <span class="mx-2 text-charcoal-600">/</span>
        <a href="/search" class="text-charcoal-400 no-underline hover:text-brand-400">Search</a>
        <span class="mx-2 text-charcoal-600">/</span>
        <span class="text-brand-400">{{ op.name }}</span>
      </nav>
      <div class="mt-5 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 class="font-display text-3xl uppercase tracking-tight sm:text-5xl">{{ op.name }}</h1>
          <p class="mt-3 font-mono text-xs uppercase tracking-widest text-charcoal-300">
            {{ [op.hqCity, op.hqState].filter(Boolean).join(', ') || 'United States' }}
          </p>
          <div class="mt-4">
            <VerifiedBadge
              :last-verified-at="op.verificationStatus === 'verified' ? op.lastVerifiedAt : null"
              :is-broker="op.isBroker"
              :is-demo="op.isDemo"
            />
          </div>
          <p v-if="op.updatedAt" class="mt-3 font-mono text-[10px] uppercase tracking-widest text-charcoal-400">
            Data updated {{ formatDate(op.updatedAt) }}
          </p>
        </div>
        <div class="border-2 border-charcoal-600 bg-charcoal-800 p-4 text-right">
          <p class="font-mono text-2xl font-bold text-brand-400">{{ priceLabel }}</p>
          <p class="mt-1 font-mono text-[10px] uppercase tracking-widest text-charcoal-400">
            {{
              hasPublishedPrice
                ? 'Published by this company · confirm all-in quote'
                : 'This company does not publish prices'
            }}
          </p>
          <div v-if="areaAverage" class="mt-3 border-t-2 border-charcoal-700 pt-3">
            <p class="font-mono text-[10px] uppercase tracking-widest text-charcoal-400">
              Area average · {{ areaAverage.cityName }}, {{ areaAverage.state }}
            </p>
            <p class="mt-1 font-mono text-lg font-bold text-charcoal-100">
              {{ formatCurrency(areaAverage.avgMin) }}–{{ formatCurrency(areaAverage.avgMax) }}
            </p>
            <p class="mt-1 max-w-[16rem] text-xs text-charcoal-400 sm:ml-auto">
              Average of {{ areaAverage.companies }} other local companies' published prices. Not
              {{ possessive }} price.
            </p>
          </div>
        </div>
      </div>
      <div class="mt-7 flex flex-wrap gap-3">
        <a v-if="op.phone" :href="`tel:${op.phone}`" class="btn-primary">Call {{ formatPhone(op.phone) }}</a>
        <a v-if="websiteUrl" :href="websiteUrl" class="btn-outline-light" rel="noopener noreferrer" target="_blank">
          Website
        </a>
        <a href="#quote" class="btn-outline-light">Get a free quote</a>
      </div>
    </div>
  </div>

  <div class="container-page grid gap-10 py-10 pb-24 lg:grid-cols-[1fr_360px] sm:pb-10">
    <div class="space-y-10">
      <section v-if="op.description">
        <p class="eyebrow text-brand-600">About</p>
        <h2 class="mt-1 font-display text-2xl uppercase tracking-tight text-ink">Meet the operator</h2>
        <p class="mt-3 leading-relaxed text-charcoal-700">{{ op.description }}</p>
      </section>

      <section>
        <p class="eyebrow text-brand-600">Fleet</p>
        <h2 class="mt-1 font-display text-2xl uppercase tracking-tight text-ink">Sizes offered</h2>
        <ul class="mt-5 grid gap-4 sm:grid-cols-2">
          <li v-for="s in sizes" :key="s" class="card flex items-start gap-4 p-4">
            <p class="font-display text-4xl text-brand-500">
              {{ s }}<span class="font-mono text-sm font-semibold uppercase text-muted">yd</span>
            </p>
            <p class="pt-1 text-sm text-charcoal-600">{{ sizeGuide[s] ?? 'Roll-off dumpster' }}</p>
          </li>
        </ul>
      </section>

      <section>
        <p class="eyebrow text-brand-600">Accepted loads</p>
        <h2 class="mt-1 font-display text-2xl uppercase tracking-tight text-ink">Materials accepted</h2>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li
            v-for="id in materials"
            :key="id"
            class="chip border-2 border-charcoal-900 bg-white px-3 py-1.5 text-charcoal-800"
          >
            {{ materialLabel(id) }}
          </li>
        </ul>
      </section>

      <section>
        <p class="eyebrow text-brand-600">Spec sheet</p>
        <h2 class="mt-1 font-display text-2xl uppercase tracking-tight text-ink">Pricing &amp; placement</h2>
        <dl
          class="mt-5 divide-y-2 divide-charcoal-100 border-2 border-charcoal-900 bg-white shadow-[4px_4px_0_0_#121417]"
        >
          <div class="grid gap-1 p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt class="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Pricing notes</dt>
            <dd class="text-sm text-charcoal-800">
              {{ op.pricingNotes || 'Contact operator for an all-in quote including delivery and dump fees.' }}
            </dd>
          </div>
          <div class="grid gap-1 p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt class="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Included tonnage</dt>
            <dd class="font-mono text-sm font-semibold text-ink">
              {{ op.includedTonnage != null ? `~${op.includedTonnage} tons` : '—' }}
            </dd>
          </div>
          <div class="grid gap-1 p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt class="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Overage rate</dt>
            <dd class="font-mono text-sm font-semibold text-ink">
              {{ op.overageRate != null ? `~${formatCurrency(op.overageRate)}/ton` : '—' }}
            </dd>
          </div>
          <div class="grid gap-1 p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt class="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Driveway suitable</dt>
            <dd class="text-sm text-charcoal-800">
              <span class="font-mono font-semibold text-ink">{{ op.drivewaySuitable ? 'Yes' : 'Limited / ask' }}</span>
              <span v-if="op.drivewayNotes" class="mt-1 block text-muted">{{ op.drivewayNotes }}</span>
            </dd>
          </div>
          <div class="grid gap-1 p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt class="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Same-day capable</dt>
            <dd class="font-mono text-sm font-semibold text-ink">
              {{ op.sameDayCapable ? 'Yes (when available)' : 'Not listed' }}
            </dd>
          </div>
          <div class="grid gap-1 p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt class="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Verification</dt>
            <dd class="text-sm text-charcoal-800">
              <span class="font-mono font-semibold uppercase text-ink">{{ op.verificationStatus }}</span>
              <span v-if="op.lastVerifiedAt" class="text-muted"> · Last verified {{ formatDate(op.lastVerifiedAt) }}</span>
              <span v-if="op.insuranceVerified" class="text-muted"> · Insurance signals reviewed</span>
              <span v-if="op.licenseNotes" class="mt-1 block text-muted">License notes: {{ op.licenseNotes }}</span>
            </dd>
          </div>
          <div v-if="op.updatedAt" class="grid gap-1 p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt class="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Last updated</dt>
            <dd class="font-mono text-sm font-semibold text-ink">{{ formatDate(op.updatedAt) }}</dd>
          </div>
        </dl>
      </section>

      <section v-if="cities.length > 0">
        <p class="eyebrow text-brand-600">Coverage</p>
        <h2 class="mt-1 font-display text-2xl uppercase tracking-tight text-ink">Service areas</h2>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li v-for="c in cities" :key="c" class="chip bg-charcoal-100 px-3 py-1.5 text-charcoal-700">{{ c }}</li>
        </ul>
      </section>
    </div>

    <aside id="quote" class="space-y-6">
      <QuoteForm
        mode="direct"
        :operator-id="op.id"
        :operator-name="op.name"
        :default-zip="defaults.zip"
        :default-size="defaults.size"
        :default-material="defaults.material"
        v-bind="quote"
      />
      <ClaimListing
        :operator-id="op.id"
        :operator-name="op.name"
        :claim-status="op.claimStatus"
        v-bind="claim"
      />
      <div class="card p-5">
        <div class="hazard-bar -mx-5 -mt-5 mb-4 w-[calc(100%+2.5rem)]" aria-hidden="true"></div>
        <p class="font-mono text-xs font-bold uppercase tracking-widest text-ink">Tips before you book</p>
        <ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-charcoal-700 marker:text-brand-500">
          <li>Confirm all-in price (delivery, rental days, tonnage, overage).</li>
          <li>Ask about permit responsibility for street placement.</li>
          <li>Share driveway width and surface type for residential drops.</li>
        </ul>
        <p class="mt-4 font-mono text-xs uppercase tracking-widest">
          <a href="/guides/dumpster-size-guide">Size guide</a>
          ·
          <a href="/guides/dumpster-permits-overview">Permits</a>
        </p>
      </div>
    </aside>
  </div>

  <div class="fixed inset-x-0 bottom-0 z-30 border-t-2 border-charcoal-900 bg-charcoal-900 p-3 sm:hidden">
    <div class="flex gap-2">
      <a v-if="op.phone" :href="`tel:${op.phone}`" class="btn-secondary flex-1 bg-white text-center text-xs">Call</a>
      <a href="#quote" class="btn-primary flex-1 text-center text-xs">Get a free quote</a>
    </div>
  </div>
</template>
