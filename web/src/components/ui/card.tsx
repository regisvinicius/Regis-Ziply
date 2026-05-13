import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 p-6 pb-2', className)}
      {...rest}
    />
  );
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot="card-title"
      className={cn('text-xl font-semibold leading-none tracking-tight text-foreground', className)}
      {...rest}
    />
  );
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-body" className={cn('px-6 pb-6 pt-2', className)} {...rest} />;
}

// shadcn-compatible alias for new code; existing imports still use CardBody.
export const CardContent = CardBody;

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 pb-6 pt-0', className)}
      {...rest}
    />
  );
}
