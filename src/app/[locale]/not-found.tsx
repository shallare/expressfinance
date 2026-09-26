import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NotFoundContent } from '@/components/layout/not-found-content';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu" className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
      <LanguageSwitcher />
    </>
  );
}
