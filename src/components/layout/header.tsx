'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, MessageCircle, X } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { ButtonLink } from '@/components/ui/button';
import { mainNavigation } from '@/lib/config/navigation';
import { buildWhatsappLink } from '@/lib/contact';
import { localePath, stripLocale } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';
import { cn } from '@/lib/utils';

export function Header() {
  const { locale, dict } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { path: currentPath } = stripLocale(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    return href === '/' ? currentPath === '/' : currentPath.startsWith(href);
  };

  const items = mainNavigation.map((item) => ({
    key: item.key,
    label: dict.nav[item.key],
    href: localePath(locale, item.href),
    active: isActive(item.href),
  }));

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-[background-color,border-color,box-shadow] duration-300',
        scrolled
          ? 'border-line/80 bg-white/85 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl'
          : 'border-transparent bg-white/70 backdrop-blur-md',
      )}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
      >
        {dict.nav.skip}
      </a>
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Link href={localePath(locale, '/')} aria-label={dict.nav.homeAria} className="shrink-0 rounded-lg">
          <Logo />
        </Link>

        <nav aria-label={dict.nav.mainNav} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn(
                    'rounded-lg px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-navy-50 hover:text-navy-900',
                    item.active && 'bg-navy-50 text-navy-900',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <ButtonLink href={buildWhatsappLink(dict.whatsapp.general)} variant="whatsapp" size="sm" aria-label={dict.nav.whatsappLong}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {dict.nav.whatsapp}
          </ButtonLink>
          <ButtonLink href={localePath(locale, '/demande')} size="sm">
            {dict.nav.apply}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? dict.nav.menuClose : dict.nav.menuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-navy-900"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-line bg-white shadow-xl xl:hidden"
          >
            <nav aria-label={dict.nav.mobileNav} className="container-page py-4">
              <ul className="flex flex-col">
                {items.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={item.active ? 'page' : undefined}
                      className={cn(
                        'block rounded-xl px-4 py-3.5 text-base font-medium text-navy-900 hover:bg-navy-50',
                        item.active && 'bg-navy-50',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-2 border-t border-line pt-4">
                <ButtonLink href={localePath(locale, '/demande')} size="lg">
                  {dict.nav.apply}
                </ButtonLink>
                <ButtonLink href={localePath(locale, '/simulateur')} variant="outline" size="lg">
                  {dict.nav.simulate}
                </ButtonLink>
                <ButtonLink href={buildWhatsappLink(dict.whatsapp.general)} variant="whatsapp" size="lg">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  {dict.nav.whatsappLong}
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
