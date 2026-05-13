import { Download } from 'lucide-react';
import { useDownloadCsv, useLinks } from '../../hooks/use-links';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../ui/button';
import { EmptyState } from '../ui/empty-state';
import { Skeleton } from '../ui/skeleton';
import { LinkRow } from './link-row';

export function LinksList() {
  const { data, isLoading, isError, refetch } = useLinks();
  const download = useDownloadCsv();
  const { show } = useToast();

  const items = data?.items ?? [];
  const hasLinks = items.length > 0;
  const count = items.length;

  const onDownload = async () => {
    try {
      const { url, filename, count: downloadedCount } = await download.mutateAsync();
      window.open(url, '_blank', 'noopener');
      show({
        title: 'Relatório pronto',
        description: `${filename} (${downloadedCount} ${downloadedCount === 1 ? 'link' : 'links'})`,
        variant: 'success',
      });
    } catch {
      show({ title: 'Falha ao exportar', description: 'Try again in a moment.', variant: 'error' });
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          {isLoading ? '— LINKS' : `${count} ${count === 1 ? 'LINK' : 'LINKS'}`}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          loading={download.isPending}
          disabled={!hasLinks || isLoading}
          title={!hasLinks ? 'Crie um link primeiro' : 'Download as CSV'}
        >
          <Download className="size-4" aria-hidden />
          <span>Baixar CSV</span>
        </Button>
      </div>
      {isLoading ? (
        <ul className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
            <li key={i} className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="size-9 rounded-md" />
              <Skeleton className="size-9 rounded-md" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <div className="flex items-center justify-between gap-3 bg-destructive/10 px-4 py-3 text-destructive sm:px-6">
          <p className="text-sm">Não foi possível carregar os links. Verifique a conexão com a API.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : hasLinks ? (
        <ul className="divide-y divide-border">
          {items.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
        </ul>
      ) : (
        <EmptyState
          title="NENHUM LINK AINDA"
          description="Cole uma URL acima para criar seu primeiro link."
          className="border-0"
        />
      )}
    </div>
  );
}
