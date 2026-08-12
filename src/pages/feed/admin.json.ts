import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { feedResponse } from './_utils';

/** Full (admin-view) feed: every product, every published entry. */
export const GET: APIRoute = async ({ site }) => {
  const releases = (await getCollection('releases')).map(({ data }) => data);

  return feedResponse(releases, site);
};
