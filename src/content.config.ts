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
        }),
      )
      .default([]),
  }),
});

export const collections = { releases };
