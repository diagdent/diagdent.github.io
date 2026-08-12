import type { CollectionEntry } from 'astro:content';

type Release = CollectionEntry<'releases'>['data'];
type Entry = Release['entries'][number];

const absolute = (path: string, site: URL | undefined) =>
  new URL(path, site).href;

const serializeEntry = (entry: Entry, site: URL | undefined) => ({
  text: entry.text,
  audience: entry.audience,
  ...(entry.media && {
    media: {
      type: entry.media.type,
      src: absolute(entry.media.src, site),
      ...(entry.media.poster && { poster: absolute(entry.media.poster, site) }),
      ...(entry.media.alt && { alt: entry.media.alt }),
    },
  }),
  ...(entry.spotlight && { spotlight: entry.spotlight }),
});

/**
 * Shared JSON feed shape for doctor.json and admin.json: newest-first,
 * capped at 20 releases, media paths resolved to absolute URLs.
 */
export const feedResponse = (releases: Release[], site: URL | undefined) => {
  const feed = {
    generated: new Date().toISOString(),
    releases: releases
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 20)
      .map((release) => ({
        product: release.product,
        version: release.version,
        date: release.date.toISOString().slice(0, 10),
        entries: release.entries.map((entry) => serializeEntry(entry, site)),
      })),
  };
  return new Response(JSON.stringify(feed), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
