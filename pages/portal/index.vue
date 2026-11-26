<script lang="ts">
export const layout = '!portal';
</script>

<script setup lang="ts">
import { Link } from '@void/vue';

defineProps<{
  operator: { name: string; slug: string; isPublished: boolean; complimentaryLeadsRemaining: number } | null;
  pendingName: string | null;
  offered: number;
  unlocked: number;
}>();
</script>

<template>
  <div v-if="!operator && pendingName" class="card border-amber-500 bg-amber-50 p-6">
    <h2 class="font-bold text-ink">Claim pending</h2>
    <p class="mt-2 text-sm text-charcoal-700">
      Your claim for <strong>{{ pendingName }}</strong> is awaiting admin approval. You’ll get portal
      access once it’s approved.
    </p>
  </div>
  <div v-if="!operator && !pendingName" class="card p-6">
    <h2 class="font-bold text-ink">No listing linked</h2>
    <p class="mt-2 text-sm text-muted">
      Find your company on the public directory and click <strong>Claim this listing</strong>. After
      we approve, leads and listing edits show up here.
    </p>
    <a href="/search" class="btn-primary mt-4 inline-flex">Browse directory</a>
  </div>
  <template v-if="operator">
    <p class="mb-6 text-sm text-muted">
      Managing <strong>{{ operator.name }}</strong>{{ operator.isPublished ? ' · published' : ' · not published yet' }}{{ ' · ' }}complimentary leads left: {{ operator.complimentaryLeadsRemaining }}
    </p>
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="card p-5">
        <p class="text-sm text-muted">Offered leads</p>
        <p class="mt-1 text-3xl font-bold text-sky-700">{{ offered }}</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-muted">Unlocked leads</p>
        <p class="mt-1 text-3xl font-bold text-brand-700">{{ unlocked }}</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-muted">Free teaser left</p>
        <p class="mt-1 text-3xl font-bold text-ink">{{ operator.complimentaryLeadsRemaining }}</p>
      </div>
    </div>
    <div class="mt-8 flex flex-wrap gap-3">
      <Link href="/portal/leads" class="btn-primary">View leads</Link>
      <Link href="/portal/listing" class="btn-secondary">Edit listing</Link>
      <a :href="`/operator/${operator.slug}`" class="btn-ghost">Public profile</a>
    </div>
  </template>
</template>
