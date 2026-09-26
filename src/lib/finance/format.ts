import { siteConfig } from '@/lib/config/site';
import { intlLocales, type Locale } from '@/i18n/config';

type Fmt = {
  currency: Intl.NumberFormat;
  currencyCompact: Intl.NumberFormat;
  percent: Intl.NumberFormat;
  monthYear: Intl.DateTimeFormat;
  fullDate: Intl.DateTimeFormat;
  dateTime: Intl.DateTimeFormat;
};

const cache = new Map<string, Fmt>();

function formatters(locale: Locale = 'fr'): Fmt {
  const intl = intlLocales[locale] ?? siteConfig.currencyLocale;
  let f = cache.get(intl);
  if (!f) {
    f = {
      currency: new Intl.NumberFormat(intl, { style: 'currency', currency: siteConfig.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      currencyCompact: new Intl.NumberFormat(intl, { style: 'currency', currency: siteConfig.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      percent: new Intl.NumberFormat(intl, { minimumFractionDigits: 0, maximumFractionDigits: 2 }),
      monthYear: new Intl.DateTimeFormat(intl, { month: 'short', year: 'numeric' }),
      fullDate: new Intl.DateTimeFormat(intl, { day: '2-digit', month: 'long', year: 'numeric' }),
      dateTime: new Intl.DateTimeFormat(intl, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    cache.set(intl, f);
  }
  return f;
}

/** 30 000,00 € */
export const formatCurrency = (value: number, locale?: Locale): string => formatters(locale).currency.format(value);

/** 30 000 € (sans décimales). */
export const formatCurrencyCompact = (value: number, locale?: Locale): string => formatters(locale).currencyCompact.format(value);

/** 2,5 % */
export const formatPercent = (value: number, locale?: Locale): string => `${formatters(locale).percent.format(value)} %`;

export const formatMonthYear = (date: Date, locale?: Locale): string => formatters(locale).monthYear.format(date);

export const formatFullDate = (date: Date | string, locale?: Locale): string =>
  formatters(locale).fullDate.format(typeof date === 'string' ? new Date(date) : date);

export const formatDateTime = (date: Date | string, locale?: Locale): string =>
  formatters(locale).dateTime.format(typeof date === 'string' ? new Date(date) : date);

const durationWords: Record<Locale, { months: string; year: string; years: string; and: string }> = {
  fr: { months: 'mois', year: 'an', years: 'ans', and: 'et' },
  it: { months: 'mesi', year: 'anno', years: 'anni', and: 'e' },
  es: { months: 'meses', year: 'año', years: 'años', and: 'y' },
  en: { months: 'months', year: 'year', years: 'years', and: 'and' },
  hr: { months: 'mjeseci', year: 'godina', years: 'godine', and: 'i' },
  sl: { months: 'mesecev', year: 'leto', years: 'let', and: 'in' },
  sk: { months: 'mesiacov', year: 'rok', years: 'roky', and: 'a' },
  el: { months: 'μήνες', year: 'έτος', years: 'έτη', and: 'και' },
  nl: { months: 'maanden', year: 'jaar', years: 'jaar', and: 'en' },
  pt: { months: 'meses', year: 'ano', years: 'anos', and: 'e' },
};

/** « 12 mois » / « 2 ans » / « 2 ans et 6 mois » */
export function formatDuration(months: number, locale: Locale = 'fr'): string {
  const w = durationWords[locale];
  if (months < 12) return `${months} ${w.months}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = `${years} ${years > 1 ? w.years : w.year}`;
  return rest === 0 ? y : `${y} ${w.and} ${rest} ${w.months}`;
}
