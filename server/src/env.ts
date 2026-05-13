import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  CLOUDFLARE_ACCOUNT_ID: z.string().default(''),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),
  CLOUDFLARE_BUCKET: z.string().min(1),
  CLOUDFLARE_PUBLIC_URL: z.string().url(),
  CLOUDFLARE_ENDPOINT: z.string().url().optional(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().default(''),
  RATE_LIMIT_GLOBAL_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_GLOBAL_WINDOW: z.string().default('15 minutes'),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = (() => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment:', parsed.error.flatten().fieldErrors);
    throw new Error('Environment validation failed');
  }
  return parsed.data;
})();

export function getCorsOrigins(): string[] | true {
  const raw = env.CORS_ORIGINS.trim();
  if (raw === '') return true;
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}
