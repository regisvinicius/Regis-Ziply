import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 border border-dashed border-border bg-card px-6 py-12 text-center',
        className,
      )}
    >
      {Icon ? (
        <span
          className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground"
          aria-hidden
        >
          <Icon className="size-5" />
        </span>
      ) : null}
      <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-foreground">
        {title}
      </h3>
      {description ? (
        <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
