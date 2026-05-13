import { eq } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { links } from '../db/schema.js';
import type { DomainError } from '../shared/errors.js';
import { type Result, fail, ok } from '../shared/result.js';

export async function deleteLink(
  db: Db,
  shortPath: string,
): Promise<Result<{ shortPath: string }, DomainError>> {
  const deleted = await db
    .delete(links)
    .where(eq(links.shortPath, shortPath))
    .returning({ shortPath: links.shortPath });

  const row = deleted[0];
  if (!row) {
    return fail({ kind: 'link-not-found', shortPath });
  }
  return ok(row);
}
