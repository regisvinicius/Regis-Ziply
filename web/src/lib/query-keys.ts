export const queryKeys = {
  links: () => ['links'] as const,
  link: (shortPath: string) => ['links', shortPath] as const,
} as const;
