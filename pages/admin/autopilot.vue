<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../src/components/admin/AdminShell.vue';

defineProps<{
  adminEmail?: string | null;
  runStats: {
    routed: number;
    held: number;
    unmatched: number;
    expanded: number;
    reminded: number;
    expired: number;
    errors: number;
  } | null;
  digestSent: boolean | null;
  exclusivePrice: string;
  sharedPrice: string;
  reminderAfterHours: number;
  expandAfterHours: number;
  expireAfterDays: number;
  digest: { subject: string; text: string };
}>();
</script>

<template>
  <AdminShell title="Autopilot" :admin-email="adminEmail">
    <p class="mb-6 text-sm text-muted">
      Leads are routed, sold and followed up automatically. A cron runs every 15 minutes and the
      summary below is emailed daily at 14:00 UTC. Nothing here needs action — use these buttons only
      to run a cycle early.
    </p>

    <section class="card mb-6 p-5">
      <h2 class="font-bold text-ink">What runs on its own</h2>
      <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
        <li>
          New quotes go straight to matching operators (direct quote → requested operator at
          {{ exclusivePrice }} exclusive; match request → up to 3
          operators at {{ sharedPrice }} shared).
        </li>
        <li>Operators on auto-buy are charged and receive contact details instantly.</li>
        <li>Likely-junk quotes (bad phone, disposable email, link spam) are held, never sold.</li>
        <li>One reminder after {{ reminderAfterHours }}h; after {{ expandAfterHours }}h unbought leads go to more operators.</li>
        <li>Leads unsold after {{ expireAfterDays }} days close automatically.</li>
        <li>Listing claims approve instantly when the claimant's verified email matches the listing.</li>
      </ul>
    </section>

    <form method="POST" class="mb-6 flex flex-wrap gap-2">
      <button type="submit" name="intent" value="run" class="btn-primary text-xs">Run autopilot now</button>
      <button type="submit" name="intent" value="digest" class="btn-secondary text-xs">Email me the digest now</button>
    </form>

    <p v-if="runStats" class="mb-6 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
      Ran: {{ runStats.routed }} routed · {{ runStats.expanded }} widened · {{ runStats.reminded }} reminders ·
      {{ runStats.expired }} expired · {{ runStats.held }} held · {{ runStats.unmatched }} without an operator ·
      {{ runStats.errors }} errors
    </p>
    <p v-if="digestSent !== null" class="mb-6 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
      {{ digestSent ? 'Digest emailed.' : 'Digest not sent (check RESEND_API_KEY and ADMIN_NOTIFY_EMAIL).' }}
    </p>

    <section class="card p-5">
      <h2 class="font-bold text-ink">{{ digest.subject }}</h2>
      <pre class="mt-3 whitespace-pre-wrap font-mono text-xs">{{ digest.text }}</pre>
    </section>
  </AdminShell>
</template>
