import 'server-only';

import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/i18n';

/** Résout la locale d'une page et son dictionnaire (404 si inconnue). */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<{ locale: Locale; dict: Dictionary }> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, dict: getDictionary(locale) };
}

export function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function num(v: string | string[] | undefined): number | undefined {
  const raw = str(v);
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
