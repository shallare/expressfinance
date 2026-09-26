'use client';

import type { Testimonial } from '@/data/testimonials';
import { Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/motion/reveal';
import { useLocale } from '@/i18n/provider';
import { TestimonialsCarousel } from './testimonials-carousel';

export function Testimonials({ items }: { items: Testimonial[] }) {
  const { dict } = useLocale();
  const s = dict.testimonials;
  return (
    <Section id="temoignages" tone="muted" ariaLabelledBy="testimonials-title">
      <div className="container-page">
        <Reveal>
          <SectionHeader eyebrow={s.eyebrow} id="testimonials-title" title={s.title} description={s.description} />
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <TestimonialsCarousel items={items} />
        </Reveal>
      </div>
    </Section>
  );
}
