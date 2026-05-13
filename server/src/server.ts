import { buildApp } from './app.js';
import { env } from './env.js';
import { ensureBucket } from './infra/r2.js';

async function main(): Promise<void> {
  await ensureBucket().catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('ensureBucket warning:', msg);
  });

  const app = await buildApp();
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
  app.log.info(`Ziply API listening on http://0.0.0.0:${env.PORT}`);
}

main().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
