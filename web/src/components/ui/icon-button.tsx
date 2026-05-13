import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'ghost' | 'destructive';
  'aria-label': string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant = 'ghost', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'ghost'
          ? 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
