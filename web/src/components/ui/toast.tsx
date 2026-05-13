import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type ToastItem = {
  id: number;
  title: string;
  description?: ReactNode;
  variant: 'info' | 'success' | 'error';
};

const variantStyles: Record<ToastItem['variant'], string> = {
  info: 'border-border bg-card text-card-foreground',
  success: 'border-accent/40 bg-card text-card-foreground',
  error: 'border-destructive/40 bg-card text-card-foreground',
};

const variantIcon: Record<ToastItem['variant'], typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: TriangleAlert,
};

const variantIconClass: Record<ToastItem['variant'], string> = {
  info: 'text-muted-foreground',
  success: 'text-accent',
  error: 'text-destructive',
};

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end"
    >
      {toasts.map((toast) => {
        const Icon = variantIcon[toast.variant];
        return (
          <output
            key={toast.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg',
              'animate-[slide-in-up_180ms_ease-out]',
              variantStyles[toast.variant],
            )}
          >
            <Icon className={cn('mt-0.5 size-5 shrink-0', variantIconClass[toast.variant])} />
            <div className="flex-1 text-sm">
              <p className="font-medium">{toast.title}</p>
              {toast.description ? (
                <p className="mt-0.5 text-muted-foreground">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => onDismiss(toast.id)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </output>
        );
      })}
    </div>
  );
}
