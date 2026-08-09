import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const PRODUCT_NAMES: Record<string, string> = {
  web: 'System DiagDent',
  'consent-app': 'Aplikacja do zgód',
};

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

/** Full (admin-view) feed of every published release. */
export const GET: APIRoute = async ({ site }) => {
  const releases = (await getCollection('releases'))
    .map(({ data }) => data)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const items = releases
    .map((release) => {
      const title = `${PRODUCT_NAMES[release.product]} ${release.version}`;
      const anchor = `v${release.version.replaceAll('.', '-')}`;
      const link = new URL(
        release.product === 'web' ? `/admin/#${anchor}` : '/admin/',
        site,
      ).href;
      const description = release.entries
        .map((entry) => `• ${entry.text}`)
        .join('\n');
      return [
        '<item>',
        `<title>${escapeXml(title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid isPermaLink="false">${escapeXml(`${release.product}-${release.version}`)}</guid>`,
        `<pubDate>${release.date.toUTCString()}</pubDate>`,
        `<description>${escapeXml(description)}</description>`,
        '</item>',
      ].join('');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"><channel>',
    '<title>DiagDent – historia zmian</title>',
    `<link>${new URL('/admin/', site).href}</link>`,
    '<description>Pełna historia zmian systemu DiagDent</description>',
    '<language>pl</language>',
    items,
    '</channel></rss>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
