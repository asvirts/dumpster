<script setup lang="ts">
import { computed } from 'vue';
import { MATERIALS } from '../lib/constants';
import { formatCurrency, formatPhone } from '../lib/geo';
import VerifiedBadge from './VerifiedBadge.vue';

// Shape of OperatorResult (src/lib/search.ts), inlined for TS 7 + Vue (Void #932).
const props = withDefaults(
  defineProps<{
    operator: {
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
    };
    selected?: boolean;
  }>(),
  { selected: false },
);

const op = computed(() => props.operator);
const hasPrice = computed(() => op.value.pricingMin != null && op.value.pricingMax != null);
const materialLabels = computed(() =>
  op.value.materials.map((id) => MATERIALS.find((m) => m.id === id)?.label ?? id).slice(0, 3),
);
const priceLabel = computed(() =>
  hasPrice.value
    ? `${formatCurrency(op.value.pricingMin)}–${formatCurrency(op.value.pricingMax)}`
    : 'Request quote',
);
</script>

<template>
  <article :class="['card p-5', selected && 'outline-2 outline-offset-2 outline-brand-500']">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold text-ink">
          <a :href="`/operator/${op.slug}`" class="text-ink no-underline hover:text-brand-600">
            {{ op.name }}
          </a>
        </h2>
        <p class="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
          {{ [op.hqCity, op.hqState].filter(Boolean).join(', ') || 'Local operator' }}
          <span v-if="op.distanceMiles != null"> · ~{{ op.distanceMiles.toFixed(1) }} mi</span>
        </p>
      </div>
      <div class="text-right">
        <p class="font-mono text-lg font-bold text-brand-600">{{ priceLabel }}</p>
        <p class="font-mono text-[10px] uppercase tracking-widest text-muted">
          {{ hasPrice ? 'Published price' : 'Prices not published' }}
        </p>
      </div>
    </div>

    <div class="mt-3">
      <VerifiedBadge
        :last-verified-at="op.verificationStatus === 'verified' ? op.lastVerifiedAt : null"
        :is-broker="op.isBroker"
        :is-demo="op.isDemo"
      />
    </div>

    <p v-if="op.description" class="mt-3 line-clamp-2 text-sm text-charcoal-600">{{ op.description }}</p>

    <div class="mt-4 flex flex-wrap gap-1.5">
      <span v-for="s in op.sizes" :key="`s${s}`" class="chip bg-charcoal-900 text-brand-400">{{ s }} yd</span>
      <span v-for="m in materialLabels" :key="`m${m}`" class="chip border-2 border-charcoal-200 text-charcoal-600">
        {{ m }}
      </span>
      <span v-if="op.drivewaySuitable" class="chip border-2 border-brand-500 text-brand-700">Driveway-safe</span>
      <span v-if="op.sameDayCapable" class="chip border-2 border-brand-500 text-brand-700">Same-day</span>
    </div>

    <div class="mt-5 flex flex-wrap items-center gap-2 border-t-2 border-charcoal-100 pt-4">
      <a :href="`/operator/${op.slug}#quote`" class="btn-primary">Get a free quote</a>
      <a :href="`/operator/${op.slug}`" class="btn-secondary">View profile</a>
      <a v-if="op.phone" :href="`tel:${op.phone}`" class="btn-ghost font-mono normal-case tracking-normal">
        {{ formatPhone(op.phone) }}
      </a>
      <label
        class="ml-auto flex cursor-pointer items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted"
      >
        <input
          type="checkbox"
          name="compare"
          :value="op.id"
          :data-compare-id="op.id"
          :data-compare-name="op.name"
          class="compare-check h-4 w-4"
        />
        Compare
      </label>
    </div>
  </article>
</template>
