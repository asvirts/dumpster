// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://dumpsterlocal.com',
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    // Disable session KV provisioning until needed
    // session storage not required for MVP
  }),
  session: false,
  vite: {
    plugins: [tailwindcss()],
    // Mitigate Cloudflare/workerd SSR dep optimizer race in astro dev
    // (cascading "optimized dependencies changed" → missing deps_ssr chunks)
    optimizeDeps: {
      holdUntilCrawlEnd: true,
      include: [
        'astro',
        'astro/assets/services/noop',
        'drizzle-orm',
        'drizzle-orm/d1',
        'nanoid',
        'maplibre-gl',
      ],
    },
    ssr: {
      noExternal: ['drizzle-orm'],
      optimizeDeps: {
        include: [
          'astro/assets/services/noop',
          'drizzle-orm',
          'drizzle-orm/d1',
          'nanoid',
        ],
      },
    },
  },
});
