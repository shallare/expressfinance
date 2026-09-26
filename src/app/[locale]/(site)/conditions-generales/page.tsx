import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { resolveLocale } from '@/lib/i18n-server';
import { getLegalDocument, legalPaths } from '@/i18n/legal';
import { LegalPage } from '@/components/legal/legal-page';

type Props = { params: Promise<{ locale: string }> };
const KEY = 'terms' as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const doc = getLegalDocument(locale, KEY);
  return buildMetadata({ title: doc.title, description: doc.description, path: legalPaths[KEY], locale });
}

export default async function Page({ params }: Props) {
  const { locale } = await resolveLocale(params);
  return <LegalPage doc={getLegalDocument(locale, KEY)} path={legalPaths[KEY]} />;
}
