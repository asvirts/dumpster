<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../src/components/admin/AdminShell.vue';

defineProps<{
  adminEmail?: string | null;
  saved: string | null;
  rows: {
    id: string;
    name: string;
    state: string;
    slug: string;
    stateSlug: string;
    localPermitSummary: string | null;
    typicalPricingNotes: string | null;
    specialRules: string | null;
    isPriority: boolean;
  }[];
}>();
</script>

<template>
  <AdminShell title="Cities" :admin-email="adminEmail">
    <p class="mb-6 text-sm text-muted">
      Edit local intelligence blocks shown on city landing pages. Unique content beats thin templates.
    </p>
    <p v-if="saved" class="mb-4 text-sm text-brand-700" role="status">Saved city content.</p>
    <div class="space-y-6">
      <form v-for="c in rows" :key="c.id" method="POST" class="card space-y-3 p-5">
        <input type="hidden" name="id" :value="c.id" />
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="font-bold text-ink">{{ c.name }}, {{ c.state }}</h2>
          <a :href="`/dumpster-rental/${c.stateSlug}/${c.slug}`" class="text-xs font-medium" target="_blank">
            View page →
          </a>
        </div>
        <div>
          <label class="label">Permit summary</label>
          <textarea class="input" name="localPermitSummary" rows="3" :value="c.localPermitSummary ?? ''"></textarea>
        </div>
        <div>
          <label class="label">Pricing notes</label>
          <textarea class="input" name="typicalPricingNotes" rows="3" :value="c.typicalPricingNotes ?? ''"></textarea>
        </div>
        <div>
          <label class="label">Special rules / tips</label>
          <textarea class="input" name="specialRules" rows="2" :value="c.specialRules ?? ''"></textarea>
        </div>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isPriority" :checked="c.isPriority" />
          Priority city (shown on homepage)
        </label>
        <button type="submit" class="btn-primary">Save {{ c.name }}</button>
      </form>
    </div>
  </AdminShell>
</template>
