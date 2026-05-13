// 1-64 chars: lowercase letters, digits, hyphens; no leading/trailing hyphen.
// Narrower than the storage column (varchar(255)) on purpose; the column is
// the upper bound, this regex is the API contract.
const SHORT_PATH_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

export function isValidShortPath(value: string): boolean {
  return SHORT_PATH_REGEX.test(value);
}

export function shortPathValidationMessage(): string {
  return 'Short path must be 1-64 chars: lowercase letters, digits, hyphens (no leading/trailing hyphen).';
}
