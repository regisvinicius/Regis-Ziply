import { z } from 'zod';

const SHORT_PATH_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

export const shortPathSchema = z
  .string()
  .min(1, 'Short path is required')
  .max(64, 'Short path must be 64 characters or fewer')
  .regex(
    SHORT_PATH_REGEX,
    'Use lowercase letters, digits, and hyphens (no leading or trailing hyphen).',
  );

export const createLinkSchema = z.object({
  shortPath: shortPathSchema,
  originalUrl: z.string().url('Enter a valid URL (https://...)'),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export const linkSchema = z.object({
  id: z.string().uuid(),
  shortPath: z.string(),
  originalUrl: z.string().url(),
  accessCount: z.number().int().nonnegative(),
  createdAt: z.string(),
});

export type Link = z.infer<typeof linkSchema>;

export const listLinksResponseSchema = z.object({
  items: z.array(linkSchema),
  nextCursor: z.string().nullable(),
});

export const exportCsvResponseSchema = z.object({
  url: z.string().url(),
  filename: z.string(),
  count: z.number().int().nonnegative(),
});

export const apiErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
});
export type ApiError = z.infer<typeof apiErrorSchema>;
