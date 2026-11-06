/**
 * Newest release first. Two releases on one day share a date, so the
 * version (CalVer, compared numerically) breaks the tie.
 */
export const newestFirst = (
  a: { date: Date; version: string },
  b: { date: Date; version: string },
) =>
  b.date.getTime() - a.date.getTime() ||
  b.version.localeCompare(a.version, undefined, { numeric: true });
