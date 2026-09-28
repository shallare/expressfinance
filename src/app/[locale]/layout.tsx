import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config/site';
import { fontClassName } from '@/lib/fonts';
import { defaultKeywords, organizationJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { GoogleTag } from '@/components/analytics/google-tag';
import { SplashScreen } from '@/components/layout/splash-screen';
import { RouteProgress } from '@/components/layout/route-progress';
import { Suspense } from 'react';
import { isLocale, localePath, locales, ogLocales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { LocaleProvider } from '@/i18n/provider';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'fr';
  const dict = getDictionary(l);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.meta.siteTitle, template: `%s | ${siteConfig.name}` },
    description: dict.meta.siteDescription,
    keywords: defaultKeywords,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
      canonical: `${siteConfig.url}${localePath(l, '/')}`,
      languages: Object.fromEntries(locales.map((x) => [x, `${siteConfig.url}${localePath(x, '/')}`])),
    },
    openGraph: {
      type: 'website',
      locale: ogLocales[l],
      alternateLocale: locales.filter((x) => x !== l).map((x) => ogLocales[x]),
      siteName: siteConfig.name,
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: `${siteConfig.url}${localePath(l, '/')}`,
    },
    twitter: { card: 'summary_large_image', title: dict.meta.siteTitle, description: dict.meta.siteDescription },
    robots: { index: true, follow: true },
    icons: { icon: '/icon.svg' },
  };
}

export const viewport: Viewport = {
  themeColor: '#0d2c2e',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={fontClassName}>
      <body className="flex min-h-dvh flex-col">
        <GoogleTag />
        <SplashScreen />
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <JsonLd data={organizationJsonLd()} />
        <LocaleProvider locale={locale} dict={dict}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
