import { eq, sql } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { type Link, links } from '../db/schema.js';
import type { DomainError } from '../shared/errors.js';
import { type Result, fail, ok } from '../shared/result.js';

// Atomic counter increment via UPDATE ... RETURNING, avoiding read-then-write races.
export async function incrementAccess(
  db: Db,
  shortPath: string,
): Promise<Result<Link, DomainError>> {
  const updated = await db
    .update(links)
    .set({ accessCount: sql`${links.accessCount} + 1` })
    .where(eq(links.shortPath, shortPath))
    .returning();

  const link = updated[0];
  if (!link) {
    return fail({ kind: 'link-not-found', shortPath });
  }
  return ok(link);
}
