import { defineHandler, defineHead, type InferProps } from 'void';
import { getGuides } from '../../src/lib/guides';
import { seoHead } from '../../src/lib/head';
import { pageTitle } from '../../src/lib/seo';
import { withShared } from '../../src/server/shared';

// Static content: rendered once per deploy (was a static Astro collection page).
export const prerender = true;

export const loader = defineHandler(withShared, () => ({
  guides: getGuides().map((g) => ({
    id: g.id,
    title: g.data.title,
    description: g.data.description,
    category: g.data.category,
  })),
}));

export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() =>
  seoHead({
    path: '/guides',
    title: pageTitle('Dumpster Rental Guides'),
    description: 'Size guides, materials, permits, and cost factors for smarter dumpster rentals.',
    ads: true,
  }),
);
