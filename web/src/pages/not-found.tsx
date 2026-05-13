import { Link } from 'react-router-dom';

type Props = {
  variant?: 'page-not-found' | 'link-not-found';
  shortPath?: string;
};

export function NotFoundPage({ variant = 'page-not-found', shortPath }: Props) {
  const isLink = variant === 'link-not-found';
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
        404 / {isLink ? 'LINK NOT FOUND' : 'PAGE NOT FOUND'}
      </p>
      <h1 className="text-5xl font-medium tracking-[-0.02em] sm:text-6xl">
        {isLink ? (
          <>
            <span className="font-mono text-accent">/{shortPath}</span> does not exist.
          </>
        ) : (
          <>This page does not exist.</>
        )}
      </h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        {isLink
          ? 'The short link may have been deleted or never existed. Create a fresh one from the home page.'
          : 'The address you entered is not a registered route.'}
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
