<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../../src/components/admin/AdminShell.vue';
import OperatorForm from '../../../src/components/admin/OperatorForm.vue';

defineProps<{
  adminEmail?: string | null;
  id: string;
  saved: boolean;
  status: {
    verificationStatus: string;
    lastVerified: string | null;
    verifiedBy: string | null;
    isPublished: boolean;
    isDemo: boolean;
    slug: string;
  };
  operator: {
    name: string;
    slug: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    description: string | null;
    hqCity: string | null;
    hqState: string | null;
    hqLat: number | null;
    hqLng: number | null;
    pricingMin: number | null;
    pricingMax: number | null;
    pricingNotes: string | null;
    includedTonnage: number | null;
    overageRate: number | null;
    qualityScore: number | null;
    verificationStatus: string;
    verificationNotes: string | null;
    drivewayNotes: string | null;
    licenseNotes: string | null;
    drivewaySuitable: boolean;
    sameDayCapable: boolean;
    isBroker: boolean;
    insuranceVerified: boolean;
    isPublished: boolean;
  };
  sizes: number[];
  materials: string[];
  cityIds: string[];
  cities: { id: string; name: string; state: string }[];
}>();

function confirmDelete(e: Event) {
  if (!confirm('Delete this operator permanently?')) e.preventDefault();
}
</script>

<template>
  <AdminShell :title="`Edit: ${operator.name}`" :admin-email="adminEmail">
    <p v-if="saved" class="mb-4 rounded-lg bg-brand-50 px-4 py-2 text-sm text-brand-900" role="status">Saved.</p>

    <div class="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-white p-4">
      <div class="flex-1 text-sm text-muted">
        Status: <strong class="text-ink">{{ status.verificationStatus }}</strong>
        <template v-if="status.lastVerified"> · Verified {{ status.lastVerified }} by {{ status.verifiedBy }}</template>
        {{ status.isPublished ? ' · Published' : ' · Not published' }}
        <template v-if="status.isDemo"> · Demo seed data</template>
      </div>
      <form v-if="status.verificationStatus !== 'verified'" method="POST" class="flex flex-wrap items-center gap-2">
        <input type="hidden" name="intent" value="verify" />
        <input class="input w-48" name="quickNotes" placeholder="Verification notes" />
        <button type="submit" class="btn-primary">Mark verified</button>
      </form>
      <form v-if="status.verificationStatus !== 'rejected'" method="POST">
        <input type="hidden" name="intent" value="reject" />
        <button type="submit" class="btn-secondary text-red-700">Reject</button>
      </form>
      <a v-if="status.isPublished" :href="`/operator/${status.slug}`" class="btn-ghost text-sm" target="_blank">
        View public →
      </a>
    </div>

    <OperatorForm
      :operator="operator"
      :sizes="sizes"
      :materials="materials"
      :city-ids="cityIds"
      :cities="cities"
      :action="`/admin/operators/${id}`"
    />

    <form method="POST" class="mt-10 border-t border-border pt-6" @submit="confirmDelete">
      <input type="hidden" name="intent" value="delete" />
      <button type="submit" class="text-sm font-medium text-red-700 hover:underline">Delete operator</button>
    </form>
  </AdminShell>
</template>
