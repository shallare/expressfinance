'use client';

import type { LoanProduct } from '@/lib/config/loans';
import type { SimulatorSettings } from '@/lib/data/mappers';
import { Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/motion/reveal';
import { LoanSimulator } from '@/components/simulator/loan-simulator';
import { useLocale } from '@/i18n/provider';

export function SimulatorPreview({ products, settings }: { products: LoanProduct[]; settings: SimulatorSettings }) {
  const { dict } = useLocale();
  const s = dict.simPreview;
  return (
    <Section id="simulateur" tone="muted" ariaLabelledBy="sim-preview-title">
      <div className="container-page">
        <Reveal>
          <SectionHeader eyebrow={s.eyebrow} id="sim-preview-title" title={s.title} description={s.description} />
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <LoanSimulator products={products} settings={settings} variant="compact" />
        </Reveal>
      </div>
    </Section>
  );
}
