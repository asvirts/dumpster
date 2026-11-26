<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../../src/components/admin/AdminShell.vue';

defineProps<{
  adminEmail?: string | null;
  okMsg: string | null;
  errMsg: string | null;
  lead: {
    id: string;
    mode: string;
    seekerName: string;
    seekerEmail: string;
    seekerPhone: string | null;
    created: string;
    status: string;
    unlockMethod: string | null;
    operatorId: string | null;
    preferredContact: string;
    addressOrZip: string | null;
    projectSize: string | null;
    material: string;
    timeline: string | null;
    budget: string;
    howFound: string;
    price: string;
    notes: string | null;
    sourcePath: string | null;
    referrer: string | null;
    utm: string;
    group: string;
    adminNotes: string | null;
  };
  assigned: { id: string; name: string } | null;
  requested: { id: string; name: string } | null;
  group: { id: string; status: string; operatorId: string | null }[];
  groupAssigned: number;
  maxMatchOffers: number;
  canRoute: boolean;
  statuses: string[];
  operatorOptions: {
    id: string;
    name: string;
    complimentaryLeadsRemaining: number;
    claimStatus: string;
    email: string | null;
  }[];
}>();
</script>

<template>
  <AdminShell :title="`Lead · ${lead.seekerName}`" :admin-email="adminEmail">
    <p class="mb-4 text-sm">
      <a href="/admin/leads">← All leads</a>
    </p>

    <p v-if="okMsg" class="mb-4 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800" role="status">
      {{ okMsg }}
    </p>
    <p v-if="errMsg" class="mb-4 border-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
      {{ errMsg }}
    </p>

    <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div class="space-y-6">
        <article class="card p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="font-mono text-xs uppercase tracking-widest text-muted">{{ lead.mode }} · {{ lead.id }}</p>
              <h2 class="mt-1 text-xl font-bold text-ink">{{ lead.seekerName }}</h2>
              <p class="text-sm text-muted">
                <a :href="`mailto:${lead.seekerEmail}`">{{ lead.seekerEmail }}</a>
                <template v-if="lead.seekerPhone">
                  {{ ' · ' }}<a :href="`tel:${lead.seekerPhone}`">{{ lead.seekerPhone }}</a>
                </template>
              </p>
            </div>
            <div class="text-right text-xs text-muted">
              <p>{{ lead.created }}</p>
              <p class="mt-1 font-semibold uppercase text-ink">{{ lead.status }}</p>
              <p v-if="lead.unlockMethod" class="uppercase text-brand-700">{{ lead.unlockMethod }}</p>
            </div>
          </div>

          <dl class="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-muted">Preferred contact</dt>
              <dd>{{ lead.preferredContact }}</dd>
            </div>
            <div>
              <dt class="text-muted">Location</dt>
              <dd>{{ lead.addressOrZip || '—' }}</dd>
            </div>
            <div>
              <dt class="text-muted">Size</dt>
              <dd>{{ lead.projectSize || '—' }}</dd>
            </div>
            <div>
              <dt class="text-muted">Material</dt>
              <dd>{{ lead.material }}</dd>
            </div>
            <div>
              <dt class="text-muted">Timeline</dt>
              <dd>{{ lead.timeline || '—' }}</dd>
            </div>
            <div>
              <dt class="text-muted">Budget</dt>
              <dd>{{ lead.budget }}</dd>
            </div>
            <div>
              <dt class="text-muted">How found</dt>
              <dd>{{ lead.howFound }}</dd>
            </div>
            <div>
              <dt class="text-muted">Price</dt>
              <dd>{{ lead.price }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-muted">Notes</dt>
              <dd>{{ lead.notes || '—' }}</dd>
            </div>
          </dl>
        </article>

        <article class="card p-5">
          <h3 class="font-bold text-ink">Attribution</h3>
          <dl class="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-muted">Source path</dt>
              <dd class="break-all font-mono text-xs">{{ lead.sourcePath || '—' }}</dd>
            </div>
            <div>
              <dt class="text-muted">Referrer</dt>
              <dd class="break-all font-mono text-xs">{{ lead.referrer || '—' }}</dd>
            </div>
            <div>
              <dt class="text-muted">UTM</dt>
              <dd class="font-mono text-xs">{{ lead.utm }}</dd>
            </div>
            <div>
              <dt class="text-muted">Group</dt>
              <dd class="font-mono text-xs">{{ lead.group }}</dd>
            </div>
          </dl>
        </article>

        <article v-if="group.length > 1" class="card p-5">
          <h3 class="font-bold text-ink">Group ({{ groupAssigned }}/{{ maxMatchOffers }} assigned)</h3>
          <ul class="mt-3 divide-y divide-border text-sm">
            <li v-for="g in group" :key="g.id" class="flex flex-wrap justify-between gap-2 py-2">
              <a :href="`/admin/leads/${g.id}`">{{ g.id === lead.id ? 'This row' : g.id }}</a>
              <span class="text-muted">{{ g.status }}{{ g.operatorId ? ` · ${g.operatorId}` : ' · unassigned' }}</span>
            </li>
          </ul>
        </article>

        <form method="POST" class="card p-5 space-y-3">
          <input type="hidden" name="intent" value="notes" />
          <label class="label" for="adminNotes">Internal notes</label>
          <textarea class="input min-h-[100px]" id="adminNotes" name="adminNotes" rows="4" :value="lead.adminNotes ?? ''"></textarea>
          <button type="submit" class="btn-secondary text-xs">Save notes</button>
        </form>
      </div>

      <aside class="space-y-4">
        <div class="card p-5">
          <h3 class="font-bold text-ink">Routing</h3>
          <p class="mt-2 text-sm text-muted">
            Assigned:
            <a v-if="assigned" :href="`/admin/operators/${assigned.id}`">{{ assigned.name }}</a>
            <template v-else>unassigned</template>
          </p>
          <p v-if="requested && requested.id !== assigned?.id" class="text-sm text-muted">
            Requested: <a :href="`/admin/operators/${requested.id}`">{{ requested.name }}</a>
          </p>
          <p v-if="lead.mode === 'match'" class="mt-2 text-xs text-muted">
            Match group: {{ groupAssigned }} of {{ maxMatchOffers }} operators. Additional offers clone this
            request.
          </p>

          <form v-if="canRoute" method="POST" class="mt-4 space-y-3">
            <div>
              <label class="label" for="operatorId">Operator</label>
              <select class="input" id="operatorId" name="operatorId" required>
                <option v-for="op in operatorOptions" :key="op.id" :value="op.id" :selected="op.id === lead.operatorId">
                  {{ op.name }} (free:{{ op.complimentaryLeadsRemaining }}{{ op.email ? '' : ' · no email' }})
                </option>
              </select>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="submit" name="intent" value="offer_paid" class="btn-secondary text-xs">Offer paid</button>
              <button type="submit" name="intent" value="pass_complimentary" class="btn-primary text-xs">
                Pass complimentary
              </button>
            </div>
          </form>

          <form v-if="lead.status === 'offered'" method="POST" class="mt-3">
            <button type="submit" name="intent" value="resend" class="btn-ghost text-xs">Resend offer email</button>
          </form>
        </div>

        <form method="POST" class="card p-5 space-y-3">
          <label class="label" for="status">Status</label>
          <select class="input" id="status" name="status">
            <option v-for="s in statuses" :key="s" :value="s" :selected="lead.status === s">{{ s }}</option>
          </select>
          <div class="flex flex-wrap gap-2">
            <button type="submit" name="intent" value="status" class="btn-secondary text-xs">Update status</button>
            <button type="submit" name="intent" value="close" class="btn-ghost text-xs">Close</button>
            <button type="submit" name="intent" value="spam" class="btn-ghost text-xs text-red-700">Spam</button>
            <button type="submit" name="intent" value="invalid" class="btn-ghost text-xs">Invalid</button>
          </div>
        </form>
      </aside>
    </div>
  </AdminShell>
</template>
