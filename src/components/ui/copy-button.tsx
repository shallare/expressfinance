'use client';

import { useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CopyButton({ value, children, className, copiedLabel = 'Copié !' }: { value: string; children: ReactNode; className?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* presse-papiers indisponible */
        }
      }}
      className={cn('inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100/60', className)}
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {copiedLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
