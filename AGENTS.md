## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

First-time local data:

```
bun run db:setup:local
```

Admin is at `/admin`. Local bypass: `ADMIN_BYPASS=1` in `.dev.vars` **only** under `astro dev`. Production: set secrets `CF_ACCESS_TEAM_DOMAIN` + `CF_ACCESS_AUD` and put Access on `/admin*` (Worker verifies the Access JWT).

## Stack

- Astro 7 + `@astrojs/cloudflare` (Workers, not Pages)
- Cloudflare D1 + Drizzle ORM
- Tailwind CSS v4
- MapLibre + OpenFreeMap tiles

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
- [Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
