<script lang="ts">
export const layout = '!portal';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useShared } from '@void/vue';

defineProps<{
  orgs: { id: string; name: string }[];
  currentOrgId: string | null;
  returnTo: string;
}>();

const shared = useShared();
const error = computed(() =>
  shared?.feedback?.form === 'select-org' && !shared.feedback.ok ? shared.feedback.message : null,
);
</script>

<template>
  <p class="mb-6 text-sm text-muted">
    Operator accounts belong to a company. Choose one of yours or create it to continue.
  </p>
  <p v-if="error" class="mb-6 border-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800">{{ error }}</p>
  <div class="grid gap-8 lg:grid-cols-2">
    <div class="card p-5">
      <h2 class="mb-4 font-bold text-ink">Your companies</h2>
      <p v-if="orgs.length === 0" class="text-sm text-muted">You don’t belong to a company yet.</p>
      <ul v-else class="space-y-2">
        <li v-for="org in orgs" :key="org.id">
          <form method="POST" action="?select" class="flex items-center justify-between gap-3">
            <input type="hidden" name="organizationId" :value="org.id" />
            <input type="hidden" name="returnTo" :value="returnTo" />
            <span class="text-sm font-medium text-ink">
              {{ org.name }}
              <span v-if="org.id === currentOrgId" class="ml-2 text-xs text-muted">(current)</span>
            </span>
            <button type="submit" class="btn-secondary px-3 py-1.5 text-xs">Use</button>
          </form>
        </li>
      </ul>
    </div>
    <div class="card p-5">
      <h2 class="mb-4 font-bold text-ink">Create company</h2>
      <form method="POST" action="?create" class="space-y-3">
        <input type="hidden" name="returnTo" :value="returnTo" />
        <div>
          <label class="label" for="org-name">Company name</label>
          <input class="input" id="org-name" name="name" required minlength="2" maxlength="120" />
        </div>
        <button type="submit" class="btn-primary text-xs">Create and continue</button>
      </form>
    </div>
  </div>
</template>
