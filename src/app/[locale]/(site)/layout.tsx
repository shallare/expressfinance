import { Footer } from '@/components/layout/footer';
import { FloatingWhatsapp } from '@/components/layout/floating-whatsapp';
import { Header } from '@/components/layout/header';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { getLoanProducts } from '@/lib/data/catalog';
import { isLocale } from '@/i18n/config';
import { localizeProducts } from '@/i18n/products';

/** Layout du site public : en-tête, contenu, pied de page, WhatsApp (bas droite) et langues (bas gauche). */
export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : 'fr';
  const products = localizeProducts(await getLoanProducts(), l);
  const productLinks = products.map((p) => ({ slug: p.slug, name: p.name }));

  return (
    <>
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer productLinks={productLinks} />
      <FloatingWhatsapp />
      <LanguageSwitcher />
    </>
  );
}
