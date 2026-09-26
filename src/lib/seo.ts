import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config/site';
import { localePath, locales, ogLocales, type Locale } from '@/i18n/config';

interface PageMetaOptions {
  title: string;
  description: string;
  /** Chemin sans préfixe de langue (ex. `/simulateur`). */
  path: string;
  locale: Locale;
  noIndex?: boolean;
  keywords?: string[];
}

export const defaultKeywords = [
  'prêt en ligne',
  'financement',
  'prêt personnel',
  'crédit immobilier',
  'financement professionnel',
  'simulation de prêt',
  'financement rapide',
  'prestito online',
  'préstamo en línea',
  'Express Finance',
];

/** Métadonnées cohérentes : canonical, hreflang, Open Graph, Twitter. */
export function buildMetadata({ title, description, path, locale, noIndex, keywords }: PageMetaOptions): Metadata {
  const url = `${siteConfig.url}${localePath(locale, path)}`;
  return {
    title,
    description,
    keywords: keywords ?? defaultKeywords,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}${localePath(l, path)}`])),
        'x-default': `${siteConfig.url}${localePath('fr', path)}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: ogLocales[locale],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  const a = siteConfig.contact.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/logo-mark.svg`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneE164,
    address: { '@type': 'PostalAddress', streetAddress: a.street, postalCode: a.postalCode, addressLocality: a.city, addressCountry: a.countryCode },
    contactPoint: [{ '@type': 'ContactPoint', telephone: siteConfig.contact.phoneE164, contactType: 'customer service', availableLanguage: ['fr', 'it', 'es'] }],
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.question, acceptedAnswer: { '@type': 'Answer', text: i.answer } })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: `${siteConfig.url}${item.path}` })),
  };
}
