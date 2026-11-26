<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../src/components/admin/AdminShell.vue';

defineProps<{
  adminEmail?: string | null;
  counts: { pending: number; verified: number; published: number; newLeads: number; pendingClaims: number };
  pendingList: { id: string; name: string; hqCity: string | null; hqState: string | null; phone: string | null }[];
}>();
</script>

<template>
  <AdminShell title="Dashboard" :admin-email="adminEmail">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div class="card p-5">
        <p class="text-sm text-muted">Pending verification</p>
        <p class="mt-1 text-3xl font-bold text-amber-700">{{ counts.pending }}</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-muted">Verified</p>
        <p class="mt-1 text-3xl font-bold text-brand-700">{{ counts.verified }}</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-muted">Published</p>
        <p class="mt-1 text-3xl font-bold text-ink">{{ counts.published }}</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-muted">New leads</p>
        <p class="mt-1 text-3xl font-bold text-sky-700">{{ counts.newLeads }}</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-muted">Pending claims</p>
        <p class="mt-1 text-3xl font-bold text-violet-700">{{ counts.pendingClaims }}</p>
      </div>
    </div>

    <section class="mt-10">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-lg font-bold text-ink">Verification queue</h2>
        <a href="/admin/operators?status=pending" class="text-sm font-medium">View all</a>
      </div>
      <p v-if="pendingList.length === 0" class="mt-4 text-sm text-muted">No pending operators. Nice work.</p>
      <ul v-else class="mt-4 divide-y divide-border rounded-xl border border-border bg-white">
        <li v-for="op in pendingList" :key="op.id" class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <a :href="`/admin/operators/${op.id}`" class="font-semibold text-ink no-underline hover:text-brand-700">
              {{ op.name }}
            </a>
            <p class="text-xs text-muted">
              {{ [op.hqCity, op.hqState].filter(Boolean).join(', ') || 'No HQ' }} · {{ op.phone || 'No phone' }}
            </p>
          </div>
          <a :href="`/admin/operators/${op.id}`" class="btn-secondary text-xs">Review</a>
        </li>
      </ul>
    </section>

    <section class="mt-10">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-lg font-bold text-ink">Claims queue</h2>
        <a href="/admin/claims" class="text-sm font-medium">View all</a>
      </div>
      <p class="mt-2 text-sm text-muted">
        {{
          counts.pendingClaims === 0
            ? 'No pending listing claims.'
            : `${counts.pendingClaims} operator(s) waiting for claim approval.`
        }}
      </p>
    </section>

    <div class="mt-8 flex flex-wrap gap-3">
      <a href="/admin/operators/new" class="btn-primary">Add operator</a>
      <a href="/admin/import" class="btn-secondary">CSV import</a>
      <a href="/admin/leads" class="btn-secondary">Leads inbox</a>
      <a href="/admin/claims" class="btn-secondary">Claims queue</a>
    </div>
  </AdminShell>
</template>
