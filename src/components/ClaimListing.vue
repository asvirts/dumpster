<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { loginPath } from '../lib/auth-paths';

// Island (hydrate on `load`). The operator page is cached and anonymous, so the server renders the
// signed-out state (as Astro did for anonymous visitors). After hydration the island asks
// /api/session who is signed in and switches to "choose company" or the claim form. A claim POST
// comes back through the flash cookie as `feedback` (see src/server/claim.ts).
const props = withDefaults(
  defineProps<{
    operatorId: string;
    operatorName: string;
    claimStatus: string;
    actionUrl: string;
    returnTo: string;
    feedback?: {
      ok: boolean;
      message?: string;
      values?: Record<string, string>;
    } | null;
  }>(),
  { feedback: null },
);

const canClaim = computed(() => props.claimStatus === 'unclaimed' || props.claimStatus === 'rejected');
const values = computed(() => props.feedback?.values ?? {});
const error = computed(() => (props.feedback && !props.feedback.ok ? props.feedback.message : null));
const chooseCompany = computed(() => `/portal/select-org?${new URLSearchParams({ returnTo: props.returnTo })}`);

// Seeded from a claim result (rendered live after the POST), then confirmed by /api/session.
const signedIn = ref(values.value.signedIn === '1');
const hasOrg = ref(signedIn.value && values.value.reason !== 'org');
const orgName = ref<string | null>(null);

onMounted(async () => {
  if (!canClaim.value) return;
  try {
    const res = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' });
    if (!res.ok) return;
    const s = (await res.json()) as { signedIn: boolean; hasOrg: boolean; orgName: string | null };
    signedIn.value = s.signedIn;
    hasOrg.value = s.hasOrg;
    orgName.value = s.orgName;
  } catch {
    /* keep the server-rendered state */
  }
});
</script>

<template>
  <div id="claim" class="card p-5">
    <p class="font-mono text-xs font-bold uppercase tracking-widest text-ink">Own this listing?</p>
    <p v-if="claimStatus === 'approved'" class="mt-2 text-sm text-muted">
      This listing is claimed.
      <a href="/portal">Open operator portal</a>
    </p>
    <p v-if="claimStatus === 'pending'" class="mt-2 text-sm text-amber-800">
      A claim for {{ operatorName }} is pending admin review.
    </p>
    <template v-if="canClaim">
      <p class="mt-2 text-sm text-charcoal-700">
        Claim {{ operatorName }} with your company account to unlock leads and update your profile. Signing in
        with the listing’s email (or an email on its website domain) approves the claim instantly.
      </p>
      <template v-if="!signedIn">
        <p v-if="error" class="mt-4 border-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {{ error }}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <a :href="loginPath(returnTo)" class="btn-secondary text-xs">Sign in</a>
          <a :href="loginPath(returnTo, { signUp: true })" class="btn-secondary text-xs">Sign up</a>
        </div>
      </template>
      <div v-else-if="!hasOrg" class="mt-4 space-y-3">
        <p class="text-xs text-muted">Choose or create your company, then submit the claim.</p>
        <a :href="chooseCompany" class="btn-secondary text-xs">Choose company</a>
      </div>
      <div v-else class="mt-4 space-y-3">
        <p class="text-xs text-muted">
          Claiming as <strong class="text-ink">{{ orgName ?? 'your company' }}</strong>.
          <a :href="chooseCompany">Change company</a>
        </p>
        <p v-if="error" class="border-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {{ error }}
        </p>
        <p
          v-if="feedback?.ok && values.autoApproved === '1'"
          class="border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800"
        >
          Claim approved — your verified email matches this listing.
          <a href="/portal/leads">Open your leads</a>
        </p>
        <p v-else-if="feedback?.ok" class="border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
          Claim submitted — we’ll email you when it’s reviewed. Tip: claims approve instantly when you sign in with
          the listing’s email or an email on its website domain.
        </p>
        <form v-else method="POST" :action="actionUrl" class="space-y-3">
          <input type="hidden" name="operatorId" :value="operatorId" />
          <div>
            <label class="label" for="claim-message">Message (optional)</label>
            <textarea id="claim-message" class="input" name="message" rows="2" :value="values.message ?? ''"></textarea>
          </div>
          <button type="submit" class="btn-secondary text-xs">Submit claim</button>
        </form>
      </div>
    </template>
  </div>
</template>
