import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '../db/client.js';
import { sendDomainError } from '../shared/errors.js';
import { isFail } from '../shared/result.js';
import { createLink } from '../use-cases/create-link.js';
import { deleteLink } from '../use-cases/delete-link.js';
import { exportLinksToCsv } from '../use-cases/export-csv.js';
import { incrementAccess } from '../use-cases/increment-access.js';
import { listLinks } from '../use-cases/list-links.js';
import { resolveLink } from '../use-cases/resolve-link.js';

const LinkSchema = z.object({
  id: z.string().uuid(),
  shortPath: z.string(),
  originalUrl: z.string(),
  accessCount: z.number().int(),
  createdAt: z.string().datetime(),
});

const ErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
});

function serialize<T extends { createdAt: Date | string }>(link: T): T & { createdAt: string } {
  return {
    ...link,
    createdAt: link.createdAt instanceof Date ? link.createdAt.toISOString() : link.createdAt,
  };
}

export const linksRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/links',
    {
      schema: {
        summary: 'Create a new short link',
        body: z.object({
          shortPath: z.string().min(1).max(64),
          originalUrl: z.string().url(),
        }),
        response: {
          201: LinkSchema,
          400: ErrorSchema,
          409: ErrorSchema,
          429: ErrorSchema,
          502: ErrorSchema,
        },
      },
      config: { rateLimit: { max: 20, timeWindow: '15 minutes' } },
    },
    async (req, reply) => {
      const result = await createLink(db, req.body);
      if (isFail(result)) {
        return sendDomainError(reply, result.error);
      }
      return reply.status(201).send(serialize(result.value));
    },
  );

  // Registered before /:shortPath so the literal route wins matching.
  app.get(
    '/links/export',
    {
      schema: {
        summary: 'Export all links to a CSV uploaded to R2; returns its public CDN URL',
        response: {
          200: z.object({
            url: z.string().url(),
            filename: z.string(),
            count: z.number().int(),
          }),
          429: ErrorSchema,
          502: ErrorSchema,
        },
      },
      config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    },
    async (_req, reply) => {
      const result = await exportLinksToCsv(db);
      if (isFail(result)) {
        return sendDomainError(reply, result.error);
      }
      return reply.send(result.value);
    },
  );

  app.get(
    '/links',
    {
      schema: {
        summary: 'List all short links (cursor-paginated, newest first)',
        querystring: z.object({
          cursor: z.string().optional(),
          limit: z.coerce.number().int().positive().max(100).optional(),
        }),
        response: {
          200: z.object({
            items: z.array(LinkSchema),
            nextCursor: z.string().nullable(),
          }),
        },
      },
    },
    async (req) => {
      const { items, nextCursor } = await listLinks(db, {
        cursor: req.query.cursor,
        limit: req.query.limit,
      });
      return { items: items.map(serialize), nextCursor };
    },
  );

  app.get(
    '/links/:shortPath',
    {
      schema: {
        summary: 'Resolve the original URL for a short path (does NOT increment counter)',
        params: z.object({ shortPath: z.string().min(1) }),
        response: { 200: LinkSchema, 404: ErrorSchema },
      },
    },
    async (req, reply) => {
      const result = await resolveLink(db, req.params.shortPath);
      if (isFail(result)) {
        return sendDomainError(reply, result.error);
      }
      return reply.send(serialize(result.value));
    },
  );

  app.patch(
    '/links/:shortPath/access',
    {
      schema: {
        summary: 'Atomically increment the access counter for a short path',
        params: z.object({ shortPath: z.string().min(1) }),
        response: { 200: LinkSchema, 404: ErrorSchema, 429: ErrorSchema },
      },
      config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    },
    async (req, reply) => {
      const result = await incrementAccess(db, req.params.shortPath);
      if (isFail(result)) {
        return sendDomainError(reply, result.error);
      }
      return reply.send(serialize(result.value));
    },
  );

  app.delete(
    '/links/:shortPath',
    {
      schema: {
        summary: 'Delete a short link',
        params: z.object({ shortPath: z.string().min(1) }),
        response: {
          204: z.null(),
          404: ErrorSchema,
          429: ErrorSchema,
        },
      },
      config: { rateLimit: { max: 30, timeWindow: '15 minutes' } },
    },
    async (req, reply) => {
      const result = await deleteLink(db, req.params.shortPath);
      if (isFail(result)) {
        return sendDomainError(reply, result.error);
      }
      return reply.status(204).send(null);
    },
  );
};
