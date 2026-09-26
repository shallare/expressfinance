import type { Metadata } from 'next';
import { getLoanProducts } from '@/lib/data/catalog';
import { buildMetadata } from '@/lib/seo';
import { createFormToken } from '@/lib/security/request';
import { num, resolveLocale, str } from '@/lib/i18n-server';
import { localizeProducts } from '@/i18n/products';
import { PageHero } from '@/components/layout/page-hero';
import { Section } from '@/components/ui/section';
import { ApplicationForm } from '@/components/forms/application-form';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return buildMetadata({ title: dict.meta.apply.title, description: dict.meta.apply.description, path: '/demande', locale });
}

// Le jeton anti-robot est généré à chaque rendu : page dynamique.
export const dynamic = 'force-dynamic';

export default async function DemandePage({ params, searchParams }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const [products, sp] = await Promise.all([getLoanProducts(), searchParams]);
  const formToken = createFormToken();
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null;
  const productSlug = str(sp.produit);
  const s = dict.applyPage;

  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} description={s.description} breadcrumbs={[{ name: dict.nav.apply, path: '/demande' }]} compact />
      <Section padding="compact" className="py-10 sm:py-14">
        <div className="container-page max-w-3xl">
          <ApplicationForm
            products={localizeProducts(products, locale)}
            formToken={formToken}
            turnstileSiteKey={turnstileSiteKey}
            initial={{
              productSlug: productSlug && /^[a-z0-9-]+$/.test(productSlug) ? productSlug : undefined,
              amount: num(sp.montant),
              duration: num(sp.duree),
            }}
          />
        </div>
      </Section>
    </>
  );
}
