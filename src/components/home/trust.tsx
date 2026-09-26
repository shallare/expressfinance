'use client';

import Link from 'next/link';
import { Eye, FileLock2, Lock, ServerCog } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';

const icons = [Lock, FileLock2, Eye, ServerCog];

export function Trust() {
  const { locale, dict } = useLocale();
  const s = dict.trust;
  return (
    <Section ariaLabelledBy="trust-title">
      <div className="container-page">
        <Reveal>
          <SectionHeader eyebrow={s.eyebrow} id="trust-title" title={s.title} description={s.description} />
        </Reveal>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((it, i) => {
            const Icon = icons[i];
            return (
              <StaggerItem key={it.title}>
                <div className="card-surface card-hover h-full p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-sage-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-navy-900">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{it.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal delay={0.1} className="mt-8 text-center text-sm text-ink-muted">
          {s.more}{' '}
          <Link href={localePath(locale, '/frais-et-conditions')} className="font-medium text-brand-700 underline underline-offset-2">
            {s.fees}
          </Link>{' '}
          {s.and}{' '}
          <Link href={localePath(locale, '/politique-de-confidentialite')} className="font-medium text-brand-700 underline underline-offset-2">
            {s.privacy}
          </Link>
          .
        </Reveal>
      </div>
    </Section>
  );
}
