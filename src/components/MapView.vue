<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

// Island (hydrate on `visible`). MapLibre is client-only: it is imported in onMounted so the
// server render never loads it. The server HTML is the "Loading map…" placeholder.
const props = withDefaults(
  defineProps<{
    markers: { id: string; name: string; slug: string; lat: number; lng: number }[];
    centerLat?: number | null;
    centerLng?: number | null;
    zoom?: number;
    heightClass?: string;
  }>(),
  { centerLat: null, centerLng: null, zoom: 10, heightClass: 'h-72 md:h-full md:min-h-[28rem]' },
);

const center = computed(() => ({
  lat: props.centerLat ?? props.markers[0]?.lat ?? 39.8283,
  lng: props.centerLng ?? props.markers[0]?.lng ?? -98.5795,
}));

const el = ref<HTMLElement | null>(null);
const ready = ref(false);
let map: { remove(): void } | null = null;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

onMounted(async () => {
  const container = el.value;
  if (!container) return;
  const [{ Map, Marker, Popup, NavigationControl, LngLatBounds, setWorkerUrl }, { default: workerUrl }] =
    await Promise.all([
      import('maplibre-gl'),
      // MapLibre 6 looks for its worker next to its own module URL, which Vite doesn't emit.
      import('maplibre-gl/dist/maplibre-gl-worker.mjs?url'),
      import('maplibre-gl/dist/maplibre-gl.css'),
    ]);
  setWorkerUrl(workerUrl);
  ready.value = true;
  const m = new Map({
    container,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [center.value.lng, center.value.lat],
    zoom: props.markers.length ? props.zoom : 3.5,
  });
  map = m;
  m.addControl(new NavigationControl({ showCompass: false }), 'top-right');

  const bounds = new LngLatBounds();
  for (const mk of props.markers) {
    const popup = new Popup({ offset: 16 }).setHTML(
      `<strong>${escapeHtml(mk.name)}</strong><br/><a href="/operator/${encodeURIComponent(mk.slug)}">View profile</a>`,
    );
    new Marker({ color: '#ff4d00' }).setLngLat([mk.lng, mk.lat]).setPopup(popup).addTo(m);
    bounds.extend([mk.lng, mk.lat]);
  }
  if (props.markers.length > 1) {
    m.fitBounds(bounds, { padding: 48, maxZoom: 12 });
  }
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<template>
  <div
    :class="['map-view card relative overflow-hidden', heightClass]"
    data-map
    :data-center-lat="center.lat"
    :data-center-lng="center.lng"
    :data-zoom="zoom"
  >
    <!-- MapLibre owns this node's children; Vue never renders into it. Its CSS sets
         .maplibregl-map { position: relative }, so size it with h-full, not absolute. -->
    <div ref="el" class="h-full w-full"></div>
    <div
      v-if="!ready"
      class="absolute inset-0 flex items-center justify-center bg-charcoal-100 font-mono text-xs uppercase tracking-widest text-muted"
      data-map-fallback
    >
      Loading map…
    </div>
  </div>
</template>
