<script setup lang="ts">
import { computed } from 'vue';
import { loginPath } from '../lib/auth-paths';

// Island (hydrate on `load`). The operator page is anonymous (cached HTML), so this always renders
// the signed-out state plus a native claim form; the `claimListing` action reads the WorkOS
// session and its result comes back as `feedback` (see src/server/claim.ts).
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
const signedIn = computed(() => values.value.signedIn === '1');
const error = computed(() => (props.feedback && !props.feedback.ok ? props.feedback.message : null));
const chooseCompany = computed(() => `/portal/select-org?${new URLSearchParams({ returnTo: props.returnTo })}`);
</script>

<template>
  <div id="claim" class="card p-5">
    <p class="font-mono text-xs font-bold uppercase tracking-widest text-ink">Own this listing?</p>
    <template v-if="feedback?.ok">
      <p
        v-if="values.autoApproved === '1'"
        class="mt-4 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800"
      >
        Claim approved — your verified email matches this listing.
        <a href="/portal/leads">Open your leads</a>
      </p>
      <p v-else class="mt-4 border-2 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-800">
        Claim submitted — we’ll email you when it’s reviewed. Tip: claims approve instantly when you sign in
        with the listing’s email or an email on its website domain.
      </p>
    </template>
    <template v-else>
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
        <p v-if="error" class="mt-4 border-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {{ error }}
        </p>
        <div v-if="!signedIn" class="mt-4 flex flex-wrap gap-2">
          <a :href="loginPath(returnTo)" class="btn-secondary text-xs">Sign in</a>
          <a :href="loginPath(returnTo, { signUp: true })" class="btn-secondary text-xs">Sign up</a>
        </div>
        <div v-if="signedIn && values.reason === 'org'" class="mt-4 space-y-3">
          <p class="text-xs text-muted">Choose or create your company, then submit the claim.</p>
          <a :href="chooseCompany" class="btn-secondary text-xs">Choose company</a>
        </div>
        <form method="POST" :action="actionUrl" class="mt-4 space-y-3">
          <input type="hidden" name="operatorId" :value="operatorId" />
          <p class="text-xs text-muted">
            Signed in with your company? Submit the claim.
            <a :href="chooseCompany">Change company</a>
          </p>
          <div>
            <label class="label" for="claim-message">Message (optional)</label>
            <textarea id="claim-message" class="input" name="message" rows="2" :value="values.message ?? ''"></textarea>
          </div>
          <button type="submit" class="btn-secondary text-xs">Submit claim</button>
        </form>
      </template>
    </template>
  </div>
</template>
