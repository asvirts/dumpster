/**
 * Cloudflare workerd + nodejs_compat makes Astro's isNode check true, so it
 * streams AsyncIterable response bodies. workerd stringifies those as
 * "[object Object]". Force the web ReadableStream render path instead.
 *
 * Remove when Astro ships a durable fix for this combo.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const target = join(
  process.cwd(),
  'node_modules/astro/dist/runtime/server/render/page.js',
);
if (!existsSync(target)) {
  console.warn('[patch-astro-workerd] astro page.js not found; skip');
  process.exit(0);
}

const src = readFileSync(target, 'utf8');
if (src.includes('Always use web ReadableStream')) {
  console.log('[patch-astro-workerd] already applied');
  process.exit(0);
}

const needle = `  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }`;

const replacement = `  let body;
  if (streaming) {
    // Always use web ReadableStream. Node AsyncIterable bodies break on
    // Cloudflare workerd (nodejs_compat process makes isNode true, then
    // Response body stringifies as the literal "[object Object]").
    body = await renderToReadableStream(result, componentFactory, props, children, true, route);
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }`;

if (!src.includes(needle)) {
  console.error(
    '[patch-astro-workerd] expected code not found; Astro version may have changed',
  );
  process.exit(1);
}

writeFileSync(target, src.replace(needle, replacement));
console.log('[patch-astro-workerd] applied ReadableStream fix to astro page.js');
