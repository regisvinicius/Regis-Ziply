import { Copy, Trash2 } from 'lucide-react';
import { useDeleteLink } from '../../hooks/use-links';
import { useToast } from '../../hooks/use-toast';
import { ApiHttpError } from '../../lib/api';
import { cn } from '../../lib/cn';
import type { Link } from '../../lib/validators';
import { IconButton } from '../ui/icon-button';

const FRONTEND_URL = (import.meta.env.VITE_FRONTEND_URL ?? 'http://localhost:5173').replace(
  /\/+$/,
  '',
);

export function LinkRow({ link }: { link: Link }) {
  const { show } = useToast();
  const deleteLink = useDeleteLink();

  const shortUrl = `${FRONTEND_URL}/${link.shortPath}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      show({ title: 'Copied to clipboard', variant: 'success' });
    } catch {
      show({ title: 'Could not copy', description: 'Copy the URL manually.', variant: 'error' });
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(`Delete ${link.shortPath}?`);
    if (!confirmed) return;
    try {
      await deleteLink.mutateAsync(link.shortPath);
      show({ title: 'Link deleted', description: link.shortPath, variant: 'success' });
    } catch (err) {
      if (err instanceof ApiHttpError) {
        show({ title: 'Delete failed', description: err.message, variant: 'error' });
        return;
      }
      show({ title: 'Network error', description: 'Try again in a moment.', variant: 'error' });
    }
  };

  return (
    <li
      className={cn(
        'flex items-center gap-3 px-4 py-3 last:border-b-0 sm:px-6',
        deleteLink.isPending && 'opacity-50',
      )}
    >
      <div className="min-w-0 flex-1">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-sm font-semibold text-[#2f46b9] underline-offset-4 hover:underline"
        >
          brev.ly/{link.shortPath}
        </a>
        <p className="truncate text-xs text-[#7a8096]" title={link.originalUrl}>
          {link.originalUrl}
        </p>
      </div>
      <p className="hidden whitespace-nowrap text-xs text-[#74798f] sm:block">{link.accessCount} acessos</p>
      <IconButton aria-label="Copy short URL" onClick={onCopy}>
        <Copy className="size-4" aria-hidden />
      </IconButton>
      <IconButton aria-label="Delete link" variant="destructive" onClick={onDelete} disabled={deleteLink.isPending}>
        <Trash2 className="size-4" aria-hidden />
      </IconButton>
    </li>
  );
}
