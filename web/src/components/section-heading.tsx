import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface SectionHeadingProps {
  num: string;
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  num,
  title,
  description,
  className,
  children,
}: SectionHeadingProps) {
  const kicker = (title.split('.')[0] ?? title).toUpperCase();
  return (
    <section
      className={cn('border-t border-border py-12 first:border-t-0 first:pt-0 sm:py-16', className)}
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[120px_1fr] sm:gap-12">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          {num} - {kicker}
        </span>
        <div>
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-prose text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children ? <div className="mt-8 sm:mt-10">{children}</div> : null}
    </section>
  );
}
