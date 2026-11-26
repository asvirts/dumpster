<script setup lang="ts">
// Named layout "portal" (pages select it with `layout = '!portal'`): the chrome of the Astro
// PortalLayout, replacing the public site header and footer.
import '../../../src/styles/global.css';
import { computed } from 'vue';
import { Link, useShared } from '@void/vue';
import { BRAND } from '../../../src/lib/constants';
import { PORTAL_NAV, portalTitle } from '../../../src/lib/portal-nav';

// Portal shared data (see src/server/portal-guard.ts PortalShared).
const shared = useShared<{
  path: string;
  userEmail?: string | null;
  orgName?: string | null;
  hasOrg?: boolean;
}>();

const path = computed(() => shared?.path ?? '/portal');
const title = computed(() => portalTitle(path.value));
const hasOrg = computed(() => Boolean(shared?.hasOrg));
const active = (href: string) => path.value === href || (href !== '/portal' && path.value.startsWith(href));
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="hidden w-56 shrink-0 border-r border-border bg-white p-4 md:block">
      <Link href="/portal" class="flex items-center gap-2 text-lg font-bold text-ink no-underline">
        <img src="/logo-mark.svg" alt="" width="28" height="28" class="h-7 w-7" aria-hidden="true" />
        {{ BRAND.name }}
      </Link>
      <p class="mt-0.5 text-xs text-muted">Operator portal</p>
      <nav class="mt-8 space-y-1" aria-label="Portal">
        <Link
          v-for="n in PORTAL_NAV"
          :key="n.href"
          :href="n.href"
          :class="[
            'block rounded-lg px-3 py-2 text-sm font-medium no-underline',
            active(n.href) ? 'bg-brand-50 text-brand-800' : 'text-slate-600 hover:bg-surface',
          ]"
        >
          {{ n.label }}
        </Link>
      </nav>
      <a href="/" class="mt-8 block text-xs text-muted no-underline hover:text-brand-700">← Public site</a>
    </aside>
    <div class="flex-1">
      <header class="border-b border-border bg-white px-4 py-3 md:px-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h1 class="text-lg font-bold text-ink">{{ title }}</h1>
          <div class="flex items-center gap-3">
            <Link
              v-if="hasOrg"
              href="/portal/select-org"
              class="text-sm font-medium text-slate-700 no-underline hover:text-brand-700"
              title="Switch company"
            >
              {{ shared?.orgName ?? 'Company' }} <span aria-hidden="true">▾</span>
            </Link>
            <form v-if="shared?.userEmail" method="POST" action="/auth/logout" class="flex items-center gap-3">
              <span class="hidden max-w-56 truncate text-xs text-muted sm:inline">
                {{ shared.userEmail }}
              </span>
              <button type="submit" class="btn-secondary px-3 py-1.5 text-xs">Sign out</button>
            </form>
          </div>
        </div>
        <nav class="mt-3 flex gap-2 overflow-x-auto md:hidden" aria-label="Portal mobile">
          <Link v-for="n in PORTAL_NAV" :key="n.href" :href="n.href" class="btn-secondary shrink-0 px-3 py-1.5 text-xs">
            {{ n.label }}
          </Link>
        </nav>
      </header>
      <div class="p-4 md:p-8">
        <slot />
      </div>
    </div>
  </div>
</template>
