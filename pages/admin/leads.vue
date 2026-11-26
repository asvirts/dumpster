<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../src/components/admin/AdminShell.vue';

defineProps<{
  adminEmail?: string | null;
  filters: { status: string; mode: string; operator: string; q: string; from: string; to: string };
  okMsg: string | null;
  errMsg: string | null;
  exportHref: string;
  statuses: string[];
  modes: string[];
  operatorOptions: { id: string; name: string; complimentaryLeadsRemaining: number; claimStatus: string }[];
  rows: {
    id: string;
    seekerName: string;
    seekerEmail: string;
    seekerPhone: string | null;
    mode: string;
    operatorId: string | null;
    requestedOperatorId: string | null;
    operatorName: string | null;
    operatorSlug: string | null;
    complimentaryRemaining: number | null;
    claimStatus: string | null;
    requestedName: string | null;
    requestedSlug: string | null;
    sourcePath: string | null;
    created: string;
    status: string;
    unlockMethod: string | null;
    projectSize: string | null;
    material: string;
    addressOrZip: string | null;
    timeline: string | null;
    notes: string | null;
  }[];
}>();

const routable = (status: string) =>
  status !== 'unlocked' && status !== 'closed' && status !== 'spam' && status !== 'invalid';
</script>

<template>
  <AdminShell title="Leads" :admin-email="adminEmail">
    <p class="mb-4 text-sm text-muted">
      Quotes stay held until you route them. First unlock per operator can be complimentary; after that
      offer paid unlock. Match requests can go to up to 3 operators.
    </p>

    <p v-if="okMsg" class="mb-4 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800" role="status">
      {{ okMsg }}
    </p>
    <p v-if="errMsg" class="mb-4 border-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
      {{ errMsg }}
    </p>

    <form method="GET" class="mb-6 flex flex-wrap items-end gap-3">
      <div>
        <label class="label" for="q">Search</label>
        <input class="input w-48" id="q" name="q" :value="filters.q" placeholder="Name, email, ZIP" />
      </div>
      <div>
        <label class="label" for="status">Status</label>
        <select class="input w-36" id="status" name="status">
          <option value="">All</option>
          <option v-for="s in statuses" :key="s" :value="s" :selected="filters.status === s">{{ s }}</option>
        </select>
      </div>
      <div>
        <label class="label" for="mode">Mode</label>
        <select class="input w-32" id="mode" name="mode">
          <option value="">All</option>
          <option v-for="m in modes" :key="m" :value="m" :selected="filters.mode === m">{{ m }}</option>
        </select>
      </div>
      <div>
        <label class="label" for="operator">Operator</label>
        <select class="input min-w-[12rem]" id="operator" name="operator">
          <option value="">All</option>
          <option v-for="op in operatorOptions" :key="op.id" :value="op.id" :selected="filters.operator === op.id">
            {{ op.name }}
          </option>
        </select>
      </div>
      <div>
        <label class="label" for="from">From</label>
        <input class="input" id="from" name="from" type="date" :value="filters.from" />
      </div>
      <div>
        <label class="label" for="to">To</label>
        <input class="input" id="to" name="to" type="date" :value="filters.to" />
      </div>
      <button type="submit" class="btn-secondary text-xs">Filter</button>
      <a :href="exportHref" class="btn-ghost text-xs">Export CSV</a>
    </form>

    <div class="space-y-4">
      <p v-if="rows.length === 0" class="card p-8 text-center text-sm text-muted">No leads match these filters.</p>
      <article v-for="lead in rows" v-else :key="lead.id" class="card p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="font-bold text-ink">
              <a :href="`/admin/leads/${lead.id}`">{{ lead.seekerName }}</a>
            </h2>
            <p class="text-sm text-muted">
              {{ lead.seekerEmail }}<template v-if="lead.seekerPhone"> · {{ lead.seekerPhone }}</template>
            </p>
            <p class="mt-1 text-sm">
              <span class="font-mono text-xs uppercase text-muted">{{ lead.mode }}</span>
              {{ ' · ' }}Assigned:
              <a v-if="lead.operatorSlug" :href="`/operator/${lead.operatorSlug}`">{{ lead.operatorName }}</a>
              <template v-else>{{ lead.operatorName || (lead.operatorId ?? 'unassigned') }}</template>
              <span v-if="typeof lead.complimentaryRemaining === 'number'" class="text-muted">
                · free left: {{ lead.complimentaryRemaining }}</span
              >
              <span v-if="lead.claimStatus" class="text-muted"> · claim: {{ lead.claimStatus }}</span>
            </p>
            <p
              v-if="(lead.requestedName || lead.requestedSlug) && lead.requestedOperatorId !== lead.operatorId"
              class="text-sm text-muted"
            >
              Originally requested:
              <a v-if="lead.requestedSlug" :href="`/operator/${lead.requestedSlug}`">{{ lead.requestedName }}</a>
              <template v-else>{{ lead.requestedName }}</template>
            </p>
            <p v-if="lead.sourcePath" class="mt-1 font-mono text-[11px] text-muted">{{ lead.sourcePath }}</p>
          </div>
          <div class="text-right text-xs text-muted">
            <p>{{ lead.created }}</p>
            <p class="mt-1 font-semibold uppercase text-ink">{{ lead.status }}</p>
            <p v-if="lead.unlockMethod" class="mt-0.5 uppercase text-brand-700">{{ lead.unlockMethod }}</p>
          </div>
        </div>
        <dl class="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-muted">Size</dt>
            <dd>{{ lead.projectSize || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted">Material</dt>
            <dd>{{ lead.material }}</dd>
          </div>
          <div>
            <dt class="text-muted">Location</dt>
            <dd>{{ lead.addressOrZip || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted">Timeline</dt>
            <dd>{{ lead.timeline || '—' }}</dd>
          </div>
          <div v-if="lead.notes" class="sm:col-span-2">
            <dt class="text-muted">Notes</dt>
            <dd>{{ lead.notes }}</dd>
          </div>
        </dl>

        <form
          v-if="routable(lead.status)"
          method="POST"
          class="mt-4 flex flex-wrap items-end gap-2 border-t border-border pt-4"
        >
          <input type="hidden" name="id" :value="lead.id" />
          <div>
            <label class="label" :for="`op-${lead.id}`">Operator</label>
            <select class="input min-w-[14rem]" :id="`op-${lead.id}`" name="operatorId" required>
              <option v-for="op in operatorOptions" :key="op.id" :value="op.id" :selected="op.id === lead.operatorId">
                {{ op.name }} (free:{{ op.complimentaryLeadsRemaining }} · {{ op.claimStatus }})
              </option>
            </select>
          </div>
          <button type="submit" name="intent" value="pass_complimentary" class="btn-primary text-xs">
            Pass complimentary
          </button>
          <button type="submit" name="intent" value="offer_paid" class="btn-secondary text-xs">Offer paid</button>
          <button type="submit" name="intent" value="reassign" class="btn-ghost text-xs">Reassign only</button>
          <button type="submit" name="intent" value="close" class="btn-ghost text-xs">Close</button>
          <button type="submit" name="intent" value="spam" class="btn-ghost text-xs text-red-700">Spam</button>
          <button type="submit" name="intent" value="invalid" class="btn-ghost text-xs">Invalid</button>
        </form>

        <p class="mt-3 text-xs">
          <a :href="`/admin/leads/${lead.id}`">Open details →</a>
        </p>
      </article>
    </div>
  </AdminShell>
</template>
