import type { ZodTypeAny, z } from 'zod';
import {
  type CreateLinkInput,
  type Link,
  apiErrorSchema,
  exportCsvResponseSchema,
  linkSchema,
  listLinksResponseSchema,
} from './validators';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3333').replace(
  /\/+$/,
  '',
);

export class ApiHttpError extends Error {
  public readonly status: number;
  public readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiHttpError';
    this.status = status;
    this.code = code;
  }
}

async function request<S extends ZodTypeAny>(
  path: string,
  init: RequestInit,
  responseSchema: S | null,
): Promise<z.infer<S>> {
  const url = `${BACKEND_URL}${path}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...((init.headers as Record<string, string> | undefined) ?? {}),
  };
  // Bodyless PATCH/DELETE must not declare Content-Type: application/json,
  // else Fastify rejects with FST_ERR_CTP_EMPTY_JSON_BODY.
  if (init.body != null) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...init, headers });

  if (res.status === 204) return undefined as z.infer<S>;

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    if (!res.ok) {
      throw new ApiHttpError(res.status, 'invalid-response', 'API returned non-JSON body');
    }
    return undefined as z.infer<S>;
  }

  if (!res.ok) {
    const parsed = apiErrorSchema.safeParse(data);
    const code = parsed.success ? parsed.data.code : 'unknown';
    const message = parsed.success ? parsed.data.error : `Request failed with status ${res.status}`;
    throw new ApiHttpError(res.status, code, message);
  }

  if (!responseSchema) return data as z.infer<S>;
  const parsed = responseSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiHttpError(500, 'response-schema-mismatch', parsed.error.message);
  }
  return parsed.data as z.infer<S>;
}

export const api = {
  list: (cursor?: string) =>
    request(
      `/links${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      { method: 'GET' },
      listLinksResponseSchema,
    ),

  create: (input: CreateLinkInput): Promise<Link> =>
    request('/links', { method: 'POST', body: JSON.stringify(input) }, linkSchema),

  resolve: (shortPath: string): Promise<Link> =>
    request(`/links/${encodeURIComponent(shortPath)}`, { method: 'GET' }, linkSchema),

  incrementAccess: (shortPath: string): Promise<Link> =>
    request(`/links/${encodeURIComponent(shortPath)}/access`, { method: 'PATCH' }, linkSchema),

  remove: (shortPath: string): Promise<void> =>
    request(`/links/${encodeURIComponent(shortPath)}`, { method: 'DELETE' }, null),

  exportCsv: () => request('/links/export', { method: 'GET' }, exportCsvResponseSchema),
};
