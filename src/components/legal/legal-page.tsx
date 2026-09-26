'use client';

import { PageHero } from '@/components/layout/page-hero';
import { Section } from '@/components/ui/section';
import type { LegalDocument } from '@/i18n/legal';
import { t } from '@/i18n/format';
import { useLocale } from '@/i18n/provider';

/** Gabarit commun aux pages juridiques (contenu localisé fourni par `src/i18n/legal.ts`). */
export function LegalPage({ doc, path }: { doc: LegalDocument; path: string }) {
  const { dict } = useLocale();
  return (
    <>
      <PageHero title={doc.title} breadcrumbs={[{ name: doc.title, path }]} compact>
        <p className="mt-4 text-sm text-navy-100/60">{t(dict.common.lastUpdated, { date: doc.lastUpdated })}</p>
      </PageHero>
      <Section padding="compact" className="py-12 sm:py-16">
        <div className="container-page max-w-3xl">
          <div className="prose-legal">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                {section.list && (
                  <ul>
                    {section.list.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
                {section.after?.map((p) => <p key={p}>{p}</p>)}
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
