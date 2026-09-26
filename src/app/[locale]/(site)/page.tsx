import type { Metadata } from 'next';
import { getLoanProducts, getPartners, getSimulatorSettings, getTestimonials } from '@/lib/data/catalog';
import { buildMetadata } from '@/lib/seo';
import { resolveLocale } from '@/lib/i18n-server';
import { localizeProducts } from '@/i18n/products';
import { faqByLocale } from '@/i18n/faq';
import { Hero } from '@/components/home/hero';
import { Intro } from '@/components/home/intro';
import { ProductsGrid } from '@/components/home/products-grid';
import { HowItWorks } from '@/components/home/how-it-works';
import { Benefits } from '@/components/home/benefits';
import { SimulatorPreview } from '@/components/home/simulator-preview';
import { Trust } from '@/components/home/trust';
import { Testimonials } from '@/components/home/testimonials';
import { PartnersMarquee } from '@/components/home/partners-marquee';
import { Faq } from '@/components/home/faq';
import { ContactCta } from '@/components/home/contact-cta';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return buildMetadata({ title: dict.meta.home.title, description: dict.meta.home.description, path: '/', locale });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await resolveLocale(params);
  const [products, settings, testimonials, partners] = await Promise.all([
    getLoanProducts(),
    getSimulatorSettings(),
    getTestimonials(locale),
    getPartners(),
  ]);
  const localized = localizeProducts(products, locale);

  return (
    <>
      <Hero />
      <Intro />
      <ProductsGrid products={localized} />
      <HowItWorks />
      <Benefits />
      <SimulatorPreview products={localized} settings={settings} />
      <Trust />
      <Testimonials items={testimonials} />
      <PartnersMarquee partners={partners} />
      <Faq items={faqByLocale[locale]} />
      <ContactCta />
    </>
  );
}
