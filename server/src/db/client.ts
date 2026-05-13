import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env.js';
import * as schema from './schema.js';

export const sqlClient = postgres(env.DATABASE_URL, {
  max: env.NODE_ENV === 'test' ? 2 : 10,
  prepare: false,
});

export const db = drizzle(sqlClient, { schema, logger: env.NODE_ENV === 'development' });

export type Db = typeof db;
