import { sql } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// `shortPath` is the public identifier (it appears in URLs); the internal
// `id` UUID exists for referential integrity. All API operations key on
// `shortPath` so the URL is the single source of identity.
export const links = pgTable(
  'links',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    shortPath: varchar('short_path', { length: 255 }).notNull().unique(),
    originalUrl: text('original_url').notNull(),
    accessCount: integer('access_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  },
  (table) => ({
    createdAtIdx: index('links_created_at_id_idx').on(table.createdAt, table.id),
  }),
);

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
