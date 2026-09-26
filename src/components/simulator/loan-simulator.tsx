'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, Info, MessageCircle, RotateCcw } from 'lucide-react';
import type { LoanProduct, RateMethod, RatePeriod } from '@/lib/config/loans';
import { describeRate } from '@/lib/finance/loan-calculator';
import type { SimulatorSettings } from '@/lib/data/mappers';
import { formatCurrency, formatCurrencyCompact, formatDuration, formatPercent } from '@/lib/finance/format';
import { buildWhatsappLink } from '@/lib/contact';
import { useLoanSimulator } from '@/hooks/use-loan-simulator';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { t } from '@/i18n/format';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';
import { cn } from '@/lib/utils';
import { BalanceChart, CostBreakdownRing } from './charts';
import { ScheduleTable } from './schedule-table';
import { PenaltySimulator } from './penalty-simulator';

interface LoanSimulatorProps {
  products: LoanProduct[];
  settings: SimulatorSettings;
  variant?: 'full' | 'compact';
  initial?: { productSlug?: string; amount?: number; duration?: number };
}

function RangeField({ id, label, value, min, max, step, suffix, onChange, onCommit, format, compact }: { id: string; label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (v: number) => void; onCommit: () => void; format: (v: number) => string; compact?: boolean }) {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-navy-800">{label}</label>
        <div className="relative">
          <input id={id} type="number" inputMode="numeric" className={cn('ef-input w-36 py-2 pr-12 text-right font-semibold tabular-nums', compact && 'w-32')} value={Number.isFinite(value) ? value : ''} min={min} max={max} step={step} onChange={(e) => onChange(e.target.valueAsNumber)} onBlur={onCommit} aria-describedby={`${id}-range-help`} />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-subtle">{suffix}</span>
        </div>
      </div>
      <input type="range" aria-label={label} className="ef-range" style={{ background: `linear-gradient(to right, #29adb2 ${percent}%, #d5e8e8 ${percent}%)` }} value={Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))} min={min} max={max} step={step} onChange={(e) => onChange(e.target.valueAsNumber)} />
      <div id={`${id}-range-help`} className="mt-1.5 flex justify-between text-xs text-ink-subtle">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export function LoanSimulator({ products, settings, variant = 'full', initial }: LoanSimulatorProps) {
  const { locale, dict } = useLocale();
  const s = dict.simulator;
  const sim = useLoanSimulator({ products, settings, initial });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSchedule, setShowSchedule] = useState(variant === 'full');
  const reduce = useReducedMotion();
  const uid = useId();

  const { result, product, bounds, rate } = sim;
  const compact = variant === 'compact';
  const fc = (v: number) => formatCurrency(v, locale);
  const fcc = (v: number) => formatCurrencyCompact(v, locale);

  if (!product || !result) {
    return <div className="card-surface p-8 text-center text-ink-muted">{s.empty}</div>;
  }

  const applyHref = localePath(locale, `/demande?produit=${encodeURIComponent(product.slug)}&montant=${sim.state.amount}&duree=${sim.state.duration}`);
  const whatsappText = t(dict.whatsapp.simulatorContext, { product: product.name, amount: fcc(sim.state.amount), duration: sim.state.duration });
  const summaryKey = `${sim.state.amount}-${sim.state.duration}-${rate.percent}-${rate.period}-${rate.method}`;

  return (
    <div className={cn('grid gap-6', !compact && 'lg:grid-cols-12 lg:gap-8')}>
      {/* Paramètres ---------------------------------------------------- */}
      <div className={cn('card-surface p-5 sm:p-7', !compact && 'lg:col-span-5')}>
        <div className="space-y-6">
          <div>
            <label htmlFor={`${uid}-product`} className="ef-label">{s.product}</label>
            <div className="relative">
              <select id={`${uid}-product`} className="ef-input appearance-none pr-10" value={sim.state.productSlug} onChange={(e) => sim.setProduct(e.target.value)}>
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
            </div>
          </div>

          <RangeField id={`${uid}-amount`} label={s.amount} value={sim.state.amount} min={bounds.minAmount} max={bounds.maxAmount} step={500} suffix="€" onChange={sim.setAmount} onCommit={sim.commitAmount} format={fcc} compact={compact} />
          <RangeField id={`${uid}-duration`} label={s.duration} value={sim.state.duration} min={bounds.minDuration} max={bounds.maxDuration} step={1} suffix={s.months} onChange={sim.setDuration} onCommit={sim.commitDuration} format={(v) => formatDuration(v, locale)} compact={compact} />

          <div className="rounded-xl border border-line bg-surface-2/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm">
                <span className="text-ink-muted">{s.rateApplied} </span>
                <span className="font-semibold text-navy-900">{describeRate(rate, s.rateDesc)}</span>
              </div>
              {sim.isRateOverridden ? <Badge tone="info">{s.rateCustom}</Badge> : <Badge tone="gold">{s.rateFixed}</Badge>}
            </div>

            {settings.allowUserRateOverride && !compact && (
              <>
                <button type="button" onClick={() => setShowAdvanced((v) => !v)} aria-expanded={showAdvanced} aria-controls={`${uid}-advanced`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline">
                  {s.advanced}
                  <ChevronDown className={cn('h-4 w-4 transition-transform', showAdvanced && 'rotate-180')} aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {showAdvanced && (
                    <motion.div id={`${uid}-advanced`} initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduce ? undefined : { height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div>
                          <label htmlFor={`${uid}-rate`} className="ef-label">{s.ratePercent}</label>
                          <input id={`${uid}-rate`} type="number" inputMode="decimal" min={0} max={100} step={0.05} className="ef-input py-2" value={rate.percent} onChange={(e) => { const v = e.target.valueAsNumber; if (Number.isFinite(v)) sim.setRateOverride({ ...rate, percent: Math.min(100, Math.max(0, v)), isPlaceholder: false }); }} />
                        </div>
                        <div>
                          <label htmlFor={`${uid}-period`} className="ef-label">{s.period}</label>
                          <select id={`${uid}-period`} className="ef-input py-2" value={rate.period} onChange={(e) => { const period = e.target.value as RatePeriod; sim.setRateOverride({ ...rate, period, method: period === 'total' ? 'flat' : rate.method, isPlaceholder: false }); }}>
                            <option value="annual">{s.periods.annual}</option>
                            <option value="monthly">{s.periods.monthly}</option>
                            <option value="total">{s.periods.total}</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`${uid}-method`} className="ef-label">{s.method}</label>
                          <select id={`${uid}-method`} className="ef-input py-2" value={rate.method} disabled={rate.period === 'total'} onChange={(e) => sim.setRateOverride({ ...rate, method: e.target.value as RateMethod, isPlaceholder: false })}>
                            <option value="amortizing">{s.methods.amortizing}</option>
                            <option value="flat">{s.methods.flat}</option>
                          </select>
                        </div>
                      </div>
                      {sim.isRateOverridden && (
                        <button type="button" onClick={() => sim.setRateOverride(null)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-navy-900">
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          {s.reset}
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {sim.fees.length === 0 && !compact && (
            <p className="flex items-start gap-2 text-xs text-ink-subtle">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                {s.feesNote}{' '}
                <Link href={localePath(locale, '/frais-et-conditions')} className="font-medium text-brand-700 underline underline-offset-2">{s.feesLink}</Link>
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Résultats ------------------------------------------------------ */}
      <div className={cn('space-y-6', !compact && 'lg:col-span-7')}>
        <div className="relative overflow-hidden rounded-2xl bg-navy-950 p-6 text-white shadow-glow sm:p-8" aria-live="polite">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-sage-300/20 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-300">{s.monthlyEstimate}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={summaryKey} initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="mt-2 font-display text-4xl font-bold tabular-nums sm:text-5xl">
                {fc(result.monthlyPayment)}
                <span className="ml-2 text-base font-medium text-navy-100/70">{s.perMonth}</span>
              </motion.p>
            </AnimatePresence>
            <p className="mt-2 text-sm text-navy-100/75">{t(s.context, { amount: fcc(sim.state.amount), duration: formatDuration(sim.state.duration, locale), product: product.name })}</p>

            <dl className={cn('mt-6 grid gap-4 border-t border-white/10 pt-6 text-sm', compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4')}>
              <div><dt className="text-navy-100/70">{s.principal}</dt><dd className="mt-1 font-semibold tabular-nums">{fc(sim.state.amount)}</dd></div>
              <div><dt className="text-navy-100/70">{s.totalInterest}</dt><dd className="mt-1 font-semibold tabular-nums text-sage-300">{fc(result.totalInterest)}</dd></div>
              {!compact && <div><dt className="text-navy-100/70">{s.feesIncluded}</dt><dd className="mt-1 font-semibold tabular-nums">{fc(result.totalFees)}</dd></div>}
              <div className={cn(compact && 'col-span-2')}><dt className="text-navy-100/70">{s.totalCost}</dt><dd className="mt-1 font-semibold tabular-nums">{fc(result.totalCost)}</dd></div>
            </dl>

            {!compact && (
              <p className="mt-4 text-xs text-navy-100/60">
                {s.totalRepaid} {fc(result.totalRepaid)}
                {result.estimatedApr !== null && <> · {s.apr} {formatPercent(result.estimatedApr, locale)}</>}
              </p>
            )}
          </div>
        </div>

        {compact ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localePath(locale, `/simulateur?produit=${product.slug}&montant=${sim.state.amount}&duree=${sim.state.duration}`)} variant="outline" className="flex-1">
              {s.detailed}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={applyHref} className="flex-1">{s.applyThis}</ButtonLink>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="card-surface p-5">
                <h3 className="mb-4 text-sm font-semibold text-navy-900">{s.breakdownTitle}</h3>
                <CostBreakdownRing result={result} />
              </div>
              <div className="card-surface p-5">
                <h3 className="mb-4 text-sm font-semibold text-navy-900">{s.balanceTitle}</h3>
                <BalanceChart result={result} />
              </div>
            </div>

            {result.feeBreakdown.length > 0 && (
              <div className="card-surface p-5">
                <h3 className="mb-3 text-sm font-semibold text-navy-900">{s.feesDetail}</h3>
                <ul className="divide-y divide-line text-sm">
                  {result.feeBreakdown.map((fee) => (
                    <li key={fee.id} className="flex items-center justify-between py-2">
                      <span className="text-ink-muted">{fee.label} <span className="text-xs text-ink-subtle">({fee.timing === 'upfront' ? s.upfront : s.perInstallment})</span></span>
                      <span className="font-medium tabular-nums">{fc(fee.total)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={applyHref} size="lg" className="flex-1">
                {s.applyThis}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href={buildWhatsappLink(whatsappText)} variant="whatsapp" size="lg" className="flex-1">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {s.whatsappQuestion}
              </ButtonLink>
            </div>

            <p className="rounded-xl border border-line bg-surface-2/60 px-4 py-3 text-sm text-ink-muted">
              <strong className="text-navy-900">{s.disclaimerTitle}</strong> {s.disclaimer}
            </p>

            <div>
              <button type="button" onClick={() => setShowSchedule((v) => !v)} aria-expanded={showSchedule} className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                {s.scheduleToggle}
                <ChevronDown className={cn('h-4 w-4 transition-transform', showSchedule && 'rotate-180')} aria-hidden="true" />
              </button>
              {showSchedule && <ScheduleTable result={result} />}
            </div>

            <PenaltySimulator config={product.penalty.isPlaceholder ? settings.penalty : product.penalty} suggestedInstallment={result.monthlyPayment} />
          </>
        )}
      </div>
    </div>
  );
}
