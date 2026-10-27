import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
  }),
  schema: z.object({
    id: z.string(),
    legacySlug: z.string(),
    titleEn: z.string(),
    titleAr: z.string(),
    excerptEn: z.string(),
    excerptAr: z.string(),
    contentEn: z.string(),
    date: z.string(),
    status: z.enum(['published', 'draft']),
    tags: z.array(z.string()).default([]),
    readingTimeMin: z.number().default(5),
    featured: z.boolean().default(false),
    category: z.string().default('عام'),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    locked: z.boolean().default(false),
    passwordEnv: z.string().optional(),
  }).superRefine((data, context) => {
    if (data.locked && !data.passwordEnv) {
      context.addIssue({
        code: 'custom',
        path: ['passwordEnv'],
        message: 'Locked posts must name the environment variable holding their password.',
      });
    }
  }),
});

export const collections = { blog };
