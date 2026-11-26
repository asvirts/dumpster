<script setup lang="ts">
import { BRAND, DUMPSTER_SIZES, SIZE_GUIDE } from '../src/lib/constants';
import { faqs } from '../src/lib/home-faqs';
import SearchForm from '../src/components/SearchForm.vue';

defineProps<{ cities: { name: string; state: string; slug: string; stateSlug: string }[] }>();
</script>

<template>
  <!-- Hero -->
  <section class="relative overflow-hidden bg-charcoal-900 text-white">
    <div class="container-page py-16 sm:py-24">
      <div class="mx-auto max-w-3xl text-center">
        <p class="eyebrow text-brand-400">Verified local operators — no broker noise</p>
        <h1 class="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-tight sm:text-6xl">
          Find verified <span class="text-brand-500">dumpster rentals</span> near you
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-lg text-charcoal-200">
          {{ BRAND.tagline }}. Compare sizes, materials, driveway-safe options, and local permit notes
          before you book.
        </p>
        <div class="mx-auto mt-8 max-w-xl border-2 border-charcoal-600 bg-charcoal-800 p-3 shadow-[6px_6px_0_0_#ff4d00]">
          <SearchForm />
        </div>
        <p class="mt-4 font-mono text-xs uppercase tracking-widest text-charcoal-400">
          City, state, or ZIP — brokers hidden by default
        </p>
      </div>
    </div>
    <div class="hazard-bar" aria-hidden="true"></div>
  </section>

  <!-- Trust strip -->
  <section class="border-b-2 border-charcoal-900 bg-brand-500">
    <div class="container-page grid grid-cols-1 divide-y-2 divide-charcoal-900/20 py-6 text-center sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
      <div class="py-3 sm:py-0">
        <p class="font-display text-3xl text-white">{{ cities.length }}</p>
        <p class="mt-1 font-mono text-xs font-semibold uppercase tracking-widest text-charcoal-900">
          Priority metros
        </p>
      </div>
      <div class="py-3 sm:py-0">
        <p class="font-display text-3xl text-white">100%</p>
        <p class="mt-1 font-mono text-xs font-semibold uppercase tracking-widest text-charcoal-900">
          Verified listings by default
        </p>
      </div>
      <div class="py-3 sm:py-0">
        <p class="font-display text-3xl text-white">$0</p>
        <p class="mt-1 font-mono text-xs font-semibold uppercase tracking-widest text-charcoal-900">
          Broker markup — book direct
        </p>
      </div>
    </div>
  </section>

  <!-- How it works -->
  <section class="container-page py-16">
    <p class="eyebrow text-brand-600">How it works</p>
    <h2 class="mt-2 font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">
      Three steps to a container on site
    </h2>
    <div class="mt-10 grid gap-6 sm:grid-cols-3">
      <div class="card p-6">
        <p class="font-display text-5xl text-brand-500">01</p>
        <h3 class="mt-4 text-lg font-bold text-ink">Search your city or ZIP</h3>
        <p class="mt-2 text-sm text-muted">
          We match you with operators who actually serve your area — with local pricing bands and permit
          notes up front.
        </p>
      </div>
      <div class="card p-6">
        <p class="font-display text-5xl text-brand-500">02</p>
        <h3 class="mt-4 text-lg font-bold text-ink">Compare verified operators</h3>
        <p class="mt-2 text-sm text-muted">
          Filter by size, material, driveway-safe, and same-day. Every listing shows a last-verified date.
        </p>
      </div>
      <div class="card p-6">
        <p class="font-display text-5xl text-brand-500">03</p>
        <h3 class="mt-4 text-lg font-bold text-ink">Book direct</h3>
        <p class="mt-2 text-sm text-muted">
          Call or request a quote straight from the operator. No middleman, no markup, no surprises on
          tonnage.
        </p>
      </div>
    </div>
  </section>

  <!-- Sizes -->
  <section class="border-y-2 border-charcoal-900 bg-charcoal-900 py-16 text-white">
    <div class="container-page">
      <p class="eyebrow text-brand-400">Roll-off sizes</p>
      <h2 class="mt-2 font-display text-3xl uppercase tracking-tight sm:text-4xl">
        Pick your container
      </h2>
      <p class="mt-3 max-w-2xl text-charcoal-300">
        From garage cleanouts to new construction — match the project to the yardage before you overpay
        for air.
      </p>
      <ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <li v-for="s in DUMPSTER_SIZES" :key="s">
              <a
                :href="`/search?size=${s}`"
                class="group block border-2 border-charcoal-600 bg-charcoal-800 p-5 text-white no-underline transition hover:border-brand-500 hover:bg-charcoal-700"
              >
                <p class="font-display text-5xl text-brand-500 transition group-hover:text-brand-400">
                  {{ s }}
                </p>
                <p class="mt-1 font-mono text-xs font-semibold uppercase tracking-widest text-charcoal-300">
                  Yard
                </p>
                <p class="mt-3 text-sm text-charcoal-200">{{ SIZE_GUIDE[s] }}</p>
                <p class="mt-4 font-mono text-xs font-semibold uppercase tracking-widest text-brand-400">
                  Find {{ s }}-yard near you →
                </p>
              </a>
            </li>
      </ul>
    </div>
  </section>

  <!-- Priority cities -->
  <section class="container-page py-16">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="eyebrow text-brand-600">Service areas</p>
        <h2 class="mt-2 font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">
          Dumpster rentals by city
        </h2>
        <p class="mt-2 text-muted">
          Deep local coverage first — pricing bands, permit notes, and placement tips for every metro.
        </p>
      </div>
      <a href="/search" class="btn-secondary">Browse all</a>
    </div>
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <li v-for="c in cities" :key="c.slug + c.stateSlug">
            <a
              :href="`/dumpster-rental/${c.stateSlug}/${c.slug}`"
              class="card block p-4 text-ink no-underline"
            >
              <span class="block border-l-4 border-brand-500 pl-3">
                <span class="block font-bold">{{ c.name }}</span>
                <span class="mt-0.5 block font-mono text-xs uppercase tracking-widest text-muted">
                  {{ c.state }}
                </span>
              </span>
              <span class="mt-3 block font-mono text-xs font-semibold uppercase tracking-widest text-brand-600">
                View operators →
              </span>
            </a>
          </li>
    </ul>
  </section>

  <!-- Guides -->
  <section class="border-y-2 border-charcoal-900 bg-charcoal-100 py-16">
    <div class="container-page">
      <p class="eyebrow text-brand-600">Read first, book smart</p>
      <h2 class="mt-2 font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">
        Dumpster rental guides
      </h2>
      <div class="mt-8 grid gap-4 sm:grid-cols-3">
        <a href="/guides/dumpster-size-guide" class="card block p-6 text-ink no-underline">
          <p class="eyebrow text-muted">Basics</p>
          <h3 class="mt-2 text-lg font-bold">Dumpster size guide</h3>
          <p class="mt-2 text-sm text-muted">Match project scope to 10–40 yard containers.</p>
        </a>
        <a href="/guides/what-can-go-in-a-dumpster" class="card block p-6 text-ink no-underline">
          <p class="eyebrow text-muted">Basics</p>
          <h3 class="mt-2 text-lg font-bold">What can go in a dumpster</h3>
          <p class="mt-2 text-sm text-muted">Allowed materials and common prohibited items.</p>
        </a>
        <a href="/guides/dumpster-permits-overview" class="card block p-6 text-ink no-underline">
          <p class="eyebrow text-muted">Local</p>
          <h3 class="mt-2 text-lg font-bold">Permit overview</h3>
          <p class="mt-2 text-sm text-muted">When you need a permit for street placement.</p>
        </a>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="container-page py-16">
    <div class="max-w-3xl">
      <p class="eyebrow text-brand-600">FAQ</p>
      <h2 class="mt-2 font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">
        Dumpster rental questions, answered
      </h2>
      <div class="mt-8 divide-y-2 divide-charcoal-900 border-2 border-charcoal-900 bg-white shadow-[4px_4px_0_0_#121417]">
            <details v-for="f in faqs" :key="f.question" class="group">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold text-ink transition hover:bg-brand-50 [&::-webkit-details-marker]:hidden">
                {{ f.question }}
                <span
                  class="shrink-0 font-mono text-xl font-bold text-brand-500 transition group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p class="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-charcoal-700">
                {{ f.answer }}
              </p>
            </details>
      </div>
    </div>
  </section>
</template>
