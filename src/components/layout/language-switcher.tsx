'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronUp } from 'lucide-react';
import { localeFlags, localeNames, localePath, locales, stripLocale } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';
import { cn } from '@/lib/utils';

function Flag({ code, alt, size = 20 }: { code: string; alt: string; size?: number }) {
  return (
    <Image
      src={`/flags/${localeFlags[code as keyof typeof localeFlags] ?? code}.svg`}
      alt={alt}
      width={size}
      height={Math.round(size * 0.75)}
      className="rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
      unoptimized
    />
  );
}

/**
 * Sélecteur de langue flottant (coin inférieur gauche) : drapeau + nom de la
 * langue, menu accessible au clavier, conserve la page courante.
 */
export function LanguageSwitcher() {
  const { locale, dict } = useLocale();
  const pathname = usePathname();
  const { path } = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed z-40" style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))', left: 'calc(1.25rem + env(safe-area-inset-left, 0px))' }}>
      <AnimatePresence>
        {open && (
          <motion.ul
            id="language-menu"
            role="menu"
            aria-label={dict.nav.language}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-0 mb-2 grid w-56 grid-cols-1 gap-0.5 rounded-2xl border border-line bg-white p-1.5 shadow-card-hover max-h-[70vh] overflow-y-auto"
          >
            {locales.map((l) => (
              <li key={l} role="none">
                <Link
                  role="menuitem"
                  href={localePath(l, path)}
                  hrefLang={l}
                  lang={l}
                  aria-current={l === locale ? 'true' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    l === locale ? 'bg-navy-50 text-navy-900' : 'text-ink-muted hover:bg-surface-2 hover:text-navy-900',
                  )}
                >
                  <Flag code={l} alt="" />
                  <span className="flex-1">{localeNames[l]}</span>
                  {l === locale && <Check className="h-4 w-4 text-brand-600" aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="language-menu"
        aria-label={`${dict.nav.language} : ${localeNames[locale]}`}
        className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white pl-3 pr-4 text-sm font-semibold text-navy-900 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.35)] transition-transform hover:scale-[1.03] focus-visible:ring-4 focus-visible:ring-brand-500/30 motion-reduce:hover:scale-100"
      >
        <Flag code={locale} alt="" size={22} />
        <span>{localeNames[locale]}</span>
        <ChevronUp className={cn('h-4 w-4 text-ink-subtle transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
    </div>
  );
}
