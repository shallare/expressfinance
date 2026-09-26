import type { Metadata } from 'next';
import { getLoanProducts, getSimulatorSettings } from '@/lib/data/catalog';
import { buildMetadata } from '@/lib/seo';
import { num, resolveLocale, str } from '@/lib/i18n-server';
import { localizeProducts } from '@/i18n/products';
import { PageHero } from '@/components/layout/page-hero';
import { Section } from '@/components/ui/section';
import { LoanSimulator } from '@/components/simulator/loan-simulator';
import { ContactCta } from '@/components/home/contact-cta';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return buildMetadata({ title: dict.meta.simulator.title, description: dict.meta.simulator.description, path: '/simulateur', locale });
}

export default async function SimulateurPage({ params, searchParams }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const [products, settings, sp] = await Promise.all([getLoanProducts(), getSimulatorSettings(), searchParams]);
  const productSlug = str(sp.produit);
  const s = dict.simulatorPage;

  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} description={s.description} breadcrumbs={[{ name: dict.nav.simulator, path: '/simulateur' }]} compact />
      <Section padding="compact" className="py-10 sm:py-14">
        <div className="container-page">
          <LoanSimulator
            products={localizeProducts(products, locale)}
            settings={settings}
            initial={{
              productSlug: productSlug && /^[a-z0-9-]+$/.test(productSlug) ? productSlug : undefined,
              amount: num(sp.montant),
              duration: num(sp.duree),
            }}
          />
        </div>
      </Section>
      <ContactCta />
    </>
  );
}
