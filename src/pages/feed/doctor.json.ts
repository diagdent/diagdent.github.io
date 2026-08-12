import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { feedResponse } from './_utils';

/**
 * Doctor-facing feed: web releases only, doctor-audience entries only,
 * releases left without entries are dropped.
 */
export const GET: APIRoute = async ({ site }) => {
  const releases = (
    await getCollection('releases', ({ data }) => data.product === 'web')
  )
    .map(({ data }) => ({
      ...data,
      entries: data.entries.filter((entry) => entry.audience === 'doctor'),
    }))
    .filter((release) => release.entries.length > 0);

  return feedResponse(releases, site);
};
