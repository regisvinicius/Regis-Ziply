import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import Fastify, { type FastifyError, type FastifyInstance } from 'fastify';
import {
  type ZodTypeProvider,
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { env, getCorsOrigins } from './env.js';
import { linksRoutes } from './routes/links.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    // trustProxy lets req.ip read X-Forwarded-For / Fly-Client-IP behind a proxy.
    trustProxy: env.NODE_ENV === 'production',
    logger: {
      level: env.NODE_ENV === 'test' ? 'silent' : 'info',
      transport:
        env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss.l' } }
          : undefined,
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((error: FastifyError, _req, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
        error: 'Request validation failed',
        code: 'validation-failed',
        details: error.validation,
      });
    }

    if (error.code === 'RATE_LIMITED' || error.statusCode === 429) {
      return reply.code(429).send({
        error: error.message,
        code: 'rate-limited',
      });
    }

    app.log.error({ err: error }, 'Unhandled error');
    const status = typeof error.statusCode === 'number' ? error.statusCode : 500;
    return reply
      .status(status)
      .send({ error: error.message ?? 'Internal server error', code: 'internal-error' });
  });

  await app.register(cors, {
    origin: getCorsOrigins(),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: false,
  });

  // Health is registered BEFORE rate-limit so it's exempt from throttling.
  app.get('/health', () => ({ status: 'ok' }));

  await app.register(rateLimit, {
    global: true,
    max: env.RATE_LIMIT_GLOBAL_MAX,
    timeWindow: env.RATE_LIMIT_GLOBAL_WINDOW,
    // Bypass during vitest runs so unit-test loops don't trip the limiter.
    allowList: () => env.NODE_ENV === 'test',
    // The plugin throws this. Must be a proper Error with statusCode set so
    // Fastify's pipeline routes through setErrorHandler. Body is reshaped above.
    errorResponseBuilder: (_req, ctx) => {
      const err = new Error(`Too many requests. Try again in ${Math.ceil(ctx.ttl / 1000)}s.`);
      (err as FastifyError).statusCode = 429;
      (err as FastifyError).code = 'RATE_LIMITED';
      return err;
    },
  });

  await app.register(linksRoutes);

  return app;
}
