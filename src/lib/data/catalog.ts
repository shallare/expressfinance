import 'server-only';

import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import {
  defaultFees,
  defaultLoanProducts,
  defaultPenaltyConfig,
  defaultRateModel,
  loanLimits,
  type LoanProduct,
} from '@/lib/config/loans';
import { getDemoTestimonials, type Testimonial } from '@/data/testimonials';
import type { Locale } from '@/i18n/config';
import { placeholderPartners, type Partner } from '@/data/partners';
import { isSupabaseConfigured, supabasePublicEnv } from '@/lib/supabase/env';
import type { Database } from '@/types/database';
import {
  mapLoanProduct,
  mapPartner,
  mapSimulatorSettings,
  mapTestimonial,
  type SimulatorSettings,
} from './mappers';

/**
 * Lecture PUBLIQUE du catalogue (produits, réglages, témoignages, partenaires).
 * Utilise un client anonyme sans cookies → compatible avec le cache Next.js et
 * les pages statiques. Se replie sur les données locales si Supabase n'est
 * pas configuré ou indisponible (le site reste toujours fonctionnel).
 */
function publicClient() {
  return createClient<Database>(supabasePublicEnv.url, supabasePublicEnv.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export const CACHE_TAGS = {
  products: 'loan-products',
  settings: 'simulator-settings',
  testimonials: 'testimonials',
  partners: 'partners',
} as const;

const REVALIDATE_SECONDS = 300;

export const defaultSimulatorSettings: SimulatorSettings = {
  rate: defaultRateModel,
  fees: defaultFees,
  penalty: defaultPenaltyConfig,
  minAmount: loanLimits.minAmount,
  maxAmount: loanLimits.maxAmount,
  minDuration: loanLimits.minDuration,
  maxDuration: loanLimits.maxDuration,
  defaultDuration: loanLimits.defaultDuration,
  allowUserRateOverride: true,
};

export const getLoanProducts = unstable_cache(
  async (): Promise<LoanProduct[]> => {
    if (!isSupabaseConfigured) return defaultLoanProducts;
    try {
      const { data, error } = await publicClient()
        .from('loan_products')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (error || !data || data.length === 0) return defaultLoanProducts;
      return data.map(mapLoanProduct);
    } catch {
      return defaultLoanProducts;
    }
  },
  ['loan-products'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] },
);

export async function getLoanProductBySlug(slug: string): Promise<LoanProduct | null> {
  const products = await getLoanProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export const getSimulatorSettings = unstable_cache(
  async (): Promise<SimulatorSettings> => {
    if (!isSupabaseConfigured) return defaultSimulatorSettings;
    try {
      const { data, error } = await publicClient()
        .from('simulator_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (error || !data) return defaultSimulatorSettings;
      return mapSimulatorSettings(data);
    } catch {
      return defaultSimulatorSettings;
    }
  },
  ['simulator-settings'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.settings] },
);

const getTestimonialsFromDb = unstable_cache(
  async (): Promise<Testimonial[] | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await publicClient()
        .from('testimonials')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .limit(12);
      if (error || !data || data.length === 0) return null;
      return data.map(mapTestimonial);
    } catch {
      return null;
    }
  },
  ['testimonials'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.testimonials] },
);

/** Témoignages publiés (base) ou témoignages de lancement dans la langue demandée. */
export async function getTestimonials(locale: Locale = 'fr'): Promise<Testimonial[]> {
  const fromDb = await getTestimonialsFromDb();
  return fromDb ?? getDemoTestimonials(locale);
}

export const getPartners = unstable_cache(
  async (): Promise<Partner[]> => {
    if (!isSupabaseConfigured) return placeholderPartners;
    try {
      const { data, error } = await publicClient()
        .from('partners')
        .select('*')
        .eq('active', true)
        .eq('verified', true)
        .eq('logo_rights_confirmed', true)
        .order('sort_order', { ascending: true })
        .limit(20);
      if (error || !data || data.length === 0) return placeholderPartners;
      return data.map(mapPartner);
    } catch {
      return placeholderPartners;
    }
  },
  ['partners'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.partners] },
);
