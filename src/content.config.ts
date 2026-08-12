import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

/**
 * One Release File per shipped release, written by the Release Skill
 * (web) or by consent-app's release.py (consent-app).
 *
 * Audience tiers are nested: `doctor` entries appear on both pages,
 * `admin` entries on the admin page only. `internal` changes are never
 * written to this repo at all.
 *
 * Media files live in `public/media/<version>/` and are referenced
 * site-absolute (`/media/...`) so the same path works on both pages
 * and in the JSON feeds.
 */
const releases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './releases' }),
  schema: z.object({
    product: z.enum(['web', 'consent-app']),
    version: z.string(),
    date: z.coerce.date(),
    entries: z
      .array(
        z.object({
          text: z.string(),
          audience: z.enum(['doctor', 'admin']),
          /** Optional screenshot or short clip illustrating the entry. */
          media: z
            .object({
              type: z.enum(['image', 'clip']),
              src: z.string().startsWith('/media/'),
              poster: z.string().startsWith('/media/').optional(),
              alt: z.string().optional(),
            })
            .refine(
              (m) =>
                m.type !== 'clip' ||
                m.src.endsWith('.webm') ||
                m.src.endsWith('.mp4'),
              { message: 'clip src must end with .webm or .mp4' },
            )
            .optional(),
          /** Optional in-app spotlight target (route + element anchor). */
          spotlight: z
            .object({
              route: z.string(),
              anchor: z.string(),
            })
            .optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { releases };
