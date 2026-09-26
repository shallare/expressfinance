'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { LoanResult } from '@/lib/finance/loan-calculator';
import { formatCurrency, formatMonthYear } from '@/lib/finance/format';
import { t } from '@/i18n/format';
import { useLocale } from '@/i18n/provider';
import { cn } from '@/lib/utils';

/** Tableau d'amortissement, 12 échéances visibles par défaut. */
export function ScheduleTable({ result }: { result: LoanResult }) {
  const { locale, dict } = useLocale();
  const s = dict.simulator.schedule;
  const [expanded, setExpanded] = useState(false);
  const rows = result.schedule;
  const visible = expanded ? rows : rows.slice(0, 12);
  const hasFees = result.totalFees > 0;
  const fc = (v: number) => formatCurrency(v, locale);

  const totals = useMemo(
    () => ({
      principal: rows.reduce((a, r) => a + r.principal, 0),
      interest: rows.reduce((a, r) => a + r.interest, 0),
      fees: rows.reduce((a, r) => a + r.fees, 0),
      payment: rows.reduce((a, r) => a + r.payment, 0),
    }),
    [rows],
  );

  return (
    <div className="card-surface overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-navy-900">{s.title}</h3>
          <p className="text-xs text-ink-subtle">{t(s.subtitle, { n: rows.length })}</p>
        </div>
        {rows.length > 12 && (
          <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} className="inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50 sm:self-auto">
            {expanded ? s.collapse : t(s.showAll, { n: rows.length })}
            <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <caption className="sr-only">{s.caption}</caption>
          <thead className="bg-surface-2/80 text-left text-xs uppercase tracking-wide text-ink-subtle">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">{s.cols.n}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{s.cols.period}</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">{s.cols.principal}</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">{s.cols.interest}</th>
              {hasFees && <th scope="col" className="px-4 py-3 text-right font-semibold">{s.cols.fees}</th>}
              <th scope="col" className="px-4 py-3 text-right font-semibold">{s.cols.payment}</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">{s.cols.balance}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line tabular-nums">
            {visible.map((row) => (
              <tr key={row.index} className="transition-colors hover:bg-brand-50/40">
                <td className="px-4 py-2.5 text-ink-subtle">{row.index}</td>
                <td className="px-4 py-2.5 capitalize text-ink-muted">{formatMonthYear(row.date, locale)}</td>
                <td className="px-4 py-2.5 text-right">{fc(row.principal)}</td>
                <td className="px-4 py-2.5 text-right text-sage-700">{fc(row.interest)}</td>
                {hasFees && <td className="px-4 py-2.5 text-right text-ink-muted">{fc(row.fees)}</td>}
                <td className="px-4 py-2.5 text-right font-semibold text-navy-900">{fc(row.payment)}</td>
                <td className="px-4 py-2.5 text-right text-ink-muted">{fc(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-navy-100 bg-surface-2/60 font-semibold tabular-nums">
            <tr>
              <td className="px-4 py-3" colSpan={2}>{s.total}</td>
              <td className="px-4 py-3 text-right">{fc(totals.principal)}</td>
              <td className="px-4 py-3 text-right text-sage-700">{fc(totals.interest)}</td>
              {hasFees && <td className="px-4 py-3 text-right">{fc(totals.fees)}</td>}
              <td className="px-4 py-3 text-right text-navy-900">{fc(totals.payment)}</td>
              <td className="px-4 py-3 text-right">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {!expanded && rows.length > 12 && <p className="border-t border-line px-5 py-3 text-xs text-ink-subtle">{t(s.firstShown, { n: rows.length })}</p>}
    </div>
  );
}
