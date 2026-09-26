import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getLoanProducts } from '@/lib/data/catalog';
import { buildMetadata } from '@/lib/seo';
import { loanLimits } from '@/lib/config/loans';
import { buildWhatsappLink } from '@/lib/contact';
import { formatCurrencyCompact } from '@/lib/finance/format';
import { resolveLocale } from '@/lib/i18n-server';
import { t } from '@/i18n';
import { localePath } from '@/i18n/config';
import { localizeProducts } from '@/i18n/products';
import { PageHero } from '@/components/layout/page-hero';
import { Section } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { Stagger, StaggerItem } from '@/components/motion/reveal';
import { ContactCta } from '@/components/home/contact-cta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return buildMetadata({ title: dict.meta.financing.title, description: dict.meta.financing.description, path: '/financements', locale });
}

export default async function FinancementsPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const products = localizeProducts(await getLoanProducts(), locale);
  const s = dict.financingPage;
  const min = formatCurrencyCompact(loanLimits.minAmount, locale);
  const max = formatCurrencyCompact(loanLimits.maxAmount, locale);

  return (
    <>
      <PageHero
        eyebrow={s.eyebrow}
        title={s.title}
        description={t(s.description, { min, max })}
        breadcrumbs={[{ name: dict.nav.financing, path: '/financements' }]}
        image="/images/photo-3.jpg"
        imageAlt={s.imageAlt}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={localePath(locale, '/simulateur')} variant="gold" size="lg">{s.simulate}</ButtonLink>
          <ButtonLink href={buildWhatsappLink(dict.whatsapp.general)} variant="whatsapp" size="lg">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {s.whatsapp}
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="container-page">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <StaggerItem key={p.slug} className="h-full">
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-12 grid items-center gap-8 overflow-hidden rounded-3xl border border-line bg-white shadow-card lg:grid-cols-12">
            <div className="relative aspect-[4/3] lg:col-span-5 lg:aspect-auto lg:h-full lg:min-h-[320px]">
              <Image src="/images/photo-4.jpg" alt={s.imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="p-8 lg:col-span-7 lg:p-12">
              <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{s.helpTitle}</h2>
              <p className="mt-3 max-w-xl text-ink-muted">{s.helpText}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={localePath(locale, '/demande')} size="lg">
                  {s.apply}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={localePath(locale, '/contact')} variant="outline" size="lg">{s.contact}</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <ContactCta />
    </>
  );
}
