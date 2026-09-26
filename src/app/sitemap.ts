import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config/site';
import { getLoanProducts } from '@/lib/data/catalog';
import { localePath, locales } from '@/i18n/config';

const staticPaths: { path: string; changeFrequency: 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/financements', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/simulateur', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/demande', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/frais-et-conditions', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/mentions-legales', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/politique-de-confidentialite', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/conditions-generales', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/politique-cookies', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/avertissement-pret', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const products = await getLoanProducts();
  const allPaths = [
    ...staticPaths,
    ...products.map((p) => ({ path: `/financements/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ];

  return allPaths.flatMap((entry) =>
    locales.map((locale) => ({
      url: `${base}${localePath(locale, entry.path)}`,
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: locale === 'fr' ? entry.priority : Math.max(0.1, entry.priority - 0.1),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}${localePath(l, entry.path)}`])),
      },
    })),
  );
}
