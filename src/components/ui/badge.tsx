import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'brand' | 'gold' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  gold: 'bg-sage-100 text-sage-700 ring-sage-200',
  neutral: 'bg-surface-2 text-ink-muted ring-line',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-800 ring-amber-100',
  danger: 'bg-red-50 text-red-700 ring-red-100',
  info: 'bg-sky-50 text-sky-700 ring-sky-100',
};

export function Badge({ children, tone = 'brand', className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Bandeau signalant un contenu provisoire à remplacer par le client. */
export function PlaceholderNotice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      role="note"
      className={cn(
        'rounded-xl border border-dashed border-amber-300 bg-amber-50/80 px-4 py-3 text-sm text-amber-900',
        className,
      )}
    >
      {children}
    </p>
  );
}
