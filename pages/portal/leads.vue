<script lang="ts">
export const layout = '!portal';
</script>

<script setup lang="ts">
import { Link } from '@void/vue';

defineProps<{
  operator: {
    complimentaryLeadsRemaining: number;
    leadEmailsOptOut: boolean;
    leadNotifyEmail: string | null;
    email: string | null;
    hasCard: boolean;
    cardLabel: string | null;
    autoUnlockEnabled: boolean;
    autoUnlockWeeklyCap: number;
  } | null;
  notifyEmail: string | null;
  autoBoughtThisWeek: number;
  defaultPriceLabel: string;
  exclusivePriceLabel: string;
  leads: {
    id: string;
    status: string;
    createdLabel: string;
    projectSize: string | null;
    materialLabel: string;
    addressOrZip: string | null;
    timeline: string | null;
    priceLabel: string;
    contact: {
      name: string;
      email: string;
      phone: string | null;
      preferredContactLabel: string;
      notes: string | null;
    } | null;
  }[];
  ok: string | null;
  err: string | null;
  canceled: string | null;
}>();
</script>

<template>
  <p v-if="!operator" class="card p-6 text-sm text-muted">
    Claim and get approval for a listing before unlocking leads.
    <Link href="/portal">Back to overview</Link>
  </p>
  <template v-else>
    <p class="mb-4 text-sm text-muted">
      Offered leads hide contact details until unlocked. You have
      <strong>{{ operator.complimentaryLeadsRemaining }}</strong> complimentary unlock{{ operator.complimentaryLeadsRemaining === 1 ? '' : 's' }}
      left; after that unlocks cost the price shown on each lead: {{ exclusivePriceLabel }} when the customer asked for you
      directly (exclusive), {{ defaultPriceLabel }} when shared with up to 2 other operators.
    </p>
    <section class="card mb-6 p-5" aria-labelledby="notify-heading">
      <h2 id="notify-heading" class="font-bold text-ink">Lead emails</h2>
      <p class="mt-1 text-sm text-muted">
        <template v-if="operator.leadEmailsOptOut">
          You unsubscribed from lead emails, so no new leads are offered to you. Turn on auto-buy to start again.
        </template>
        <template v-else-if="notifyEmail">
          New leads, unlocks and receipts go to <strong>{{ notifyEmail }}</strong>.
        </template>
        <template v-else>
          No email on file: new leads only show up on this page. Add an address to be told when one arrives.
        </template>
      </p>
      <form method="POST" action="?notifyEmail" class="mt-4 flex flex-wrap items-end gap-3">
        <div class="min-w-0 flex-1 sm:max-w-sm">
          <label class="label" for="lead-notify-email">Send lead emails to</label>
          <input
            class="input"
            id="lead-notify-email"
            name="leadNotifyEmail"
            type="email"
            :value="operator.leadNotifyEmail ?? ''"
            :placeholder="operator.email ?? 'you@company.com'"
          />
        </div>
        <button type="submit" class="btn-secondary text-xs">Save</button>
        <p class="w-full text-xs text-muted">
          Leave blank to use your listing's public email{{ operator.email ? ` (${operator.email})` : '' }}.
        </p>
      </form>
    </section>
    <section class="card mb-6 p-5" aria-labelledby="autobuy-heading">
      <h2 id="autobuy-heading" class="font-bold text-ink">Auto-buy</h2>
      <p class="mt-1 text-sm text-muted">
        Get new leads with full contact details the moment they come in. We charge your saved
        card the price shown on each lead, up to your weekly limit. Turn it off any time.
      </p>
      <form v-if="operator.hasCard" method="POST" action="?autobuy" class="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label class="label" for="autobuy-cap">Max leads per week</label>
          <input
            class="input w-28"
            id="autobuy-cap"
            name="cap"
            type="number"
            min="1"
            max="100"
            :value="operator.autoUnlockWeeklyCap"
          />
        </div>
        <template v-if="operator.autoUnlockEnabled">
          <button type="submit" name="enabled" value="1" class="btn-secondary text-xs">Save limit</button>
          <button type="submit" name="enabled" value="0" class="btn-secondary text-xs">Turn off auto-buy</button>
        </template>
        <button v-else type="submit" name="enabled" value="1" class="btn-primary text-xs">Turn on auto-buy</button>
        <p class="w-full text-xs text-muted">
          {{ operator.autoUnlockEnabled ? 'On' : 'Off' }} · card {{ operator.cardLabel ?? 'on file' }} ·
          {{ autoBoughtThisWeek }} bought in the last 7 days
        </p>
      </form>
      <p v-else class="mt-3 text-sm text-muted">Buy one lead with a card below and it is saved for auto-buy.</p>
    </section>
    <p v-if="ok === 'unlocked'" class="mb-4 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
      Lead unlocked.
    </p>
    <p v-if="ok === 'autobuy_on'" class="mb-4 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
      Auto-buy is on. New leads will arrive unlocked.
    </p>
    <p v-if="ok === 'notify_saved'" class="mb-4 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
      Lead email address saved.
    </p>
    <p v-if="ok === 'autobuy_off'" class="mb-4 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
      Auto-buy is off.
    </p>
    <p v-if="ok === 'processing'" class="mb-4 border-2 border-amber-500 bg-amber-50 px-3 py-2 text-sm">
      Payment received. Contact details appear once the payment fully clears.
    </p>
    <p v-if="canceled" class="mb-4 border-2 border-amber-500 bg-amber-50 px-3 py-2 text-sm">Checkout canceled.</p>
    <p v-if="err" class="mb-4 border-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800">{{ err }}</p>
    <div class="space-y-4">
      <p v-if="leads.length === 0" class="card p-8 text-center text-sm text-muted">No leads assigned yet.</p>
      <template v-else>
      <article v-for="lead in leads" :key="lead.id" class="card p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="font-bold text-ink">{{ lead.contact ? lead.contact.name : 'Lead available' }}</h2>
            <p v-if="lead.contact" class="text-sm text-muted">
              {{ lead.contact.email }}<template v-if="lead.contact.phone"> · {{ lead.contact.phone }}</template>
            </p>
            <p v-else-if="lead.status === 'offered'" class="text-sm text-muted">
              Contact details unlock after complimentary or paid unlock.
            </p>
            <p v-else class="text-sm text-muted">Status: {{ lead.status }}</p>
          </div>
          <div class="text-right text-xs text-muted">
            <p>{{ lead.createdLabel }}</p>
            <p class="mt-1 font-semibold uppercase text-ink">{{ lead.status }}</p>
          </div>
        </div>
        <dl class="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-muted">Size</dt>
            <dd>{{ lead.projectSize || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted">Material</dt>
            <dd>{{ lead.materialLabel }}</dd>
          </div>
          <div>
            <dt class="text-muted">Location</dt>
            <dd>{{ lead.addressOrZip || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted">Timeline</dt>
            <dd>{{ lead.timeline || '—' }}</dd>
          </div>
          <div v-if="lead.contact">
            <dt class="text-muted">Preferred contact</dt>
            <dd>{{ lead.contact.preferredContactLabel }}</dd>
          </div>
          <div v-if="lead.contact && lead.contact.notes" class="sm:col-span-2">
            <dt class="text-muted">Notes</dt>
            <dd>{{ lead.contact.notes }}</dd>
          </div>
        </dl>
        <form
          v-if="lead.status === 'offered'"
          method="POST"
          :action="operator.complimentaryLeadsRemaining > 0 ? '?unlockLeadComplimentary' : '?createLeadCheckout'"
          class="mt-4 flex flex-wrap gap-2"
        >
          <input type="hidden" name="leadId" :value="lead.id" />
          <button v-if="operator.complimentaryLeadsRemaining > 0" type="submit" class="btn-primary text-xs">
            Unlock free teaser
          </button>
          <button v-else type="submit" class="btn-primary text-xs">Unlock for {{ lead.priceLabel }}</button>
        </form>
      </article>
      </template>
    </div>
  </template>
</template>
