import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Fond : clair (défaut), gris doux, ou navy sombre. */
  tone?: 'default' | 'muted' | 'dark';
  padding?: 'default' | 'compact' | 'none';
  ariaLabelledBy?: string;
}

export function Section({ id, children, className, tone = 'default', padding = 'default', ariaLabelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'relative',
        tone === 'muted' && 'bg-surface-2/70',
        tone === 'dark' && 'bg-navy-950 text-white',
        padding === 'default' && 'py-16 sm:py-20 lg:py-28',
        padding === 'compact' && 'py-10 sm:py-14',
        className,
      )}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  id?: string;
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, align = 'center', tone = 'light', id, className }: SectionHeaderProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-xs font-semibold uppercase tracking-[0.22em]',
            tone === 'dark' ? 'text-sage-300' : 'text-brand-600',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          'text-3xl font-bold sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]',
          tone === 'dark' && 'text-white',
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('mt-4 text-base leading-relaxed sm:text-lg', tone === 'dark' ? 'text-navy-100/80' : 'text-ink-muted')}>
          {description}
        </p>
      )}
    </div>
  );
}
