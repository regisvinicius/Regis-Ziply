import { describe, expect, it } from 'vitest';
import { createLinkSchema, shortPathSchema } from './validators';

describe('shortPathSchema', () => {
  it('accepts valid short paths', () => {
    expect(shortPathSchema.safeParse('abc').success).toBe(true);
    expect(shortPathSchema.safeParse('my-link').success).toBe(true);
    expect(shortPathSchema.safeParse('a-b-c').success).toBe(true);
    expect(shortPathSchema.safeParse('a').success).toBe(true);
  });

  it('rejects empty', () => {
    expect(shortPathSchema.safeParse('').success).toBe(false);
  });

  it('rejects uppercase / spaces / special chars', () => {
    expect(shortPathSchema.safeParse('Abc').success).toBe(false);
    expect(shortPathSchema.safeParse('hello world').success).toBe(false);
    expect(shortPathSchema.safeParse('hello_world').success).toBe(false);
    expect(shortPathSchema.safeParse('hello/world').success).toBe(false);
  });

  it('rejects leading or trailing hyphen', () => {
    expect(shortPathSchema.safeParse('-abc').success).toBe(false);
    expect(shortPathSchema.safeParse('abc-').success).toBe(false);
  });

  it('rejects too long', () => {
    expect(shortPathSchema.safeParse('a'.repeat(65)).success).toBe(false);
  });
});

describe('createLinkSchema', () => {
  it('accepts valid input', () => {
    const result = createLinkSchema.safeParse({
      shortPath: 'abc',
      originalUrl: 'https://example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid URL', () => {
    const result = createLinkSchema.safeParse({
      shortPath: 'abc',
      originalUrl: 'not a url',
    });
    expect(result.success).toBe(false);
  });
});
