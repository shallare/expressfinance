'use client';

import { useId } from 'react';
import type { LoanResult } from '@/lib/finance/loan-calculator';
import { formatCurrency, formatCurrencyCompact } from '@/lib/finance/format';
import { t } from '@/i18n/format';
import { useLocale } from '@/i18n/provider';

/* Répartition capital / intérêts / frais (anneau) ------------------------- */

export function CostBreakdownRing({ result }: { result: LoanResult }) {
  const id = useId();
  const { locale, dict } = useLocale();
  const s = dict.simulator.charts;
  const principal = result.input.principal;
  const total = result.totalCost || 1;
  const parts = [
    { label: s.capital, value: principal, color: '#1f8f94' },
    { label: s.interest, value: result.totalInterest, color: '#86b58d' },
    { label: s.fees, value: result.totalFees, color: '#94a3b8' },
  ].filter((p) => p.value > 0);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <figure className="flex flex-wrap items-center gap-4 sm:gap-5" aria-labelledby={`${id}-title`}>
      <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0 -rotate-90 sm:h-32 sm:w-32" role="img" aria-describedby={`${id}-desc`}>
        <title id={`${id}-title`}>{s.breakdown}</title>
        <desc id={`${id}-desc`}>{parts.map((p) => `${p.label} : ${formatCurrency(p.value, locale)}`).join(', ')}</desc>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#eef2f8" strokeWidth="12" />
        {parts.map((p) => {
          const length = (p.value / total) * circumference;
          const el = (
            <circle key={p.label} cx="50" cy="50" r={radius} fill="none" stroke={p.color} strokeWidth="12" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset} className="transition-[stroke-dasharray,stroke-dashoffset] duration-500 ease-out" />
          );
          offset += length;
          return el;
        })}
      </svg>
      <figcaption className="min-w-[9rem] flex-1 space-y-2 text-sm">
        {parts.map((p) => (
          <div key={p.label} className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} aria-hidden="true" />
            <span className="text-ink-muted">{p.label}</span>
            <span className="ml-auto font-semibold tabular-nums text-navy-900">{Math.round((p.value / total) * 100)} %</span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}

/* Évolution du capital restant dû (aire) ---------------------------------- */

export function BalanceChart({ result }: { result: LoanResult }) {
  const id = useId();
  const { locale, dict } = useLocale();
  const s = dict.simulator.charts;
  const points = [result.input.principal, ...result.schedule.map((r) => r.remainingBalance)];
  const n = points.length;
  const width = 320;
  const height = 120;
  const max = result.input.principal || 1;

  const coords = points.map((v, i) => [(i / Math.max(1, n - 1)) * width, height - (v / max) * (height - 8) - 4] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const midIndex = Math.floor((n - 1) / 2);

  return (
    <figure aria-labelledby={`${id}-title`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full" role="img" preserveAspectRatio="none">
        <title id={`${id}-title`}>{s.balance}</title>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#29adb2" stopOpacity="0.35" />
            <stop offset="1" stopColor="#29adb2" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${id}-fill)`} />
        <path d={line} fill="none" stroke="#1f8f94" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="mt-1 flex justify-between text-[11px] text-ink-subtle">
        <span>{s.start} {formatCurrencyCompact(points[0], locale)}</span>
        <span>{t(s.month, { n: midIndex })} {formatCurrencyCompact(points[midIndex], locale)}</span>
        <span>{s.end}</span>
      </figcaption>
    </figure>
  );
}
