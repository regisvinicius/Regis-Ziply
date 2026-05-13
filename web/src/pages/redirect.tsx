import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '../components/ui/spinner';
import { ApiHttpError, api } from '../lib/api';
import { NotFoundPage } from './not-found';

export function RedirectPage() {
  const { shortPath = '' } = useParams<{ shortPath: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['redirect', shortPath],
    queryFn: async () => {
      const link = await api.resolve(shortPath);
      // Fire-and-forget: the request is dispatched before window.location.replace
      // unloads the page. Counter is best-effort; the redirect is the user win.
      api.incrementAccess(shortPath).catch(() => {});
      return link;
    },
    enabled: shortPath.length > 0,
    retry: (failureCount, err) => {
      if (err instanceof ApiHttpError && err.status === 404) return false;
      return failureCount < 1;
    },
  });

  useEffect(() => {
    if (data?.originalUrl) {
      window.location.replace(data.originalUrl);
    }
  }, [data]);

  if (isError) {
    if (error instanceof ApiHttpError && error.status === 404) {
      return <NotFoundPage variant="link-not-found" shortPath={shortPath} />;
    }
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Something went wrong</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          We could not resolve <code className="font-mono">{shortPath}</code>. Try again.
        </p>
      </div>
    );
  }

  if (isLoading || data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Spinner className="size-8 text-accent" />
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          Redirecting
        </p>
      </div>
    );
  }

  return null;
}
