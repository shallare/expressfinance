/**
 * Conversion des lignes Supabase vers les types métier (et validation légère
 * des colonnes JSONB pour ne jamais faire confiance aveuglément à la base).
 */
import { z } from 'zod';
import {
  defaultFees,
  defaultPenaltyConfig,
  defaultRateModel,
  type FeeDefinition,
  type LoanProduct,
  type PenaltyConfig,
  type RateModel,
} from '@/lib/config/loans';
import type { Testimonial } from '@/data/testimonials';
import type { Partner } from '@/data/partners';
import type { LoanProductRow, PartnerRow, SimulatorSettingsRow, TestimonialRow } from '@/types/database';

export const rateModelSchema = z.object({
  percent: z.number().min(0).max(100),
  period: z.enum(['annual', 'monthly', 'total']),
  method: z.enum(['amortizing', 'flat']),
  isPlaceholder: z.boolean().default(false),
});

export const feeSchema = z.object({
  id: z.string().min(1).max(60),
  label: z.string().min(1).max(120),
  kind: z.enum(['fixed', 'percent_of_principal']),
  value: z.number().min(0).max(1_000_000),
  timing: z.enum(['upfront', 'monthly']),
  description: z.string().max(400).optional(),
});

export const feesSchema = z.array(feeSchema).max(10);

export const penaltySchema = z.object({
  gracePeriodDays: z.number().int().min(0).max(365),
  fixedFee: z.number().min(0).max(100_000),
  percentOfInstallment: z.number().min(0).max(100),
  lateInterestAnnualPercent: z.number().min(0).max(100),
  isPlaceholder: z.boolean().default(false),
});

export function parseRateModel(json: unknown, percent: number, fallback: RateModel = defaultRateModel): RateModel {
  const parsed = rateModelSchema.partial().safeParse(json);
  if (!parsed.success) return { ...fallback, percent };
  return {
    percent,
    period: parsed.data.period ?? fallback.period,
    method: parsed.data.method ?? fallback.method,
    isPlaceholder: parsed.data.isPlaceholder ?? fallback.isPlaceholder,
  };
}

export function parseFees(json: unknown): FeeDefinition[] {
  const parsed = feesSchema.safeParse(json);
  return parsed.success ? parsed.data : defaultFees;
}

export function parsePenalty(json: unknown): PenaltyConfig {
  const parsed = penaltySchema.safeParse(json);
  return parsed.success ? parsed.data : defaultPenaltyConfig;
}

const allowedIcons = ['User', 'Home', 'ShoppingBag', 'Briefcase', 'Rocket', 'Layers'] as const;

export function mapLoanProduct(row: LoanProductRow): LoanProduct {
  const icon = (allowedIcons as readonly string[]).includes(row.icon)
    ? (row.icon as LoanProduct['icon'])
    : 'Layers';
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    icon,
    tagline: row.tagline,
    description: row.description,
    longDescription: row.long_description,
    minAmount: Number(row.min_amount),
    maxAmount: Number(row.max_amount),
    minDuration: row.min_duration,
    maxDuration: row.max_duration,
    defaultDuration: row.default_duration,
    rate: parseRateModel(row.rate_type, Number(row.interest_rate)),
    fees: parseFees(row.fees),
    penalty: parsePenalty(row.penalty_configuration),
    keyConditions: row.key_conditions ?? [],
    useCases: row.use_cases ?? [],
    requiredDocuments: row.required_documents ?? [],
    active: row.active,
    sortOrder: row.sort_order,
  };
}

export interface SimulatorSettings {
  rate: RateModel;
  fees: FeeDefinition[];
  penalty: PenaltyConfig;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  defaultDuration: number;
  allowUserRateOverride: boolean;
}

export function mapSimulatorSettings(row: SimulatorSettingsRow): SimulatorSettings {
  const rate = rateModelSchema.safeParse(row.rate_model);
  return {
    rate: rate.success ? rate.data : defaultRateModel,
    fees: parseFees(row.fees),
    penalty: parsePenalty(row.penalty_configuration),
    minAmount: Number(row.min_amount),
    maxAmount: Number(row.max_amount),
    minDuration: row.min_duration,
    maxDuration: row.max_duration,
    defaultDuration: row.default_duration,
    allowUserRateOverride: row.allow_user_rate_override,
  };
}

export function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    content: row.content,
    loanType: row.loan_type,
    imageUrl: row.image_url,
    rating: row.rating,
    date: row.published_on ?? row.created_at,
    location: row.location ?? undefined,
    isDemo: false,
  };
}

export function mapPartner(row: PartnerRow): Partner {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    website: row.website,
    verified: row.verified,
    isPlaceholder: false,
  };
}
