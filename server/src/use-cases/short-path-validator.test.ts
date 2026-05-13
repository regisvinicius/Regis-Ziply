import { describe, expect, it } from 'vitest';
import { isValidShortPath } from './short-path-validator.js';

describe('isValidShortPath', () => {
  it('accepts simple lowercase alphanumeric', () => {
    expect(isValidShortPath('abc')).toBe(true);
    expect(isValidShortPath('hello123')).toBe(true);
  });

  it('accepts hyphens between alphanumeric', () => {
    expect(isValidShortPath('my-link')).toBe(true);
    expect(isValidShortPath('a-b-c-1-2-3')).toBe(true);
  });

  it('rejects empty', () => {
    expect(isValidShortPath('')).toBe(false);
  });

  it('rejects uppercase', () => {
    expect(isValidShortPath('Abc')).toBe(false);
    expect(isValidShortPath('hello-WORLD')).toBe(false);
  });

  it('rejects leading or trailing hyphen', () => {
    expect(isValidShortPath('-abc')).toBe(false);
    expect(isValidShortPath('abc-')).toBe(false);
    expect(isValidShortPath('-')).toBe(false);
  });

  it('rejects spaces or special chars', () => {
    expect(isValidShortPath('hello world')).toBe(false);
    expect(isValidShortPath('hello_world')).toBe(false);
    expect(isValidShortPath('hello!')).toBe(false);
    expect(isValidShortPath('hello/world')).toBe(false);
  });

  it('rejects too long (>64 chars)', () => {
    expect(isValidShortPath('a'.repeat(65))).toBe(false);
  });

  it('accepts 64-char boundary', () => {
    expect(isValidShortPath('a'.repeat(64))).toBe(true);
  });

  it('accepts single char', () => {
    expect(isValidShortPath('a')).toBe(true);
    expect(isValidShortPath('1')).toBe(true);
  });
});
