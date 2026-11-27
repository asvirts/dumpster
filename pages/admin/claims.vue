<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../src/components/admin/AdminShell.vue';

defineProps<{
  adminEmail?: string | null;
  pendingClaims: {
    id: string;
    name: string;
    slug: string;
    email: string | null;
    phone: string | null;
    requestedAt: string;
    claimRequestedByEmail: string | null;
    claimRequestedByUserId: string | null;
    orgId: string | null;
    claimMessage: string | null;
  }[];
}>();
</script>

<template>
  <AdminShell title="Claims" :admin-email="adminEmail">
    <p class="mb-6 text-sm text-muted">
      Operators request ownership of a directory listing from their company account. Approve to unlock the company portal.
    </p>

    <div class="space-y-4">
      <p v-if="pendingClaims.length === 0" class="card p-8 text-center text-sm text-muted">No pending claims.</p>
      <article v-for="op in pendingClaims" v-else :key="op.id" class="card p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="font-bold text-ink">
              <a :href="`/admin/operators/${op.id}`">{{ op.name }}</a>
            </h2>
            <p class="text-sm text-muted">{{ op.email || 'No email' }} · {{ op.phone || 'No phone' }}</p>
            <p class="mt-1 text-xs text-muted">
              Requested {{ op.requestedAt }}
              <template v-if="op.claimRequestedByEmail"> · by {{ op.claimRequestedByEmail }}</template>
              <template v-if="op.claimRequestedByUserId"> · user {{ op.claimRequestedByUserId }}</template>
            </p>
            <p v-if="op.orgId" class="mt-1 font-mono text-xs text-muted">org: {{ op.orgId }}</p>
            <p v-if="op.claimMessage" class="mt-2 text-sm">{{ op.claimMessage }}</p>
          </div>
          <a :href="`/operator/${op.slug}`" class="text-xs text-brand-700">Public profile →</a>
        </div>
        <form method="POST" class="mt-4 flex flex-wrap items-end gap-2">
          <input type="hidden" name="id" :value="op.id" />
          <div class="min-w-[12rem] flex-1">
            <label class="label" :for="`notes-${op.id}`">Reject notes (optional)</label>
            <input class="input" :id="`notes-${op.id}`" name="notes" />
          </div>
          <button type="submit" name="intent" value="approve" class="btn-primary text-xs">Approve</button>
          <button type="submit" name="intent" value="reject" class="btn-secondary text-xs">Reject</button>
        </form>
      </article>
    </div>
  </AdminShell>
</template>
