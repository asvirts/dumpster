<script setup lang="ts">
import { computed } from 'vue';
import { BRAND } from '../lib/constants';
import { loginPath } from '../lib/auth-paths';

// The mobile toggle is wired by a site-wide inline script in void.config.ts (no hydration).
const props = defineProps<{ path: string; search?: string; userEmail?: string | null }>();

const links = [
  { href: '/search', label: 'Search' },
  { href: '/guides', label: 'Guides' },
  { href: '/portal', label: 'Portal' },
];
const signIn = computed(() => loginPath(props.path + (props.search ?? '')));
const active = (href: string) => props.path.startsWith(href);
</script>

<template>
  <header class="sticky top-0 z-40 bg-charcoal-900 text-white">
    <div class="hazard-bar" aria-hidden="true"></div>
    <div class="container-page flex h-16 items-center justify-between gap-4">
      <a href="/" class="flex items-center gap-2.5 text-white no-underline hover:text-white">
        <img
          src="/logo-mark.svg"
          alt=""
          width="36"
          height="36"
          class="h-9 w-9 shrink-0 shadow-[2px_2px_0_0_#ffc800]"
          aria-hidden="true"
        />
        <span class="font-display text-base uppercase tracking-tight sm:text-lg">{{ BRAND.name }}</span>
      </a>
      <nav class="hidden items-center gap-1 sm:flex" aria-label="Main">
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          :class="[
            'px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest no-underline',
            active(l.href)
              ? 'text-brand-400 underline decoration-2 underline-offset-8'
              : 'text-charcoal-200 hover:text-brand-400',
          ]"
        >
          {{ l.label }}
        </a>
        <div class="ml-3 flex items-center gap-2">
          <form v-if="userEmail" method="POST" action="/auth/logout" class="flex items-center gap-2">
            <span class="hidden max-w-48 truncate font-mono text-xs text-charcoal-300 lg:inline">
              {{ userEmail }}
            </span>
            <button
              type="submit"
              class="px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-charcoal-200 hover:text-brand-400"
            >
              Sign out
            </button>
          </form>
          <a
            v-else
            :href="signIn"
            class="px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-charcoal-200 no-underline hover:text-brand-400"
          >
            Sign in
          </a>
          <a href="/search" class="btn-primary px-4 py-2 text-xs">Find dumpsters</a>
        </div>
      </nav>
      <button
        type="button"
        id="nav-toggle"
        class="flex h-10 w-10 items-center justify-center border-2 border-charcoal-600 text-white sm:hidden"
        aria-expanded="false"
        aria-controls="mobile-nav"
        aria-label="Toggle menu"
      >
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div id="mobile-nav" class="hidden border-t-2 border-charcoal-700 sm:hidden">
      <nav class="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          :class="[
            'px-2 py-2.5 font-mono text-sm font-semibold uppercase tracking-widest no-underline',
            active(l.href) ? 'text-brand-400' : 'text-charcoal-200 hover:text-brand-400',
          ]"
        >
          {{ l.label }}
        </a>
        <a href="/search" class="btn-primary mt-2">Find dumpsters</a>
      </nav>
    </div>
  </header>
</template>
