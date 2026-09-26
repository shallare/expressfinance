'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';

const ease = [0.22, 1, 0.36, 1] as const;

/** Hero : photo en arrière-plan, message court et deux actions. */
export function Hero() {
  const { locale, dict } = useLocale();
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  });

  return (
    <section className="relative isolate min-h-[min(88vh,860px)] overflow-hidden bg-navy-950 text-white" aria-labelledby="hero-title">
      <Image src="/images/photo-1.jpg" alt={dict.hero.imageAlt} fill priority sizes="90vw" className="object-cover object-[70%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/25" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" aria-hidden="true" />

      <div className="container-page relative flex min-h-[min(88vh,860px)] items-center py-20 sm:py-24">
        <div className="max-w-2xl">
          <motion.p {...fade(0)} className="inline-flex max-w-xl items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-display text-base font-regular leading-snug text-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur sm:text-lg">
            <span className="h-8 w-1.5 shrink-0 rounded-full bg-sage-300" aria-hidden="true" />
            {dict.hero.badge}
          </motion.p>

          <motion.h1 {...fade(0.08)} id="hero-title" className="mt-6 font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.75rem]">
            {dict.hero.titleStart} <span className="text-gradient-brand">{dict.hero.titleHighlight}</span> {dict.hero.titleEnd}
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100/85">
            {dict.hero.subtitle}
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localePath(locale, '/demande')} size="lg">
              {dict.hero.ctaApply}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={localePath(locale, '/simulateur')} variant="gold" size="lg">
              <Calculator className="h-5 w-5" aria-hidden="true" />
              {dict.hero.ctaSimulate}
            </ButtonLink>
          </motion.div>

          <motion.ul {...fade(0.34)} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-100/80">
            {dict.hero.trust.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sage-300" aria-hidden="true" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
