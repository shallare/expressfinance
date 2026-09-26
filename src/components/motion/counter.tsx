'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { formatCurrencyCompact } from '@/lib/finance/format';

/** Formats sérialisables (le composant est client : pas de fonction en prop). */
const formatters = {
  number: (n: number) => n.toLocaleString('fr-BE'),
  currency: formatCurrencyCompact,
  months: (n: number) => `${n} mois`,
} as const;

interface CounterProps {
  value: number;
  format?: keyof typeof formatters;
  durationMs?: number;
  className?: string;
}

/** Compteur animé à l'entrée dans le viewport (statique si reduced-motion). */
export function Counter({ value, format: formatKey = 'number', durationMs = 1400, className }: CounterProps) {
  const format = formatters[formatKey];
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, durationMs, reduce]);

  return (
    <span ref={ref} className={className} aria-label={format(value)}>
      {format(display)}
    </span>
  );
}
