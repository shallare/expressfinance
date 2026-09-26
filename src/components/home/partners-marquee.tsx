'use client';

import type { Partner } from '@/data/partners';
import { Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/motion/reveal';
import { useLocale } from '@/i18n/provider';
import { PartnerLogo } from './partner-logo';

/**
 * Défilement infini en CSS (animation `marquee`), mis en pause au survol et
 * désactivé avec `prefers-reduced-motion` (les logos restent visibles en grille).
 */
export function PartnersMarquee({ partners }: { partners: Partner[] }) {
  const { dict } = useLocale();
  const s = dict.partners;
  const doubled = [...partners, ...partners];

  return (
    <Section padding="compact" ariaLabelledBy="partners-title">
      <div className="container-page">
        <Reveal>
          <SectionHeader eyebrow={s.eyebrow} id="partners-title" title={s.title} description={s.description} />
        </Reveal>
        <div className="group relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul
            className="flex w-max gap-5 motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center"
            aria-label={s.logos}
          >
            {doubled.map((p, i) => (
              <li key={`${p.id}-${i}`} aria-hidden={i >= partners.length ? true : undefined} className={i >= partners.length ? 'motion-reduce:hidden' : undefined}>
                <PartnerLogo partner={p} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
