import { describe, expect, it } from 'vitest';
import type { Link } from '../db/schema.js';
import { makeCsvFilename, serializeLinksToCsv } from './csv.js';

const fixedDate = new Date('2026-05-13T12:34:56.789Z');

function fakeLink(overrides: Partial<Link> = {}): Link {
  return {
    id: '00000000-0000-0000-0000-000000000000',
    shortPath: 'abc',
    originalUrl: 'https://example.com/page',
    accessCount: 0,
    createdAt: fixedDate,
    ...overrides,
  };
}

describe('serializeLinksToCsv', () => {
  it('produces header + one row per link', () => {
    const csv = serializeLinksToCsv([fakeLink()], 'https://av.url');
    const lines = csv.split('\n');
    expect(lines[0]).toBe('original_url,short_url,access_count,created_at');
    expect(lines[1]).toBe('https://example.com/page,https://av.url/abc,0,2026-05-13T12:34:56.789Z');
    expect(lines.length).toBe(2);
  });

  it('trims trailing slashes from the base URL', () => {
    const csv = serializeLinksToCsv([fakeLink({ shortPath: 'x' })], 'https://av.url///');
    expect(csv).toContain('https://av.url/x');
  });

  it('escapes commas, quotes, and newlines per RFC 4180', () => {
    const csv = serializeLinksToCsv(
      [
        fakeLink({
          shortPath: 'qa',
          originalUrl: 'https://example.com/?q=1,2&"name"=foo\nbar',
          accessCount: 7,
        }),
      ],
      'https://av.url',
    );
    const lines = csv.split('\n');
    expect(lines[1]).toContain('"https://example.com/?q=1,2&""name""=foo');
  });

  it('handles empty list (header only)', () => {
    const csv = serializeLinksToCsv([], 'https://av.url');
    expect(csv).toBe('original_url,short_url,access_count,created_at');
  });
});

describe('makeCsvFilename', () => {
  it('matches `links-<uuid>.csv` shape', () => {
    const name = makeCsvFilename();
    expect(name).toMatch(/^links-[0-9a-f-]{36}\.csv$/);
  });

  it('returns unique filenames across calls', () => {
    const a = makeCsvFilename();
    const b = makeCsvFilename();
    expect(a).not.toBe(b);
  });
});
