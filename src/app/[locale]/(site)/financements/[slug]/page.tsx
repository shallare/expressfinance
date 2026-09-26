import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, FileText, MessageCircle } from 'lucide-react';
import { getLoanProductBySlug, getLoanProducts, getSimulatorSettings } from '@/lib/data/catalog';
import { buildMetadata } from '@/lib/seo';
import { buildWhatsappLink } from '@/lib/contact';
import { formatCurrencyCompact, formatDuration } from '@/lib/finance/format';
import { resolveLocale } from '@/lib/i18n-server';
import { t } from '@/i18n';
import { localePath, locales } from '@/i18n/config';
import { localizeProduct, localizeProducts } from '@/i18n/products';
import { PageHero } from '@/components/layout/page-hero';
import { Section } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductIcon } from '@/components/products/product-icon';
import { ProductCard } from '@/components/products/product-card';
import { LoanSimulator } from '@/components/simulator/loan-simulator';
import { describeRate } from '@/lib/finance/loan-calculator';
import { Reveal } from '@/components/motion/reveal';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const products = await getLoanProducts();
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const raw = await getLoanProductBySlug(slug);
  if (!raw) return { title: dict.productPage.notFound };
  const product = localizeProduct(raw, locale);
  return buildMetadata({
    title: `${product.name} — ${product.tagline}`,
    description: `${product.description} ${formatCurrencyCompact(product.minAmount, locale)} – ${formatCurrencyCompact(product.maxAmount, locale)}.`,
    path: `/financements/${product.slug}`,
    locale,
  });
}

export default async function ProductPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const [raw, allProducts, settings] = await Promise.all([getLoanProductBySlug(slug), getLoanProducts(), getSimulatorSettings()]);
  if (!raw) notFound();

  const product = localizeProduct(raw, locale);
  const products = localizeProducts(allProducts, locale);
  const others = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const s = dict.productPage;
  const whatsappText = t(dict.whatsapp.productContext, { product: product.name });
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero
        eyebrow={product.shortName}
        title={product.name}
        description={product.tagline}
        breadcrumbs={[
          { name: dict.nav.financing, path: '/financements' },
          { name: product.name, path: `/financements/${product.slug}` },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={p(`/demande?produit=${product.slug}`)} size="lg">
            {s.apply}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href={buildWhatsappLink(whatsappText)} variant="whatsapp" size="lg">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {s.ask}
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-950 text-sage-300">
                <ProductIcon icon={product.icon} className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-navy-900 sm:text-3xl">{s.presentation}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-muted">{product.longDescription}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-12 text-2xl font-bold text-navy-900">{s.conditions}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.keyConditions.map((c) => (
                  <li key={c} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 text-sm text-ink-muted shadow-xs">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-12 text-2xl font-bold text-navy-900">{s.useCases}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.useCases.map((u) => (
                  <Badge key={u} tone="neutral" className="px-3 py-1.5 text-sm">{u}</Badge>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-12 text-2xl font-bold text-navy-900">{s.documents}</h2>
              <ul className="mt-5 space-y-2.5">
                {product.requiredDocuments.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-ink-muted">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink-subtle">{s.documentsNote}</p>
            </Reveal>
          </div>

          <aside className="lg:col-span-5">
            <Reveal from="left">
              <div className="card-surface sticky top-24 p-6 sm:p-7">
                <h2 className="text-lg font-semibold text-navy-900">{s.summary}</h2>
                <dl className="mt-5 divide-y divide-line text-sm">
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-ink-muted">{s.amount}</dt>
                    <dd className="text-right font-semibold text-navy-900">{formatCurrencyCompact(product.minAmount, locale)} – {formatCurrencyCompact(product.maxAmount, locale)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-ink-muted">{s.duration}</dt>
                    <dd className="text-right font-semibold text-navy-900">{t(s.monthsTo, { min: formatDuration(product.minDuration, locale), max: formatDuration(product.maxDuration, locale) })}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-ink-muted">{s.rate}</dt>
                    <dd className="text-right font-semibold text-navy-900">{describeRate(product.rate, dict.simulator.rateDesc)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-ink-muted">{s.fees}</dt>
                    <dd className="text-right font-semibold text-navy-900">{s.feesValue}</dd>
                  </div>
                </dl>
                <div className="mt-6 grid gap-2">
                  <ButtonLink href={p(`/demande?produit=${product.slug}`)} size="lg">{s.apply}</ButtonLink>
                  <ButtonLink href={p(`/simulateur?produit=${product.slug}`)} variant="outline" size="lg">{s.simulate}</ButtonLink>
                </div>
                <p className="mt-4 text-xs text-ink-subtle">
                  {s.finalNote}{' '}
                  <Link href={p('/frais-et-conditions')} className="font-medium text-brand-700 underline underline-offset-2">{s.feesLink}</Link>
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>

      <Section tone="muted" ariaLabelledBy="product-sim-title">
        <div className="container-page">
          <Reveal>
            <h2 id="product-sim-title" className="text-center text-3xl font-bold text-navy-900">{t(s.simTitle, { product: product.name.toLowerCase() })}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-ink-muted">{s.simText}</p>
          </Reveal>
          <div className="mt-10">
            <LoanSimulator products={products} settings={settings} initial={{ productSlug: product.slug }} />
          </div>
        </div>
      </Section>

      {others.length > 0 && (
        <Section ariaLabelledBy="others-title">
          <div className="container-page">
            <h2 id="others-title" className="text-2xl font-bold text-navy-900">{s.others}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <ProductCard key={o.slug} product={o} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
