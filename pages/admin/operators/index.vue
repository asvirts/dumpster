<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../../src/components/admin/AdminShell.vue';

defineProps<{
  adminEmail?: string | null;
  status: string;
  q: string;
  rows: {
    id: string;
    name: string;
    hqCity: string | null;
    hqState: string | null;
    isBroker: boolean;
    isDemo: boolean;
    verificationStatus: string;
    isPublished: boolean;
    qualityScore: number | null;
    lastVerified: string;
  }[];
}>();
</script>

<template>
  <AdminShell title="Operators" :admin-email="adminEmail">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <form method="get" class="flex flex-wrap gap-2">
        <input class="input w-48" name="q" :value="q" placeholder="Search name…" />
        <select class="input w-40" name="status">
          <option value="">All statuses</option>
          <option value="pending" :selected="status === 'pending'">Pending</option>
          <option value="verified" :selected="status === 'verified'">Verified</option>
          <option value="rejected" :selected="status === 'rejected'">Rejected</option>
        </select>
        <button class="btn-secondary" type="submit">Filter</button>
      </form>
      <a href="/admin/operators/new" class="btn-primary">Add operator</a>
    </div>

    <div class="overflow-x-auto rounded-xl border border-border bg-white">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="border-b border-border bg-surface text-xs uppercase text-muted">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Published</th>
            <th class="px-4 py-3">Score</th>
            <th class="px-4 py-3">Last verified</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="op in rows" :key="op.id">
            <td class="px-4 py-3">
              <p class="font-semibold text-ink">{{ op.name }}</p>
              <p class="text-xs text-muted">
                {{ [op.hqCity, op.hqState].filter(Boolean).join(', ') }}{{ op.isBroker ? ' · broker' : '' }}{{ op.isDemo ? ' · demo' : '' }}
              </p>
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'badge',
                  op.verificationStatus === 'verified' && 'badge-verified',
                  op.verificationStatus === 'pending' && 'bg-amber-100 text-amber-900',
                  op.verificationStatus === 'rejected' && 'bg-red-100 text-red-800',
                ]"
              >
                {{ op.verificationStatus }}
              </span>
            </td>
            <td class="px-4 py-3">{{ op.isPublished ? 'Yes' : 'No' }}</td>
            <td class="px-4 py-3">{{ op.qualityScore ?? '—' }}</td>
            <td class="px-4 py-3 text-muted">{{ op.lastVerified }}</td>
            <td class="px-4 py-3 text-right">
              <a :href="`/admin/operators/${op.id}`" class="font-medium">Edit</a>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="rows.length === 0" class="p-8 text-center text-sm text-muted">No operators found.</p>
    </div>
  </AdminShell>
</template>
