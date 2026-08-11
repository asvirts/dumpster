import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().default('general'),
    draft: z.boolean().default(false),
    /** Last meaningful content update — used for sitemap lastmod. */
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageCredit: z.string().optional(),
    imageCreditUrl: z.string().url().optional(),
  }),
});

export const collections = { guides };
