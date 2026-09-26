'use client';

import { useCallback, useMemo, useState } from 'react';
import type { FeeDefinition, LoanProduct, RateModel } from '@/lib/config/loans';
import { calculateLoan, type LoanResult } from '@/lib/finance/loan-calculator';
import type { SimulatorSettings } from '@/lib/data/mappers';
import { clamp } from '@/lib/utils';

export interface SimulatorState {
  productSlug: string;
  amount: number;
  duration: number;
  /** Taux personnalisé par l'utilisateur (null = taux du produit). */
  rateOverride: RateModel | null;
}

interface UseLoanSimulatorArgs {
  products: LoanProduct[];
  settings: SimulatorSettings;
  initial?: Partial<Pick<SimulatorState, 'productSlug' | 'amount' | 'duration'>>;
}

export function useLoanSimulator({ products, settings, initial }: UseLoanSimulatorArgs) {
  const firstProduct = products[0];
  const initialProduct =
    products.find((p) => p.slug === initial?.productSlug) ?? firstProduct;

  const [state, setState] = useState<SimulatorState>(() => ({
    productSlug: initialProduct?.slug ?? '',
    amount: clamp(
      initial?.amount ?? 30_000,
      initialProduct?.minAmount ?? settings.minAmount,
      initialProduct?.maxAmount ?? settings.maxAmount,
    ),
    duration: clamp(
      initial?.duration ?? initialProduct?.defaultDuration ?? settings.defaultDuration,
      initialProduct?.minDuration ?? settings.minDuration,
      initialProduct?.maxDuration ?? settings.maxDuration,
    ),
    rateOverride: null,
  }));

  const product = useMemo(
    () => products.find((p) => p.slug === state.productSlug) ?? firstProduct,
    [products, state.productSlug, firstProduct],
  );

  const bounds = useMemo(
    () => ({
      minAmount: product?.minAmount ?? settings.minAmount,
      maxAmount: product?.maxAmount ?? settings.maxAmount,
      minDuration: product?.minDuration ?? settings.minDuration,
      maxDuration: product?.maxDuration ?? settings.maxDuration,
    }),
    [product, settings],
  );

  /** Taux effectivement utilisé : override utilisateur > produit > réglages globaux. */
  const rate: RateModel = state.rateOverride ?? product?.rate ?? settings.rate;
  /** Frais : ceux du produit s'il en définit, sinon les frais globaux. */
  const fees: FeeDefinition[] = product && product.fees.length > 0 ? product.fees : settings.fees;

  const result: LoanResult | null = useMemo(() => {
    if (!product) return null;
    return calculateLoan({
      principal: state.amount,
      durationMonths: state.duration,
      rate,
      fees,
    });
  }, [product, state.amount, state.duration, rate, fees]);

  const setProduct = useCallback(
    (slug: string) => {
      const next = products.find((p) => p.slug === slug);
      if (!next) return;
      setState((s) => ({
        ...s,
        productSlug: slug,
        amount: clamp(s.amount, next.minAmount, next.maxAmount),
        duration: clamp(s.duration, next.minDuration, next.maxDuration),
      }));
    },
    [products],
  );

  const setAmount = useCallback(
    (amount: number) =>
      setState((s) => ({ ...s, amount: Number.isFinite(amount) ? amount : s.amount })),
    [],
  );

  const commitAmount = useCallback(
    () => setState((s) => ({ ...s, amount: clamp(Math.round(s.amount), bounds.minAmount, bounds.maxAmount) })),
    [bounds],
  );

  const setDuration = useCallback(
    (duration: number) =>
      setState((s) => ({ ...s, duration: Number.isFinite(duration) ? Math.round(duration) : s.duration })),
    [],
  );

  const commitDuration = useCallback(
    () => setState((s) => ({ ...s, duration: clamp(s.duration, bounds.minDuration, bounds.maxDuration) })),
    [bounds],
  );

  const setRateOverride = useCallback(
    (override: RateModel | null) => setState((s) => ({ ...s, rateOverride: override })),
    [],
  );

  return {
    state,
    product,
    products,
    bounds,
    rate,
    fees,
    result,
    isRateOverridden: state.rateOverride !== null,
    setProduct,
    setAmount,
    commitAmount,
    setDuration,
    commitDuration,
    setRateOverride,
  };
}

export type LoanSimulatorController = ReturnType<typeof useLoanSimulator>;
