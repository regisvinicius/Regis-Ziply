import type { FastifyReply } from 'fastify';

export type DomainError =
  | { kind: 'invalid-short-path'; message: string }
  | { kind: 'short-path-already-exists'; shortPath: string }
  | { kind: 'link-not-found'; shortPath: string }
  | { kind: 'storage-failure'; cause: string };

export type HttpStatus = 400 | 404 | 409 | 502;

export function toHttp(error: DomainError): {
  statusCode: HttpStatus;
  body: { error: string; code: string };
} {
  switch (error.kind) {
    case 'invalid-short-path':
      return {
        statusCode: 400,
        body: { error: error.message, code: error.kind },
      };
    case 'short-path-already-exists':
      return {
        statusCode: 409,
        body: { error: `Short path "${error.shortPath}" already exists`, code: error.kind },
      };
    case 'link-not-found':
      return {
        statusCode: 404,
        body: { error: `Short path "${error.shortPath}" not found`, code: error.kind },
      };
    case 'storage-failure':
      return {
        statusCode: 502,
        body: { error: 'Storage backend failed', code: error.kind },
      };
  }
}

// `as never` widens the status-code type past the per-route response schema's
// literal union. Runtime behavior is unchanged; this avoids declaring every
// possible error status on every route.
export function sendDomainError(reply: FastifyReply, error: DomainError): FastifyReply {
  const { statusCode, body } = toHttp(error);
  return reply.status(statusCode as never).send(body as never);
}
