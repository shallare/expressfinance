import type { Dictionary } from '@/i18n/dictionaries/fr';

export interface NavItem {
  /** Clé dans `dict.nav`. */
  key: keyof Dictionary['nav'];
  /** Chemin sans préfixe de langue. */
  href: string;
}

export const mainNavigation: NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'financing', href: '/financements' },
  { key: 'simulator', href: '/simulateur' },
  { key: 'howItWorks', href: '/#comment-ca-marche' },
  { key: 'faq', href: '/#faq' },
  { key: 'contact', href: '/contact' },
];

export const productSlugs = [
  'pret-personnel',
  'credit-immobilier',
  'credit-consommation',
  'financement-professionnel',
  'financement-de-projet',
  'autres-solutions',
] as const;

export const footerServiceLinks: { key: keyof Dictionary['footer']['links']; href: string }[] = [
  { key: 'simulate', href: '/simulateur' },
  { key: 'apply', href: '/demande' },
  { key: 'fees', href: '/frais-et-conditions' },
  { key: 'faq', href: '/#faq' },
  { key: 'contact', href: '/contact' },
];

export const legalLinks: { key: keyof Dictionary['legalNav']; href: string }[] = [
  { key: 'mentions', href: '/mentions-legales' },
  { key: 'privacy', href: '/politique-de-confidentialite' },
  { key: 'terms', href: '/conditions-generales' },
  { key: 'cookies', href: '/politique-cookies' },
  { key: 'disclaimer', href: '/avertissement-pret' },
];
