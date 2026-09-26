'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/motion/reveal';
import { useLocale } from '@/i18n/provider';

export function Benefits() {
  const { dict } = useLocale();
  const s = dict.benefits;
  return (
    <Section tone="dark" ariaLabelledBy="benefits-title" className="overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeader tone="dark" align="left" eyebrow={s.eyebrow} id="benefits-title" title={s.title} description={s.description} />
          </Reveal>
          <ul className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {s.items.map((b, i) => (
              <Reveal key={b.title} as="li" delay={i * 0.05}>
                <div className="flex gap-4">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-sage-300" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{b.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy-100/75">{b.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal from="left" className="lg:col-span-5">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-br from-brand-500/40 to-sage-300/30 blur-xl" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/15 sm:aspect-square lg:aspect-[4/5]">
              <Image src="/images/photo-4.jpg" alt={s.imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
