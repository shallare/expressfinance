'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';
import { cn } from '@/lib/utils';

interface Crumb {
  name: string;
  /** Chemin sans préfixe de langue. */
  path: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
  compact?: boolean;
  /** Photo de fond optionnelle (chemin public). */
  image?: string;
  imageAlt?: string;
}

export function PageHero({ eyebrow, title, description, breadcrumbs, children, compact, image, imageAlt }: PageHeroProps) {
  const { locale, dict } = useLocale();
  const crumbs: Crumb[] = [{ name: dict.nav.home, path: '/' }, ...(breadcrumbs ?? [])];

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, path: localePath(locale, c.path) })))} />
      {image ? (
        <>
          <Image src={image} alt={imageAlt ?? ''} fill priority sizes="100vw" className="object-cover object-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/40" aria-hidden="true" />
        </>
      ) : (
        <div className="absolute inset-0 bg-grid-navy [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]" aria-hidden="true" />
      )}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" aria-hidden="true" />
      <div className={cn('container-page relative', compact ? 'py-12 sm:py-16' : 'py-16 sm:py-20 lg:py-24')}>
        <nav aria-label={dict.common.breadcrumb} className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-navy-100/60">
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden="true" />}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-navy-100/90">
                    {c.name}
                  </span>
                ) : (
                  <Link href={localePath(locale, c.path)} className="hover:text-white">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-sage-300">{eyebrow}</p>}
        <h1 className={cn('font-display font-bold text-white', compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl lg:text-[3.2rem] lg:leading-[1.1]')}>
          {title}
        </h1>
        {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100/80">{description}</p>}
        {children}
      </div>
    </section>
  );
}
