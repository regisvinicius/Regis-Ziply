import type { Link } from '../db/schema.js';

export function serializeLinksToCsv(links: ReadonlyArray<Link>, frontendBaseUrl: string): string {
  const header = ['original_url', 'short_url', 'access_count', 'created_at'];
  const rows: string[][] = [header];
  const base = frontendBaseUrl.replace(/\/+$/, '');
  for (const link of links) {
    rows.push([
      link.originalUrl,
      `${base}/${link.shortPath}`,
      String(link.accessCount),
      link.createdAt.toISOString(),
    ]);
  }
  return rows.map((row) => row.map(csvEscape).join(',')).join('\n');
}

// RFC 4180: wrap in quotes if value contains comma, quote, or newline; double inner quotes.
function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function makeCsvFilename(): string {
  return `links-${crypto.randomUUID()}.csv`;
}
