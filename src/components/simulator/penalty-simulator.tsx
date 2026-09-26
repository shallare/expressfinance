'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import type { PenaltyConfig } from '@/lib/config/loans';
import { calculatePenalty } from '@/lib/finance/penalty-calculator';
import { formatCurrency } from '@/lib/finance/format';
import { Badge } from '@/components/ui/badge';
import { t } from '@/i18n/format';
import { useLocale } from '@/i18n/provider';

interface PenaltySimulatorProps {
  config: PenaltyConfig;
  suggestedInstallment: number;
}

function NumberField({ id, label, value, onChange, suffix, min = 0, max, step = 1, help }: { id: string; label: string; value: number; onChange: (v: number) => void; suffix: string; min?: number; max?: number; step?: number; help?: string }) {
  return (
    <div>
      <label htmlFor={id} className="ef-label">{label}</label>
      <div className="relative">
        <input id={id} type="number" inputMode="decimal" className="ef-input pr-14" value={Number.isFinite(value) ? value : ''} min={min} max={max} step={step} onChange={(e) => onChange(e.target.valueAsNumber)} />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-ink-subtle">{suffix}</span>
      </div>
      {help && <p className="ef-help">{help}</p>}
    </div>
  );
}

export function PenaltySimulator({ config, suggestedInstallment }: PenaltySimulatorProps) {
  const { locale, dict } = useLocale();
  const s = dict.simulator.penalty;
  const [installment, setInstallment] = useState(Math.round(suggestedInstallment * 100) / 100);
  const [daysLate, setDaysLate] = useState(30);
  const [grace, setGrace] = useState(config.gracePeriodDays);
  const [fixedFee, setFixedFee] = useState(config.fixedFee);
  const [percent, setPercent] = useState(config.percentOfInstallment);
  const [lateRate, setLateRate] = useState(config.lateInterestAnnualPercent);
  const fc = (v: number) => formatCurrency(v, locale);

  const result = useMemo(
    () =>
      calculatePenalty({
        installmentAmount: installment || 0,
        daysLate: daysLate || 0,
        config: { gracePeriodDays: grace || 0, fixedFee: fixedFee || 0, percentOfInstallment: percent || 0, lateInterestAnnualPercent: lateRate || 0, isPlaceholder: false },
      }),
    [installment, daysLate, grace, fixedFee, percent, lateRate],
  );

  return (
    <div className="card-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
            <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
            {s.title}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">{s.subtitle}</p>
        </div>
        <Badge tone="info">{s.badge}</Badge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NumberField id="pen-installment" label={s.installment} value={installment} onChange={setInstallment} suffix="€" step={0.01} />
        <NumberField id="pen-days" label={s.days} value={daysLate} onChange={setDaysLate} suffix={s.daysUnit} max={365} />
        <NumberField id="pen-grace" label={s.grace} value={grace} onChange={setGrace} suffix={s.daysUnit} max={365} help={s.graceHelp} />
        <NumberField id="pen-fixed" label={s.fixed} value={fixedFee} onChange={setFixedFee} suffix="€" step={0.01} />
        <NumberField id="pen-percent" label={s.percent} value={percent} onChange={setPercent} suffix="%" step={0.1} max={100} help={s.percentHelp} />
        <NumberField id="pen-rate" label={s.rate} value={lateRate} onChange={setLateRate} suffix="%" step={0.1} max={100} help={s.rateHelp} />
      </div>

      <div className="mt-6 rounded-2xl bg-navy-950 p-5 text-white" aria-live="polite">
        {result.withinGracePeriod ? (
          <p className="text-sm text-navy-100">
            {t(s.withinGrace, { d: daysLate || 0 })} <strong className="text-white">{s.noPenalty}</strong>
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-navy-100/80">{s.penalizedDays}</dt><dd className="font-medium tabular-nums">{result.penalizedDays}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-navy-100/80">{s.fixedFee}</dt><dd className="tabular-nums">{fc(result.fixedFee)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-navy-100/80">{s.percentPenalty}</dt><dd className="tabular-nums">{fc(result.percentPenalty)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-navy-100/80">{s.lateInterest}</dt><dd className="tabular-nums">{fc(result.lateInterest)}</dd></div>
            </dl>
            <div className="flex flex-col justify-center rounded-xl bg-white/10 p-4">
              <span className="text-xs uppercase tracking-wide text-navy-100/70">{s.extraCost}</span>
              <span className="mt-1 font-display text-2xl font-bold text-sage-300 tabular-nums">{fc(result.totalPenalty)}</span>
              <span className="mt-2 text-xs text-navy-100/80">{s.totalDue} <strong className="text-white">{fc(result.totalDue)}</strong></span>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-ink-subtle">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {s.note}
      </p>
    </div>
  );
}
