'use client';

import { ArrowRight } from 'lucide-react';
import type { LoanProduct } from '@/lib/config/loans';
import { Section, SectionHeader } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { ProductCard } from '@/components/products/product-card';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';

export function ProductsGrid({ products }: { products: LoanProduct[] }) {
  const { locale, dict } = useLocale();
  const s = dict.products;
  return (
    <Section id="financements" tone="muted" ariaLabelledBy="products-title">
      <div className="container-page">
        <Reveal>
          <SectionHeader eyebrow={s.eyebrow} id="products-title" title={s.title} description={s.description} />
        </Reveal>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <StaggerItem key={p.slug} className="h-full">
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal delay={0.1} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={localePath(locale, '/financements')} variant="outline">
            {s.seeAll}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href={localePath(locale, '/demande')}>{s.apply}</ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}
