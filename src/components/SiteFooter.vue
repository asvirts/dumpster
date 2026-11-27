<script setup lang="ts">
import { BRAND, DUMPSTER_SIZES } from '../lib/constants';

// Static links: the footer also renders inside prerendered pages.
const popularCities = [
  { name: 'Houston, TX', href: '/dumpster-rental/tx/houston' },
  { name: 'Dallas, TX', href: '/dumpster-rental/tx/dallas' },
  { name: 'Austin, TX', href: '/dumpster-rental/tx/austin' },
  { name: 'Miami, FL', href: '/dumpster-rental/fl/miami' },
  { name: 'Orlando, FL', href: '/dumpster-rental/fl/orlando' },
  { name: 'Tampa, FL', href: '/dumpster-rental/fl/tampa' },
  { name: 'Los Angeles, CA', href: '/dumpster-rental/ca/los-angeles' },
  { name: 'Phoenix, AZ', href: '/dumpster-rental/az/phoenix' },
  { name: 'Atlanta, GA', href: '/dumpster-rental/ga/atlanta' },
  { name: 'Denver, CO', href: '/dumpster-rental/co/denver' },
];

const guides = [
  { name: 'Dumpster size guide', href: '/guides/dumpster-size-guide' },
  { name: 'Dumpster rental cost factors', href: '/guides/dumpster-rental-cost-factors' },
  { name: 'What can go in a dumpster', href: '/guides/what-can-go-in-a-dumpster' },
  { name: 'Residential vs. commercial', href: '/guides/residential-vs-commercial' },
  { name: 'Permit overview', href: '/guides/dumpster-permits-overview' },
];
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-16 bg-charcoal-900 text-charcoal-200">
    <div class="hazard-bar" aria-hidden="true"></div>
    <div class="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <a href="/" class="flex items-center gap-2.5 text-white no-underline hover:text-white">
          <img
            src="/logo-mark.svg"
            alt=""
            width="36"
            height="36"
            class="h-9 w-9 shrink-0 shadow-[2px_2px_0_0_#ffc800]"
            aria-hidden="true"
          />
          <span class="font-display text-lg uppercase tracking-tight">{{ BRAND.name }}</span>
        </a>
        <p class="mt-4 text-sm leading-relaxed text-charcoal-300">{{ BRAND.tagline }}.</p>
        <p class="mt-4 font-mono text-xs uppercase tracking-widest text-charcoal-400">
          Verified operators · No broker noise
        </p>
      </div>
      <nav aria-label="Popular cities">
        <p class="eyebrow text-brand-400">Popular cities</p>
        <ul class="mt-4 grid grid-cols-1 gap-2 text-sm">
          <li v-for="c in popularCities" :key="c.href">
            <a :href="c.href" class="text-charcoal-300 no-underline hover:text-brand-400">
              Dumpster rental {{ c.name }}
            </a>
          </li>
        </ul>
      </nav>
      <nav aria-label="Dumpster sizes">
        <p class="eyebrow text-brand-400">Sizes</p>
        <ul class="mt-4 space-y-2 text-sm">
          <li v-for="s in DUMPSTER_SIZES" :key="s">
            <a :href="`/search?size=${s}`" class="text-charcoal-300 no-underline hover:text-brand-400">
              {{ s }} yard dumpster rental
            </a>
          </li>
        </ul>
      </nav>
      <nav aria-label="Guides">
        <p class="eyebrow text-brand-400">Guides</p>
        <ul class="mt-4 space-y-2 text-sm">
          <li v-for="g in guides" :key="g.href">
            <a :href="g.href" class="text-charcoal-300 no-underline hover:text-brand-400">
              {{ g.name }}
            </a>
          </li>
          <li>
            <a href="/guides" class="font-semibold text-white no-underline hover:text-brand-400">
              All guides →
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <div class="border-t border-charcoal-700 py-5">
      <p class="container-page text-center font-mono text-xs text-charcoal-400">
        © {{ year }} {{ BRAND.name }} · Verified local dumpster rentals with transparent pricing and real
        operators.
      </p>
    </div>
  </footer>
</template>
