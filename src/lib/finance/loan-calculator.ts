/**
 * ============================================================================
 *  MOTEUR DE CALCUL DE PRÊT
 * ============================================================================
 *  Fonctions pures, sans dépendance, utilisables côté client comme côté
 *  serveur. Toutes les valeurs monétaires sont arrondies au centime ; la
 *  dernière échéance absorbe l'écart d'arrondi afin que le capital restant dû
 *  final soit exactement 0.
 * ============================================================================
 */

import { round2 } from '@/lib/utils';
import type { FeeDefinition, RateModel } from '@/lib/config/loans';

export interface LoanInput {
  principal: number;
  /** Durée en mois. */
  durationMonths: number;
  rate: RateModel;
  fees?: FeeDefinition[];
  /** Date de la première échéance (par défaut : mois suivant). */
  firstPaymentDate?: Date;
}

export interface ScheduleRow {
  index: number;
  date: Date;
  principal: number;
  interest: number;
  fees: number;
  /** principal + interest + fees */
  payment: number;
  remainingBalance: number;
}

export interface FeeBreakdownItem {
  id: string;
  label: string;
  timing: FeeDefinition['timing'];
  /** Montant total sur la vie du prêt. */
  total: number;
  /** Montant par échéance (frais mensuels) ou montant unique (frais initiaux). */
  perOccurrence: number;
}

export interface LoanResult {
  input: LoanInput;
  /** Mensualité hors frais initiaux (capital + intérêts + frais mensuels). */
  monthlyPayment: number;
  /** Capital + intérêts, sans frais. */
  monthlyPaymentExcludingFees: number;
  totalInterest: number;
  totalFees: number;
  upfrontFees: number;
  monthlyFees: number;
  /** Capital + intérêts. */
  totalRepaid: number;
  /** Capital + intérêts + tous frais. */
  totalCost: number;
  /** Coût total du crédit = intérêts + frais. */
  costOfCredit: number;
  /** Taux mensuel effectivement appliqué au calcul. */
  effectiveMonthlyRate: number;
  /** Estimation du taux annuel effectif global (TAEG) — méthode actuarielle. */
  estimatedApr: number | null;
  feeBreakdown: FeeBreakdownItem[];
  schedule: ScheduleRow[];
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Convertit le modèle de taux en taux mensuel décimal (ex. 0.0016667). */
export function monthlyRateFromModel(rate: RateModel): number {
  const r = rate.percent / 100;
  switch (rate.period) {
    case 'annual':
      return r / 12;
    case 'monthly':
      return r;
    case 'total':
      // Un taux « total » n'a de sens qu'en méthode flat : il est traité à part.
      return 0;
  }
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay));
  return d;
}

export function defaultFirstPaymentDate(from = new Date()): Date {
  return addMonths(new Date(from.getFullYear(), from.getMonth(), from.getDate()), 1);
}

function computeFeeBreakdown(
  fees: FeeDefinition[],
  principal: number,
  durationMonths: number,
): FeeBreakdownItem[] {
  return fees.map((fee) => {
    const base =
      fee.kind === 'fixed' ? fee.value : round2((principal * fee.value) / 100);
    const perOccurrence = round2(base);
    const total = fee.timing === 'monthly' ? round2(perOccurrence * durationMonths) : perOccurrence;
    return { id: fee.id, label: fee.label, timing: fee.timing, total, perOccurrence };
  });
}

/* -------------------------------------------------------------------------- */
/*  Calcul principal                                                          */
/* -------------------------------------------------------------------------- */

export function calculateLoan(input: LoanInput): LoanResult {
  const principal = Math.max(0, input.principal);
  const n = Math.max(1, Math.round(input.durationMonths));
  const fees = input.fees ?? [];
  const firstDate = input.firstPaymentDate ?? defaultFirstPaymentDate();

  const feeBreakdown = computeFeeBreakdown(fees, principal, n);
  const upfrontFees = round2(
    feeBreakdown.filter((f) => f.timing === 'upfront').reduce((s, f) => s + f.total, 0),
  );
  const monthlyFees = round2(
    feeBreakdown.filter((f) => f.timing === 'monthly').reduce((s, f) => s + f.perOccurrence, 0),
  );

  const schedule: ScheduleRow[] = [];
  let totalInterest = 0;
  let paymentExclFees = 0;
  let monthlyRate = monthlyRateFromModel(input.rate);

  if (input.rate.method === 'amortizing' && input.rate.period !== 'total') {
    /* ---- Amortissement constant (mensualité fixe) ------------------------- */
    paymentExclFees =
      monthlyRate === 0
        ? principal / n
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
    paymentExclFees = round2(paymentExclFees);

    let balance = principal;
    for (let i = 1; i <= n; i += 1) {
      const interest = round2(balance * monthlyRate);
      let principalPart = round2(paymentExclFees - interest);
      if (i === n) principalPart = round2(balance); // absorbe l'écart d'arrondi
      balance = round2(balance - principalPart);
      const payment = round2(principalPart + interest + monthlyFees);
      totalInterest = round2(totalInterest + interest);
      schedule.push({
        index: i,
        date: addMonths(firstDate, i - 1),
        principal: principalPart,
        interest,
        fees: monthlyFees,
        payment,
        remainingBalance: Math.max(0, balance),
      });
    }
  } else {
    /* ---- Intérêt simple (flat) -------------------------------------------- */
    let totalFlatInterest: number;
    if (input.rate.period === 'total') {
      totalFlatInterest = round2((principal * input.rate.percent) / 100);
      monthlyRate = n > 0 ? totalFlatInterest / principal / n : 0;
    } else {
      totalFlatInterest = round2(principal * monthlyRate * n);
    }
    const interestPerMonth = round2(totalFlatInterest / n);
    const principalPerMonth = round2(principal / n);
    paymentExclFees = round2(principalPerMonth + interestPerMonth);

    let balance = principal;
    let interestLeft = totalFlatInterest;
    for (let i = 1; i <= n; i += 1) {
      let principalPart = principalPerMonth;
      let interest = interestPerMonth;
      if (i === n) {
        principalPart = round2(balance);
        interest = round2(interestLeft);
      }
      balance = round2(balance - principalPart);
      interestLeft = round2(interestLeft - interest);
      totalInterest = round2(totalInterest + interest);
      schedule.push({
        index: i,
        date: addMonths(firstDate, i - 1),
        principal: principalPart,
        interest,
        fees: monthlyFees,
        payment: round2(principalPart + interest + monthlyFees),
        remainingBalance: Math.max(0, balance),
      });
    }
  }

  const totalFees = round2(upfrontFees + monthlyFees * n);
  const totalRepaid = round2(principal + totalInterest);
  const totalCost = round2(totalRepaid + totalFees);

  const estimatedApr = estimateApr({
    principal,
    upfrontFees,
    payments: schedule.map((r) => r.payment),
  });

  return {
    input,
    monthlyPayment: round2(paymentExclFees + monthlyFees),
    monthlyPaymentExcludingFees: paymentExclFees,
    totalInterest,
    totalFees,
    upfrontFees,
    monthlyFees,
    totalRepaid,
    totalCost,
    costOfCredit: round2(totalInterest + totalFees),
    effectiveMonthlyRate: monthlyRate,
    estimatedApr,
    feeBreakdown,
    schedule,
  };
}

/* -------------------------------------------------------------------------- */
/*  TAEG estimatif (taux actuariel annuel)                                    */
/* -------------------------------------------------------------------------- */

/**
 * Résout le taux mensuel `i` tel que :
 *   principal − upfrontFees = Σ payments[k] / (1 + i)^(k+1)
 * puis l'annualise : (1 + i)^12 − 1. Résolution par bissection (robuste).
 * Retourne `null` si aucune solution n'existe (ex. montant nul).
 */
export function estimateApr(args: {
  principal: number;
  upfrontFees: number;
  payments: number[];
}): number | null {
  const net = args.principal - args.upfrontFees;
  if (net <= 0 || args.payments.length === 0) return null;
  const totalPaid = args.payments.reduce((s, p) => s + p, 0);
  if (totalPaid <= net) return 0;

  const npv = (i: number) =>
    args.payments.reduce((s, p, k) => s + p / Math.pow(1 + i, k + 1), 0) - net;

  let lo = 0;
  let hi = 1; // 100 % mensuel : borne haute largement suffisante
  if (npv(hi) > 0) return null;
  for (let iter = 0; iter < 200; iter += 1) {
    const mid = (lo + hi) / 2;
    if (npv(mid) > 0) lo = mid;
    else hi = mid;
    if (hi - lo < 1e-10) break;
  }
  const monthly = (lo + hi) / 2;
  return round2((Math.pow(1 + monthly, 12) - 1) * 100);
}

/* -------------------------------------------------------------------------- */
/*  Libellés                                                                  */
/* -------------------------------------------------------------------------- */

export interface RateDescriptionLabels {
  perYear: string;
  perMonth: string;
  flatTotal: string;
  amortizing: string;
  flat: string;
  fixed: string;
}

/** Libellé lisible du modèle de taux, ex. « 2 % fixe par an · amortissement constant ». */
export function describeRate(rate: RateModel, d: RateDescriptionLabels): string {
  const value = `${rate.percent.toLocaleString('fr-BE', { maximumFractionDigits: 2 })} %`;
  const period = rate.period === 'annual' ? d.perYear : rate.period === 'monthly' ? d.perMonth : d.flatTotal;
  const method = rate.method === 'amortizing' ? d.amortizing : d.flat;
  return `${value} ${d.fixed} ${period} · ${method}`;
}
