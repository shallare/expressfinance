import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'gold' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-[background-color,box-shadow,transform,color,border-color] duration-200 ease-out select-none disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98] motion-reduce:active:scale-100';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-[0_8px_20px_-8px_rgba(41,173,178,0.7)] hover:bg-brand-700 hover:shadow-[0_12px_28px_-8px_rgba(41,173,178,0.8)]',
  secondary: 'bg-navy-900 text-white hover:bg-navy-800',
  outline:
    'border border-navy-200 bg-white text-navy-900 hover:border-navy-300 hover:bg-navy-50',
  ghost: 'text-navy-800 hover:bg-navy-50',
  whatsapp:
    'bg-[#25D366] text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.7)] hover:bg-[#1fb857]',
  gold: 'bg-sage-300 text-navy-950 hover:bg-sage-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm sm:text-[0.95rem]',
  lg: 'h-13 px-7 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  external?: boolean;
  'aria-label'?: string;
}

export function ButtonLink({ href, variant = 'primary', size = 'md', className, children, external, ...rest }: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
