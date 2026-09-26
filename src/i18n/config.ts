export const locales = ['fr', 'it', 'es', 'en', 'hr', 'sl', 'sk', 'el', 'nl', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

/** Nom de la langue dans sa propre langue (affiché dans le sélecteur). */
export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  en: 'English',
  hr: 'Hrvatski',
  sl: 'Slovenščina',
  sk: 'Slovenčina',
  el: 'Ελληνικά',
  nl: 'Nederlands',
  pt: 'Português',
};

/** Drapeau (fichier dans public/flags). */
export const localeFlags: Record<Locale, string> = {
  fr: 'fr',
  it: 'it',
  es: 'es',
  en: 'gb',
  hr: 'hr',
  sl: 'si',
  sk: 'sk',
  el: 'gr',
  nl: 'nl',
  pt: 'pt',
};

/** Locale Intl utilisée pour les montants et les dates. */
export const intlLocales: Record<Locale, string> = {
  fr: 'fr-BE',
  it: 'it-IT',
  es: 'es-ES',
  en: 'en-GB',
  hr: 'hr-HR',
  sl: 'sl-SI',
  sk: 'sk-SK',
  el: 'el-GR',
  nl: 'nl-BE',
  pt: 'pt-PT',
};

/** Locale Open Graph. */
export const ogLocales: Record<Locale, string> = {
  fr: 'fr_BE',
  it: 'it_IT',
  es: 'es_ES',
  en: 'en_GB',
  hr: 'hr_HR',
  sl: 'sl_SI',
  sk: 'sk_SK',
  el: 'el_GR',
  nl: 'nl_BE',
  pt: 'pt_PT',
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Préfixe d'URL : la langue par défaut n'a pas de préfixe. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean === '/' ? '/' : clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

/** Retire le préfixe de langue d'un chemin. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split('/');
  const candidate = segments[1];
  if (isLocale(candidate) && candidate !== defaultLocale) {
    const rest = `/${segments.slice(2).join('/')}`;
    return { locale: candidate, path: rest === '/' ? '/' : rest.replace(/\/$/, '') };
  }
  return { locale: defaultLocale, path: pathname === '' ? '/' : pathname };
}
