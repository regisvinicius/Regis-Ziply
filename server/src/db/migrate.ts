import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, sqlClient } from './client.js';

async function main(): Promise<void> {
  console.log(
    'Running migrations against',
    process.env.DATABASE_URL?.replace(/:[^:@/]+@/, ':***@'),
  );
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  await sqlClient.end();
  console.log('Migrations complete.');
}

main().catch((err: unknown) => {
  console.error('Migration failed:', err);
  process.exitCode = 1;
});
