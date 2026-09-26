'use client';

import Image from 'next/image';
import { Calculator, FileCheck2, MessagesSquare, Wallet } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';

const icons = [Calculator, FileCheck2, MessagesSquare, Wallet];

export function HowItWorks() {
  const { locale, dict } = useLocale();
  const s = dict.how;
  return (
    <Section id="comment-ca-marche" ariaLabelledBy="how-title" className="scroll-mt-20 overflow-hidden">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <SectionHeader align="left" eyebrow={s.eyebrow} id="how-title" title={s.title} description={s.description} />
          </Reveal>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2">
            {s.steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <StaggerItem key={step.title}>
                  <div className="relative">
                    <div className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-950 text-white shadow-glow">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                      <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-sage-300 font-display text-xs font-bold text-navy-950">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-navy-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
          <Reveal delay={0.1} className="mt-10">
            <ButtonLink href={localePath(locale, '/simulateur')} size="lg">
              {s.cta}
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal from="left" className="relative lg:col-span-6">
          <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-sage-200/70 blur-2xl" aria-hidden="true" />
          <div className="absolute -bottom-8 -right-6 h-48 w-48 rounded-full bg-brand-200/60 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] shadow-card-hover">
            <div className="relative aspect-[5/4]">
              <Image src="/images/photo-3.jpg" alt={s.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-card-hover">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-sage-700">
              <MessagesSquare className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-navy-900">{s.steps[2].title}</span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
