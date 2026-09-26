'use client';

import { ChevronDown, MessageCircle } from 'lucide-react';
import type { FaqItem } from '@/i18n/faq';
import { faqJsonLd } from '@/lib/seo';
import { buildWhatsappLink } from '@/lib/contact';
import { Section, SectionHeader } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';
import { Reveal } from '@/components/motion/reveal';
import { useLocale } from '@/i18n/provider';

/** FAQ accessible basée sur <details>/<summary>. */
export function Faq({ items }: { items: FaqItem[] }) {
  const { dict } = useLocale();
  const s = dict.faq;
  return (
    <Section id="faq" ariaLabelledBy="faq-title" className="scroll-mt-20">
      <JsonLd data={faqJsonLd(items)} />
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <SectionHeader align="left" eyebrow={s.eyebrow} id="faq-title" title={s.title} description={s.description} />
            <ButtonLink href={buildWhatsappLink(dict.whatsapp.general)} variant="whatsapp" className="mt-6">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {s.cta}
            </ButtonLink>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <div className="divide-y divide-line rounded-2xl border border-line bg-white shadow-card">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.04}>
                <details className="group" name="faq">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-navy-900 transition-colors hover:bg-surface-2/60 [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-brand-600 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="px-6 pb-6 text-sm leading-relaxed text-ink-muted">{item.answer}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
