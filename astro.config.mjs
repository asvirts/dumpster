// @ts-check
import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

/**
 * `@workos/authkit-astro`'s root entry imports `envField` from 'astro/config' for
 * its `astro add` integration helper. This site wires AuthKit by hand (see
 * src/middleware.ts) and never calls that helper, but Workers bundles every
 * import, and astro/config would drag Astro's build-time config code (and its
 * markdown/wasm deps) into the Worker. Give the package a stub instead.
 */
function authkitAstroConfigStub() {
  const STUB = '\0authkit-astro-config-stub';
  return {
    name: 'authkit-astro-config-stub',
    enforce: /** @type {const} */ ('pre'),
    /** @param {string} id @param {string | undefined} importer */
    resolveId(id, importer) {
      if (id === 'astro/config' && importer && /[\\/]@workos[\\/]authkit-astro[\\/]/.test(importer)) {
        return STUB;
      }
    },
    /** @param {string} id */
    load(id) {
      if (id === STUB) return 'export const envField = new Proxy({}, { get: () => () => ({}) });';
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://findadumpster.net',
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [react()],
  session: false,
  // WorkOS AuthKit secrets: wrangler secrets in production, .dev.vars locally.
  // Optional so the public site and webhooks keep working without them
  // (sign-in routes answer 503; see src/lib/workos.ts).
  env: {
    schema: {
      WORKOS_CLIENT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      WORKOS_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      WORKOS_REDIRECT_URI: envField.string({ context: 'server', access: 'secret', optional: true }),
      WORKOS_COOKIE_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss(), authkitAstroConfigStub()],
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
        'stripe',
      ],
    },
    ssr: {
      noExternal: ['drizzle-orm', 'stripe'],
      optimizeDeps: {
        include: [
          'astro/assets/services/noop',
          'drizzle-orm',
          'drizzle-orm/d1',
          'nanoid',
          '@workos-inc/node',
          '@workos/authkit-session',
          'nanostores',
          'path-to-regexp',
        ],
        // Not pre-bundled, so authkitAstroConfigStub() above applies in dev too.
        exclude: ['@workos/authkit-astro'],
      },
    },
  },
});
