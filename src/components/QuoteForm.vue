<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  BUDGET_RANGES,
  DUMPSTER_SIZES,
  HOW_FOUND_OPTIONS,
  MATERIALS,
  MAX_MATCH_OFFERS,
  PREFERRED_CONTACTS,
} from '../lib/constants';

// Island (hydrate on `load`). The server render is a complete native POST form to the page's
// `submitQuote` action; hydration only adds the two-step layout and gtag events.
// Request-derived props come from `quoteFormContext()` in src/server/quote.ts.
const props = withDefaults(
  defineProps<{
    mode?: 'direct' | 'match';
    operatorId?: string;
    operatorName?: string;
    sourceCityId?: string;
    defaultSize?: string;
    defaultMaterial?: string;
    defaultZip?: string;
    actionUrl: string;
    sourcePath?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    referrer?: string;
    turnstileKey?: string;
    feedback?: {
      ok: boolean;
      message?: string;
      fieldErrors?: Record<string, string>;
      values?: Record<string, string>;
    } | null;
  }>(),
  {
    mode: 'direct',
    operatorId: '',
    operatorName: '',
    sourceCityId: '',
    defaultSize: '',
    defaultMaterial: '',
    defaultZip: '',
    sourcePath: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmContent: '',
    utmTerm: '',
    referrer: '',
    turnstileKey: '',
    feedback: null,
  },
);

const isMatch = computed(() => props.mode === 'match');
const heading = computed(() => (isMatch.value ? 'Get free quotes' : 'Request a quote'));
const sub = computed(() =>
  isMatch.value
    ? `Tell us about the job. We’ll review it and connect you with up to ${MAX_MATCH_OFFERS} local operators.`
    : `Tell us about your project. We’ll route your request to ${props.operatorName || 'a local operator'}.`,
);
const submitLabel = computed(() => (isMatch.value ? 'Get free quotes' : 'Get a free quote'));
const formId = computed(() => (isMatch.value ? 'match-quote-form' : 'direct-quote-form'));
const success = computed(() => props.feedback?.ok === true);
const error = computed(() => (props.feedback && !props.feedback.ok ? props.feedback : null));
const errs = computed(() => error.value?.fieldErrors ?? {});

/** Value after a failed submit, else the default. */
function val(name: string, fallback = ''): string {
  return error.value?.values?.[name] ?? fallback;
}
const size = computed(() => val('projectSize', props.defaultSize));
const material = computed(() => val('material', props.defaultMaterial));
const contact = computed(() => val('preferredContact', 'phone'));
const budget = computed(() => val('budgetRange'));
const howFound = computed(() => val('howFound'));

// Progressive enhancement. `enhanced` stays false during SSR and hydration (no mismatch).
const enhanced = ref(false);
const step = ref(1);
const formEl = ref<HTMLFormElement | null>(null);
const zipEl = ref<HTMLInputElement | null>(null);
// Hidden attribution fields; corrected from the browser after mount (the page HTML may be cached).
const hidden = ref({
  sourcePath: props.sourcePath,
  referrer: props.referrer,
  utmSource: props.utmSource,
  utmMedium: props.utmMedium,
  utmCampaign: props.utmCampaign,
  utmContent: props.utmContent,
  utmTerm: props.utmTerm,
});

type Gtag = (...args: unknown[]) => void;
function track(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === 'function') gtag('event', name, { lead_mode: props.mode });
}

let started = false;
function onInput() {
  if (started) return;
  started = true;
  track('lead_form_start');
}
function next() {
  const zip = zipEl.value;
  if (zip && !zip.checkValidity()) {
    zip.reportValidity();
    return;
  }
  step.value = 2;
}
function onSubmit() {
  track('lead_form_submit');
}

onMounted(() => {
  if (success.value) {
    track('lead_form_success');
    return;
  }
  // After a failed submit the server already echoed the original attribution values.
  if (!error.value) updateAttribution();
  step.value = errs.value.addressOrZip || !error.value ? 1 : 2;
  enhanced.value = true;
  track('lead_form_view');
});

function updateAttribution() {
  const loc = new URL(window.location.href);
  for (const k of ['submitQuote', 'claimListing']) loc.searchParams.delete(k);
  const p = loc.searchParams;
  const rest = p.toString();
  hidden.value = {
    sourcePath: loc.pathname + (rest ? `?${rest}` : ''),
    referrer: document.referrer,
    utmSource: p.get('utm_source') ?? '',
    utmMedium: p.get('utm_medium') ?? '',
    utmCampaign: p.get('utm_campaign') ?? '',
    utmContent: p.get('utm_content') ?? '',
    utmTerm: p.get('utm_term') ?? '',
  };
  // Defaults from the URL that a cached page could not include (e.g. /operator/x?zip=…&size=…).
  const form = formEl.value;
  if (form) {
    const fill = (name: string, value: string | null) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
      if (el && value && !el.value) el.value = value;
    };
    if (!props.defaultZip) fill('addressOrZip', p.get('zip'));
    if (!props.defaultSize) fill('projectSize', p.get('size'));
    if (!props.defaultMaterial) fill('material', p.get('material'));
  }
}
</script>

<template>
  <div
    v-if="success"
    class="card border-green-600 bg-green-50 p-6"
    role="status"
    data-lead-success
    :data-lead-mode="mode"
  >
    <p class="font-mono text-xs font-bold uppercase tracking-widest text-green-700">Request received</p>
    <h3 class="mt-2 font-display text-xl uppercase tracking-tight text-ink">You’re on the list</h3>
    <p class="mt-2 text-sm text-charcoal-700">
      Thanks — we got your quote request<template v-if="operatorName && !isMatch">
        for <strong>{{ operatorName }}</strong></template
      ><template v-else> from local operators</template>. Watch for a confirmation email. Our team reviews
      requests and a verified operator will follow up by phone or email — usually the same day.
    </p>
  </div>
  <form
    v-else
    :id="formId"
    ref="formEl"
    method="POST"
    :action="actionUrl"
    class="card relative space-y-4 p-6"
    data-lead-form
    :data-lead-mode="mode"
    @input.once="onInput"
    @submit="onSubmit"
  >
    <div>
      <p class="eyebrow text-brand-600">{{ isMatch ? 'Local matches' : 'Get matched' }}</p>
      <h3 class="mt-1 font-display text-xl uppercase tracking-tight text-ink">{{ heading }}</h3>
      <p class="mt-1 text-sm text-muted">{{ sub }}</p>
      <p
        :class="['mt-2 font-mono text-[10px] uppercase tracking-widest text-muted', !enhanced && 'hidden']"
        data-step-label
      >
        {{ step === 1 ? 'Step 1 of 2 — Project' : 'Step 2 of 2 — Contact' }}
      </p>
    </div>
    <p
      v-if="error?.message"
      class="border-2 border-red-600 bg-red-50 px-3 py-2 text-sm font-medium text-red-800"
      role="alert"
    >
      {{ error.message }}
    </p>

    <input type="hidden" name="mode" :value="mode" />
    <input v-if="operatorId" type="hidden" name="operatorId" :value="operatorId" />
    <input v-if="sourceCityId" type="hidden" name="sourceCityId" :value="sourceCityId" />
    <input type="hidden" name="sourcePath" :value="hidden.sourcePath" />
    <input type="hidden" name="utmSource" :value="hidden.utmSource" />
    <input type="hidden" name="utmMedium" :value="hidden.utmMedium" />
    <input type="hidden" name="utmCampaign" :value="hidden.utmCampaign" />
    <input type="hidden" name="utmContent" :value="hidden.utmContent" />
    <input type="hidden" name="utmTerm" :value="hidden.utmTerm" />
    <input type="hidden" name="referrer" :value="hidden.referrer" />

    <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label :for="`${formId}-companyWebsite`">Company website</label>
      <input :id="`${formId}-companyWebsite`" name="companyWebsite" type="text" tabindex="-1" autocomplete="off" />
    </div>

    <div :class="['grid gap-4 sm:grid-cols-2', enhanced && step !== 1 && 'hidden']" data-step="1">
      <div>
        <label class="label" :for="`${formId}-projectSize`">Dumpster size</label>
        <select :id="`${formId}-projectSize`" class="input" name="projectSize">
          <option value="">Not sure</option>
          <option v-for="s in DUMPSTER_SIZES" :key="s" :value="`${s}`" :selected="size === String(s)">
            {{ s }} yard
          </option>
        </select>
      </div>
      <div>
        <label class="label" :for="`${formId}-material`">Material</label>
        <select :id="`${formId}-material`" class="input" name="material">
          <option value="">Select…</option>
          <option v-for="m in MATERIALS" :key="m.id" :value="m.id" :selected="material === m.id">
            {{ m.label }}
          </option>
        </select>
      </div>
      <div>
        <label class="label" :for="`${formId}-addressOrZip`">ZIP or address *</label>
        <input
          :id="`${formId}-addressOrZip`"
          ref="zipEl"
          class="input"
          name="addressOrZip"
          :value="val('addressOrZip', defaultZip)"
          required
          autocomplete="postal-code"
          placeholder="ZIP or street address"
        />
        <p v-if="errs.addressOrZip" class="mt-1 text-xs text-red-700">{{ errs.addressOrZip }}</p>
      </div>
      <div>
        <label class="label" :for="`${formId}-timeline`">Timeline</label>
        <input
          :id="`${formId}-timeline`"
          class="input"
          name="timeline"
          :value="val('timeline')"
          placeholder="e.g. this weekend, ASAP"
        />
      </div>
    </div>

    <div :class="['grid gap-4 sm:grid-cols-2', enhanced && step !== 2 && 'hidden']" data-step="2">
      <div class="sm:col-span-2">
        <label class="label" :for="`${formId}-seekerName`">Your name *</label>
        <input
          :id="`${formId}-seekerName`"
          class="input"
          name="seekerName"
          :value="val('seekerName')"
          required
          autocomplete="name"
        />
        <p v-if="errs.seekerName" class="mt-1 text-xs text-red-700">{{ errs.seekerName }}</p>
      </div>
      <div>
        <label class="label" :for="`${formId}-seekerEmail`">Email *</label>
        <input
          :id="`${formId}-seekerEmail`"
          class="input"
          name="seekerEmail"
          type="email"
          :value="val('seekerEmail')"
          required
          autocomplete="email"
        />
        <p v-if="errs.seekerEmail" class="mt-1 text-xs text-red-700">{{ errs.seekerEmail }}</p>
      </div>
      <div>
        <label class="label" :for="`${formId}-seekerPhone`">Phone *</label>
        <input
          :id="`${formId}-seekerPhone`"
          class="input"
          name="seekerPhone"
          type="tel"
          :value="val('seekerPhone')"
          required
          autocomplete="tel"
        />
        <p v-if="errs.seekerPhone" class="mt-1 text-xs text-red-700">{{ errs.seekerPhone }}</p>
      </div>
      <div>
        <label class="label" :for="`${formId}-preferredContact`">Preferred contact</label>
        <select :id="`${formId}-preferredContact`" class="input" name="preferredContact">
          <option v-for="ct in PREFERRED_CONTACTS" :key="ct.id" :value="ct.id" :selected="ct.id === contact">
            {{ ct.label }}
          </option>
        </select>
      </div>
      <div>
        <label class="label" :for="`${formId}-budgetRange`">Budget (optional)</label>
        <select :id="`${formId}-budgetRange`" class="input" name="budgetRange">
          <option value="">Select…</option>
          <option v-for="b in BUDGET_RANGES" :key="b.id" :value="b.id" :selected="b.id === budget">
            {{ b.label }}
          </option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label class="label" :for="`${formId}-howFound`">How did you find us?</label>
        <select :id="`${formId}-howFound`" class="input" name="howFound">
          <option value="">Select…</option>
          <option v-for="h in HOW_FOUND_OPTIONS" :key="h.id" :value="h.id" :selected="h.id === howFound">
            {{ h.label }}
          </option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label class="label" :for="`${formId}-notes`">Project notes</label>
        <textarea
          :id="`${formId}-notes`"
          class="input min-h-[88px]"
          name="notes"
          rows="3"
          :value="val('notes')"
        ></textarea>
      </div>
      <div v-if="turnstileKey" class="sm:col-span-2">
        <!-- Filled by the Turnstile script (page head); Vue renders no children here. -->
        <div class="cf-turnstile" :data-sitekey="turnstileKey" data-action="quote"></div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button type="button" :class="['btn-ghost', !(enhanced && step === 2) && 'hidden']" data-step-back @click="step = 1">
        Back
      </button>
      <button
        type="button"
        :class="['btn-primary w-full sm:w-auto', !(enhanced && step === 1) && 'hidden']"
        data-step-next
        @click="next"
      >
        Continue
      </button>
      <button
        type="submit"
        :class="['btn-primary w-full sm:w-auto', enhanced && step !== 2 && 'hidden']"
        data-step-submit
      >
        {{ submitLabel }}
      </button>
    </div>
    <p class="text-xs text-muted">
      By submitting, you agree we may share these details with verified local operators for quoting. We’ll
      email a confirmation next.
    </p>
  </form>
</template>
