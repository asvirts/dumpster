<script lang="ts">
export const layout = '!portal';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { Link, useShared } from '@void/vue';
import { DUMPSTER_SIZES, MATERIALS } from '../../src/lib/constants';

defineProps<{
  operator: {
    name: string;
    isPublished: boolean;
    phone: string | null;
    email: string | null;
    website: string | null;
    description: string | null;
    hqCity: string | null;
    hqState: string | null;
    pricingMin: number | null;
    pricingMax: number | null;
    pricingNotes: string | null;
    includedTonnage: number | null;
    overageRate: number | null;
    drivewayNotes: string | null;
    drivewaySuitable: boolean;
    sameDayCapable: boolean;
  } | null;
  cities: { id: string; name: string; state: string }[];
  sizes: number[];
  materials: string[];
  cityIds: string[];
}>();

const shared = useShared();
const saved = computed(() => shared?.feedback?.form === 'listing' && shared.feedback.ok);
</script>

<template>
  <p v-if="!operator" class="card p-6 text-sm text-muted">
    Claim and get approval for a listing before editing.
    <Link href="/portal">Back to overview</Link>
  </p>
  <template v-else>
    <p class="mb-4 text-sm text-muted">
      Update public profile details. Publishing and verification stay under admin control{{ operator.isPublished ? ' (currently published)' : ' (not published yet)' }}.
    </p>
    <p v-if="saved" class="mb-4 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
      Listing saved.
    </p>
    <form method="POST" action="?save" class="space-y-6">
      <div class="card grid gap-4 p-6 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="label" for="name">Company name *</label>
          <input class="input" id="name" name="name" required :value="operator.name" />
        </div>
        <div>
          <label class="label" for="phone">Phone</label>
          <input class="input" id="phone" name="phone" :value="operator.phone ?? ''" />
        </div>
        <div>
          <label class="label" for="email">Public email</label>
          <input class="input" id="email" name="email" type="email" :value="operator.email ?? ''" />
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="website">Website</label>
          <input class="input" id="website" name="website" :value="operator.website ?? ''" />
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="description">Description</label>
          <textarea class="input min-h-[100px]" id="description" name="description" :value="operator.description ?? ''"></textarea>
        </div>
        <div>
          <label class="label" for="hqCity">HQ city</label>
          <input class="input" id="hqCity" name="hqCity" :value="operator.hqCity ?? ''" />
        </div>
        <div>
          <label class="label" for="hqState">HQ state</label>
          <input class="input" id="hqState" name="hqState" maxlength="2" :value="operator.hqState ?? ''" />
        </div>
        <div>
          <label class="label" for="pricingMin">Pricing min</label>
          <input class="input" id="pricingMin" name="pricingMin" type="number" step="1" :value="operator.pricingMin ?? ''" />
        </div>
        <div>
          <label class="label" for="pricingMax">Pricing max</label>
          <input class="input" id="pricingMax" name="pricingMax" type="number" step="1" :value="operator.pricingMax ?? ''" />
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="pricingNotes">Pricing notes</label>
          <textarea class="input" id="pricingNotes" name="pricingNotes" rows="2" :value="operator.pricingNotes ?? ''"></textarea>
        </div>
        <div>
          <label class="label" for="includedTonnage">Included tonnage</label>
          <input
            class="input"
            id="includedTonnage"
            name="includedTonnage"
            type="number"
            step="0.1"
            :value="operator.includedTonnage ?? ''"
          />
        </div>
        <div>
          <label class="label" for="overageRate">Overage rate</label>
          <input class="input" id="overageRate" name="overageRate" type="number" step="1" :value="operator.overageRate ?? ''" />
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="drivewayNotes">Driveway notes</label>
          <input class="input" id="drivewayNotes" name="drivewayNotes" :value="operator.drivewayNotes ?? ''" />
        </div>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" name="drivewaySuitable" :checked="operator.drivewaySuitable" />
          Driveway suitable
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" name="sameDayCapable" :checked="operator.sameDayCapable" />
          Same-day capable
        </label>
      </div>

      <div class="card p-6">
        <p class="label mb-2">Sizes</p>
        <div class="flex flex-wrap gap-3">
          <label v-for="s in DUMPSTER_SIZES" :key="s" class="flex items-center gap-2 text-sm">
            <input type="checkbox" name="sizes" :value="s" :checked="sizes.includes(s)" />
            {{ s }} yd
          </label>
        </div>
      </div>

      <div class="card p-6">
        <p class="label mb-2">Materials</p>
        <div class="flex flex-wrap gap-3">
          <label v-for="m in MATERIALS" :key="m.id" class="flex items-center gap-2 text-sm">
            <input type="checkbox" name="materials" :value="m.id" :checked="materials.includes(m.id)" />
            {{ m.label }}
          </label>
        </div>
      </div>

      <div class="card p-6">
        <p class="label mb-2">Service cities</p>
        <div class="max-h-64 space-y-1 overflow-y-auto text-sm">
          <label v-for="ct in cities" :key="ct.id" class="flex items-center gap-2">
            <input type="checkbox" name="cityIds" :value="ct.id" :checked="cityIds.includes(ct.id)" />
            {{ ct.name }}, {{ ct.state }}
          </label>
        </div>
      </div>

      <button type="submit" class="btn-primary">Save listing</button>
    </form>
  </template>
</template>
