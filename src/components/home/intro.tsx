'use client';

import Image from 'next/image';
import { Globe2, Handshake, Lightbulb, ShieldCheck } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { Counter } from '@/components/motion/counter';
import { loanLimits } from '@/lib/config/loans';
import { useLocale } from '@/i18n/provider';

const icons = [Globe2, Lightbulb, ShieldCheck, Handshake];

export function Intro() {
  const { dict } = useLocale();
  const s = dict.intro;

  return (
    <Section id="a-propos" ariaLabelledBy="intro-title">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12">
        {/* Photo + carte flottante ------------------------------------- */}
        <Reveal from="right" className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card-hover sm:aspect-square lg:aspect-[4/5]">
            <Image src="/images/photo-2.jpg" alt={s.imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" aria-hidden="true" />
          </div>
          <div className="absolute -bottom-6 -right-3 rounded-2xl border border-line bg-white p-5 shadow-card-hover sm:right-6 lg:-right-8">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{s.stats.rate}</p>
            <p className="mt-1 font-display text-3xl font-bold text-navy-900">2 %</p>
            <p className="mt-2 text-xs text-ink-muted">{s.stats.duration} : <strong className="text-navy-900">{s.responseValue}</strong></p>
          </div>
          <div className="absolute -left-3 top-8 hidden rounded-2xl bg-navy-950 p-4 text-white shadow-glow sm:block lg:-left-8">
            <p className="text-[11px] uppercase tracking-wide text-navy-100/70">{s.stats.max}</p>
            <p className="mt-1 font-display text-2xl font-bold text-sage-300">
              <Counter value={loanLimits.maxAmount} format="currency" />
            </p>
          </div>
        </Reveal>

        {/* Texte + valeurs ---------------------------------------------- */}
        <div className="lg:col-span-7 lg:pl-6">
          <Reveal>
            <SectionHeader align="left" eyebrow={s.eyebrow} id="intro-title" title={s.title} description={s.description} />
          </Reveal>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2">
            {s.values.map((v, i) => {
              const Icon = icons[i];
              return (
                <StaggerItem key={v.title}>
                  <div className="card-surface card-hover h-full p-6">
                    <Icon className="h-7 w-7 text-brand-600" aria-hidden="true" />
                    <h3 className="mt-4 text-base font-semibold text-navy-900">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{v.text}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-ink-subtle">{s.stats.min}</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-navy-900">
                <Counter value={loanLimits.minAmount} format="currency" />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-subtle">{s.stats.max}</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-navy-900">
                <Counter value={loanLimits.maxAmount} format="currency" />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-subtle">{s.stats.rate}</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-navy-900">2 % <span className="text-sm font-medium text-ink-subtle">{dict.simulator.rateDesc.fixed}</span></dd>
            </div>
          </dl>
        </div>
      </div>
    </Section>
  );
}
