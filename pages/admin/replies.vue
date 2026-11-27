<script lang="ts">
export const layout = false;
</script>

<script setup lang="ts">
import AdminShell from '../../src/components/admin/AdminShell.vue';

defineProps<{
  adminEmail?: string | null;
  flash: string | null;
  open: {
    id: string;
    subject: string | null;
    receivedAt: string;
    from: string;
    operatorName: string | null;
    operatorSlug: string | null;
    replyText: string | null;
  }[];
  done: { id: string; who: string; subject: string | null; state: string }[];
}>();
</script>

<template>
  <AdminShell title="Replies" :admin-email="adminEmail">
    <p class="mb-6 text-sm text-muted">
      Replies to lead emails arrive here (reply-to <code>leads@eeildoiint.resend.app</code>). Opt-out
      requests and out-of-office replies are handled automatically. Answers go out from
      <code>leads@findadumpster.net</code> in the same thread.
    </p>

    <p v-if="flash" class="mb-6 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">{{ flash }}</p>

    <h2 class="mb-3 font-bold text-ink">Needs an answer ({{ open.length }})</h2>
    <p v-if="open.length === 0" class="mb-8 text-sm text-muted">Nothing waiting.</p>
    <div class="mb-10 space-y-4">
      <section v-for="reply in open" :id="reply.id" :key="reply.id" class="card p-5">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h3 class="font-bold text-ink">{{ reply.subject }}</h3>
          <span class="text-xs text-muted">{{ reply.receivedAt }}</span>
        </div>
        <p class="mt-1 text-sm">
          {{ reply.from }}
          <template v-if="reply.operatorName">
            · <a :href="`/operator/${reply.operatorSlug}`">{{ reply.operatorName }}</a>
          </template>
        </p>
        <pre class="mt-3 whitespace-pre-wrap font-sans text-sm">{{ reply.replyText ?? '(Reply text unavailable — set RESEND_RECEIVING_API_KEY.)' }}</pre>
        <form method="POST" class="mt-4 space-y-2">
          <input type="hidden" name="id" :value="reply.id" />
          <textarea name="text" rows="4" class="input w-full" placeholder="Your answer (sent from leads@findadumpster.net)"></textarea>
          <div class="flex gap-2">
            <button type="submit" name="intent" value="answer" class="btn-primary text-xs">Send answer</button>
            <button type="submit" name="intent" value="done" class="btn-secondary text-xs">Mark done without answering</button>
          </div>
        </form>
      </section>
    </div>

    <h2 class="mb-3 font-bold text-ink">Handled</h2>
    <p v-if="done.length === 0" class="text-sm text-muted">None yet.</p>
    <ul class="space-y-2">
      <li v-for="reply in done" :key="reply.id" class="card flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
        <span>
          <strong>{{ reply.who }}</strong> — {{ reply.subject }}
          <span class="text-muted"> · {{ reply.state }} </span>
        </span>
        <form method="POST">
          <input type="hidden" name="id" :value="reply.id" />
          <button type="submit" name="intent" value="reopen" class="btn-secondary px-2 py-1 text-xs">Reopen</button>
        </form>
      </li>
    </ul>
  </AdminShell>
</template>
