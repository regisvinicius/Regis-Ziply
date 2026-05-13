import { and, desc, eq, lt, or } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { type Link, links } from '../db/schema.js';

export type ListLinksInput = {
  limit?: number;
  cursor?: string;
};

export type ListLinksOutput = {
  items: Link[];
  nextCursor: string | null;
};

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

// Keyset pagination on (created_at DESC, id DESC). The composite index on
// (created_at, id) keeps this O(log n) regardless of table size, unlike
// OFFSET which degrades linearly. Cursor encodes the last row's tuple as
// `${iso}:${uuid}`.
export async function listLinks(db: Db, input: ListLinksInput = {}): Promise<ListLinksOutput> {
  const limit = Math.min(Math.max(input.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  const parsedCursor = parseCursor(input.cursor);

  const where = parsedCursor
    ? or(
        lt(links.createdAt, parsedCursor.createdAt),
        and(eq(links.createdAt, parsedCursor.createdAt), lt(links.id, parsedCursor.id)),
      )
    : undefined;

  const rows = await db
    .select()
    .from(links)
    .where(where)
    .orderBy(desc(links.createdAt), desc(links.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items[items.length - 1];
  const nextCursor = hasMore && last ? `${last.createdAt.toISOString()}:${last.id}` : null;

  return { items, nextCursor };
}

function parseCursor(raw?: string): { createdAt: Date; id: string } | null {
  if (!raw) return null;
  const idx = raw.lastIndexOf(':');
  if (idx <= 0) return null;
  const isoPart = raw.slice(0, idx);
  const idPart = raw.slice(idx + 1);
  const createdAt = new Date(isoPart);
  if (Number.isNaN(createdAt.getTime())) return null;
  return { createdAt, id: idPart };
}
