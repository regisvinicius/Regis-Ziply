import { useQuery } from '@tanstack/react-query';
import { LinkIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ApiHttpError, api } from '../lib/api';
import { NotFoundPage } from './not-found';

export function RedirectPage() {
  const { shortPath = '' } = useParams<{ shortPath: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['redirect', shortPath],
    queryFn: async () => {
      const link = await api.resolve(shortPath);
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
    return null;
  }

  if (isLoading || data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#d9dbe1] p-4">
        <div className="w-full max-w-[540px] rounded-xl bg-[#f3f3f6] px-8 py-12 text-center">
          <LinkIcon className="mx-auto mb-4 size-9 text-[#2f46b9]" />
          <h1 className="mb-3 text-4xl font-semibold text-[#23242f]">Redirecionando...</h1>
          <p className="text-sm text-[#6d7287]">O link será aberto automaticamente em alguns instantes.</p>
          <p className="text-sm text-[#6d7287]">
            Não foi redirecionado? <a href="#" className="text-[#2f46b9] underline">Acesse aqui</a>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
