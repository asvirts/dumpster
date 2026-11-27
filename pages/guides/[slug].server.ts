import { defineHandler, defineHead, type InferProps } from 'void';
import type { PageParams } from 'void/routes';
import { getGuide, getGuides, renderGuide } from '../../src/lib/guides';
import { SITE_ORIGIN, seoHead } from '../../src/lib/head';
import { articleJsonLd, breadcrumbJsonLd, pageTitle } from '../../src/lib/seo';
import { notFound } from '../../src/server/not-found';
import { withShared } from '../../src/server/shared';

// Guides are static content: prerendered once per deploy.
export const prerender = true;

export async function getPrerenderPaths(): Promise<PageParams<'/guides/[slug]'>[]> {
  return getGuides().map((g) => ({ slug: g.id }));
}

export const loader = defineHandler(withShared, (c) => {
  const guide = getGuide(c.req.param('slug'));
  if (!guide) return notFound(c);
  const { title, description, category, image, imageAlt, imageCredit, imageCreditUrl, published, updated } =
    guide.data;
  return {
    guide: {
      id: guide.id,
      title,
      description,
      category,
      image: image ?? null,
      imageAlt: imageAlt ?? null,
      imageCredit: imageCredit ?? null,
      imageCreditUrl: imageCreditUrl ?? null,
      published: published?.toISOString() ?? null,
      updated: updated?.toISOString() ?? null,
    },
    html: renderGuide(guide),
  };
});

export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>((_c, { guide }) => {
  const guideUrl = `${SITE_ORIGIN}/guides/${guide.id}`;
  const ogImage = guide.image ? new URL(guide.image, SITE_ORIGIN).toString() : undefined;
  return seoHead({
    path: `/guides/${guide.id}`,
    title: pageTitle(guide.title),
    description: guide.description,
    ogImage,
    ogType: 'article',
    modifiedTime: guide.updated ?? guide.published ?? undefined,
    ads: true,
    jsonLd: [
      articleJsonLd({
        title: guide.title,
        description: guide.description,
        url: guideUrl,
        siteUrl: SITE_ORIGIN,
        image: ogImage,
        datePublished: guide.published ?? undefined,
        dateModified: guide.updated ?? undefined,
      }),
      breadcrumbJsonLd([
        { name: 'Home', url: SITE_ORIGIN },
        { name: 'Guides', url: `${SITE_ORIGIN}/guides` },
        { name: guide.title, url: guideUrl },
      ]),
    ],
  });
});
