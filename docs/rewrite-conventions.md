# Rewrite conventions (Astro → Void + Vue)

Working notes for porting pages on branch `rewrite/void-vue`. Read [rewrite-plan.md](rewrite-plan.md) first. The Astro app is the reference: read any old file with `git show main:<path>` (for example `git show main:src/pages/search.astro`).

## Ground rules

- Same URLs, status codes, response headers, `<title>`, meta, canonical, JSON-LD and visible text as the Astro page. The only intended differences: `/x/` 301s to `/x`, Void adds `x-powered-by: Void`, and the Astro `generator` meta is gone.
- Port `src/lib` code as-is. Change it only where an Astro type or API leaks in, and keep such changes minimal.
- Do not edit `void.config.ts`, `vite.config.ts`, `package.json`, `tsconfig.json`, `pages/layout.vue` or `src/server/shared.ts` without the lead's say-so; list needed changes in your report instead.
- Never commit, never touch `.env` or `.wrangler/`, never print secret values.

## Layout of the repo

| Path | What |
|---|---|
| `pages/` | Void pages. `x.vue` or `x.island.vue` plus an `x.server.ts` companion. |
| `pages/layout.vue` | Root layout: `SiteHeader`, `<main class="flex-1">`, `SiteFooter`, imports `src/styles/global.css`. |
| `routes/` | Server routes (`GET`/`POST = defineHandler(...)`): webhooks, sitemap, robots, auth callbacks. |
| `crons/` | `defineScheduled` jobs. |
| `src/lib/` | Business logic (ported from Astro). Server-only unless noted. |
| `src/components/` | Vue components. |
| `src/server/` | Request-layer helpers: shared data, guards, action handlers. |
| `src/content/guides/` | Guide markdown. |

Void docs: `node_modules/void/docs` (guide/, reference/). Each doc has React/Solid/Svelte/Vue tabs; read the Vue ones.

## Pages

```ts
// pages/thing.server.ts
import { defineHandler, defineHead, type InferProps } from 'void';
import { seoHead } from '../src/lib/head';
import { withShared } from '../src/server/shared';

export const revalidate = 300; // public pages only; literal number

export const loader = defineHandler(withShared, async (c) => {
  // c.req.url, c.req.query('q'), c.req.param('slug'), c.env.DB, getDb()
  // return c.notFound()  → renders pages/_not-found.vue with a 404
  return { ... };
});
export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>((c, props) =>
  seoHead({ path: new URL(c.req.url).pathname, title: ..., description: ..., jsonLd: [...] }),
);
```

- `withShared` must be the first argument of every page loader: it seeds `path`/`search` for the header.
- `seoHead()` (`src/lib/head.ts`) reproduces the Astro `BaseLayout` head. Set the canonical only through it. Where Astro used `Astro.site`, use `SITE_ORIGIN`.
- Component props: `defineProps<{ ... }>()` with an **inline** type literal. Importing the `Props` type into `defineProps` breaks under TypeScript 7 (Void #932).
- Public pages are `*.island.vue`: rendered on the server, zero JS except islands imported as `import X from '../src/components/X.vue' with { island: 'load' | 'visible' }`. Inside island pages use plain `<a>`, not `Link`. Island props must be JSON-serializable.
- Vue components in `src/components` end up in the browser bundle when used as islands or on hydrated pages: never import `cloudflare:workers`, `src/lib/db`, `src/lib/auth` (use `src/lib/auth-paths`), WorkOS, Stripe or Resend from them. Read env server-side in the loader and pass values as props (for example the Turnstile site key).
- Response headers the Astro page set (`Astro.response.headers.set`) → `c.header(name, value)` in the loader. Status → `c.status(n)`.
- Portal and admin pages are regular `x.vue` pages (hydrated, Void router, `Link` allowed) and are never cached.

## Forms

Public forms must work without JS:

- Hand-written `<form method="post" action="?actionName">`; the page's server file exports `actions = { actionName: defineHandler(withShared, async (c) => { ... }) }`. Read the body with `await c.req.parseBody()` (urlencoded) and validate with the zod schemas from `src/lib`.
- On an island page, an action that returns nothing gets a JSON reply (`{"success":true}` or a 422), meant for `useIslandForm`'s fetch, so a native POST would land on JSON. Use post/redirect/get from `src/server/flash.ts`: call `setFeedback(c, { form, ok, message, fieldErrors, values })`, then `return redirectWithFeedback(c, 'hash')`. That stores the feedback in a 120 s HttpOnly cookie and 303s back to the page. The loader reads it with `readFeedback(c, form)` and passes it to the form as a prop. Add new action names to `ACTION_KEYS`.
- Or redirect (`return c.redirect(url, 303)`) where the Astro page did.
- On a missing record, `return notFound(c)` from `src/server/not-found.ts` (not `c.notFound()`), so the 404 gets the Astro 404 head.
- An island may enhance the form (multi-step, analytics) but the native POST must keep working.

Portal and admin forms may require JS (Void `<Form>`, `useForm`, actions).

## Auth

- Cookies: `src/lib/auth.ts` takes a `CookieJar`; build one with `cookieJar(c)` from `src/lib/cookies.ts`.
- Public pages are anonymous: never read the session there (it would break caching).
- Guards are per-route middleware passed first to `defineHandler(guard, loader)`. There is no global middleware (Void #808).

## Local testing

- A Void dev server is already running at **http://localhost:8788** with hot reload. Do not start, stop or restart dev servers or kill processes. Port 4321 is a stale Astro process; ignore it.
- Local D1 has seed data (70 cities). Query it read-only with `pnpm exec wrangler d1 execute dumpsterlocal --local --config wrangler.d1.jsonc --persist-to .wrangler/state --command "select ..."` if needed, or through the dev server.
- Check pages with `curl -s -i localhost:8788/<path>`; check HTML head/body against the Astro source. Dev-server errors appear in the HTTP response.
- `pnpm exec tsc --noEmit -p .` typechecks `.ts` files (not `.vue`). `pnpm exec vp test` runs unit tests.
