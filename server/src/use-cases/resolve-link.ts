import { eq } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { type Link, links } from '../db/schema.js';
import type { DomainError } from '../shared/errors.js';
import { type Result, fail, ok } from '../shared/result.js';

// Resolve WITHOUT incrementing. Counting is a separate PATCH so the client
// chooses when to count (e.g. skip bot pre-fetches).
export async function resolveLink(db: Db, shortPath: string): Promise<Result<Link, DomainError>> {
  const [link] = await db.select().from(links).where(eq(links.shortPath, shortPath)).limit(1);
  if (!link) {
    return fail({ kind: 'link-not-found', shortPath });
  }
  return ok(link);
}
