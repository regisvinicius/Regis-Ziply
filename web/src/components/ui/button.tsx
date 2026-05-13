import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from './spinner';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-6 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    fullWidth = false,
    disabled,
    children,
    type,
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  const isButton = !asChild;
  return (
    <Comp
      ref={ref}
      data-slot="button"
      // Slot forwards props to a single child element. When wrapping a Link
      // we cannot pass `type` or `disabled`, so guard those.
      {...(isButton ? { type: type ?? 'button', disabled: disabled || loading } : {})}
      className={cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className)}
      {...rest}
    >
      {loading ? <Spinner aria-hidden /> : null}
      {children}
    </Comp>
  );
});

export { buttonVariants };
