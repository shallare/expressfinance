/**
 * Simulation de pénalités de retard.
 *
 * Règle appliquée (transparente et documentée dans l'interface) :
 *   1. Si le retard est inférieur ou égal au délai de grâce → aucune pénalité.
 *   2. Au-delà :
 *        frais fixes
 *      + pénalité forfaitaire (% de l'échéance impayée)
 *      + intérêts de retard = échéance × taux annuel × (jours au-delà du délai
 *        de grâce / 365)
 *
 * Les valeurs contractuelles réelles dépendent du contrat signé : le barème
 * par défaut est vide tant que le client ne l'a pas communiqué.
 */

import { round2 } from '@/lib/utils';
import type { PenaltyConfig } from '@/lib/config/loans';

export interface PenaltyInput {
  /** Montant de l'échéance impayée (€). */
  installmentAmount: number;
  /** Nombre de jours de retard par rapport à la date d'échéance. */
  daysLate: number;
  config: PenaltyConfig;
}

export interface PenaltyResult {
  withinGracePeriod: boolean;
  /** Jours de retard effectivement pénalisés (au-delà du délai de grâce). */
  penalizedDays: number;
  fixedFee: number;
  percentPenalty: number;
  lateInterest: number;
  totalPenalty: number;
  /** Échéance + pénalités. */
  totalDue: number;
}

export function calculatePenalty(input: PenaltyInput): PenaltyResult {
  const installment = Math.max(0, input.installmentAmount);
  const daysLate = Math.max(0, Math.floor(input.daysLate));
  const { gracePeriodDays, fixedFee, percentOfInstallment, lateInterestAnnualPercent } =
    input.config;

  const penalizedDays = Math.max(0, daysLate - Math.max(0, gracePeriodDays));
  const withinGracePeriod = daysLate === 0 || penalizedDays === 0;

  if (withinGracePeriod) {
    return {
      withinGracePeriod: true,
      penalizedDays: 0,
      fixedFee: 0,
      percentPenalty: 0,
      lateInterest: 0,
      totalPenalty: 0,
      totalDue: round2(installment),
    };
  }

  const fixed = round2(Math.max(0, fixedFee));
  const percentPenalty = round2((installment * Math.max(0, percentOfInstallment)) / 100);
  const lateInterest = round2(
    (installment * Math.max(0, lateInterestAnnualPercent) * penalizedDays) / 100 / 365,
  );
  const totalPenalty = round2(fixed + percentPenalty + lateInterest);

  return {
    withinGracePeriod: false,
    penalizedDays,
    fixedFee: fixed,
    percentPenalty,
    lateInterest,
    totalPenalty,
    totalDue: round2(installment + totalPenalty),
  };
}
