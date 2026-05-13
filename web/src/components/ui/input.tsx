import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  leadingAddon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, hint, error, leadingAddon, className, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#8d93a6]"
      >
        {label}
      </label>
      <div
        className={cn(
          'flex h-11 items-center gap-2 rounded-md border border-[#c7ccd9] bg-[#ffffff] px-3 transition-colors',
          'focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40',
          error ? 'border-destructive' : '',
        )}
      >
        {leadingAddon ? (
          <span className="select-none font-mono text-xs uppercase tracking-[0.1em] text-[#7f8597]">
            {leadingAddon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-sm text-[#1f2433] placeholder:text-[#9aa0b2]',
            'focus:outline-none',
            className,
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
