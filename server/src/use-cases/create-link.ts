import { eq } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { type Link, links } from '../db/schema.js';
import type { DomainError } from '../shared/errors.js';
import { type Result, fail, ok } from '../shared/result.js';
import { isValidShortPath, shortPathValidationMessage } from './short-path-validator.js';

export type CreateLinkInput = {
  shortPath: string;
  originalUrl: string;
};

export async function createLink(
  db: Db,
  input: CreateLinkInput,
): Promise<Result<Link, DomainError>> {
  if (!isValidShortPath(input.shortPath)) {
    return fail({ kind: 'invalid-short-path', message: shortPathValidationMessage() });
  }

  const existing = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.shortPath, input.shortPath))
    .limit(1);

  if (existing.length > 0) {
    return fail({ kind: 'short-path-already-exists', shortPath: input.shortPath });
  }

  const [created] = await db
    .insert(links)
    .values({ shortPath: input.shortPath, originalUrl: input.originalUrl })
    .returning();

  if (!created) {
    return fail({ kind: 'storage-failure', cause: 'insert returned no row' });
  }

  return ok(created);
}
