<script setup lang="ts">
defineProps<{
  guide: {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string | null;
    imageAlt: string | null;
    imageCredit: string | null;
    imageCreditUrl: string | null;
  };
  /** Rendered from our own Markdown in src/content/guides (raw HTML in it is escaped). */
  html: string;
}>();
</script>

<template>
  <article class="container-page py-12">
    <nav aria-label="Breadcrumb" class="font-mono text-xs uppercase tracking-widest text-muted">
      <a href="/" class="text-muted no-underline hover:text-brand-600">Home</a>
      <span class="mx-2 text-charcoal-300">/</span>
      <a href="/guides" class="text-muted no-underline hover:text-brand-600">Guides</a>
      <span class="mx-2 text-charcoal-300">/</span>
      <span class="text-brand-600">{{ guide.title }}</span>
    </nav>
    <p class="eyebrow mt-8 text-brand-600">{{ guide.category }}</p>
    <h1 class="mt-3 max-w-3xl font-display text-3xl uppercase leading-tight tracking-tight text-ink sm:text-5xl">
      {{ guide.title }}
    </h1>
    <p class="mt-4 max-w-2xl text-lg text-muted">{{ guide.description }}</p>
    <figure v-if="guide.image" class="mt-8 max-w-3xl overflow-hidden border-2 border-charcoal-900 bg-charcoal-900">
      <img
        :src="guide.image"
        :alt="guide.imageAlt ?? guide.title"
        width="1064"
        height="1600"
        class="h-auto max-h-[22rem] w-full object-cover object-center sm:max-h-[28rem]"
        loading="eager"
        decoding="async"
      />
      <figcaption
        v-if="guide.imageCredit"
        class="border-t-2 border-charcoal-700 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-charcoal-300"
      >
        <a
          v-if="guide.imageCreditUrl"
          :href="guide.imageCreditUrl"
          class="text-charcoal-200 no-underline hover:text-brand-400"
          rel="noopener noreferrer"
          target="_blank"
          >{{ guide.imageCredit }}</a
        >
        <template v-else>{{ guide.imageCredit }}</template>
      </figcaption>
    </figure>
    <div class="hazard-bar mt-8 max-w-3xl" aria-hidden="true"></div>
    <div class="prose-guide mt-10" v-html="html"></div>
    <div class="mt-12 max-w-3xl border-2 border-charcoal-900 bg-charcoal-900 p-6 text-white shadow-[4px_4px_0_0_#ff4d00]">
      <p class="font-display text-xl uppercase tracking-tight">Ready to find a local operator?</p>
      <p class="mt-2 text-sm text-charcoal-200">
        Search verified dumpster rentals by city or ZIP — transparent ranges, no broker noise.
      </p>
      <a href="/search" class="btn-primary mt-5 inline-flex">Search operators</a>
    </div>
  </article>
</template>
