import { desc } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { links } from '../db/schema.js';
import { env } from '../env.js';
import { makeCsvFilename, serializeLinksToCsv } from '../infra/csv.js';
import { putObject } from '../infra/r2.js';
import type { DomainError } from '../shared/errors.js';
import { type Result, fail, ok } from '../shared/result.js';

export type ExportCsvOutput = {
  url: string;
  filename: string;
  count: number;
};

// Single SELECT is fine at URL-shortener scale (<1M rows). For very large
// datasets switch to a server-side cursor piped into a streaming PutObject.
export async function exportLinksToCsv(db: Db): Promise<Result<ExportCsvOutput, DomainError>> {
  try {
    const allLinks = await db.select().from(links).orderBy(desc(links.createdAt));
    const csv = serializeLinksToCsv(allLinks, env.FRONTEND_URL);
    const filename = makeCsvFilename();

    await putObject({ key: filename, body: csv, contentType: 'text/csv; charset=utf-8' });

    const publicBase = env.CLOUDFLARE_PUBLIC_URL.replace(/\/+$/, '');
    const url = `${publicBase}/${filename}`;

    return ok({ url, filename, count: allLinks.length });
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    return fail({ kind: 'storage-failure', cause });
  }
}
