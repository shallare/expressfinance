'use client';

import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { footerServiceLinks, legalLinks } from '@/lib/config/navigation';
import { siteConfig, formatAddressOneLine } from '@/lib/config/site';
import { buildMailtoLink, buildWhatsappLink, mapsLink, telLink } from '@/lib/contact';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';

export function Footer({ productLinks = [] }: { productLinks?: { slug: string; name: string }[] }) {
  const { locale, dict } = useLocale();
  const year = new Date().getFullYear();
  const p = (path: string) => localePath(locale, path);

  return (
    <footer className="relative mt-auto bg-navy-950 text-navy-100">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage-300/60 to-transparent" aria-hidden="true" />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo variant="dark" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-100/75">{dict.meta.siteDescription}</p>
          <p className="mt-4 font-display text-sm font-semibold text-sage-300">{siteConfig.slogan}</p>
        </div>

        <nav aria-label={dict.footer.financing} className="lg:col-span-2">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">{dict.footer.financing}</h2>
          <ul className="space-y-2.5">
            {productLinks.map((item) => (
              <li key={item.slug}>
                <Link href={p(`/financements/${item.slug}`)} className="text-sm text-navy-100/75 transition-colors hover:text-white">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.footer.services} className="lg:col-span-2">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">{dict.footer.services}</h2>
          <ul className="space-y-2.5">
            {footerServiceLinks.map((item) => (
              <li key={item.key}>
                <Link href={p(item.href)} className="text-sm text-navy-100/75 transition-colors hover:text-white">
                  {dict.footer.links[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">{dict.footer.contact}</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={buildWhatsappLink(dict.whatsapp.general)} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-3 text-navy-100/85 hover:text-white">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" aria-hidden="true" />
                <span>{dict.footer.whatsapp} : {siteConfig.contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={telLink} className="inline-flex items-start gap-3 text-navy-100/85 hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage-300" aria-hidden="true" />
                <span>{siteConfig.contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={buildMailtoLink(dict.email.subjectGeneral)} className="inline-flex items-start gap-3 text-navy-100/85 hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sage-300" aria-hidden="true" />
                <span className="break-all">{siteConfig.contact.email}</span>
              </a>
            </li>
            <li>
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-3 text-navy-100/85 hover:text-white">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-300" aria-hidden="true" />
                <span>{formatAddressOneLine()}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-navy-100/60 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {siteConfig.legalName}. {dict.footer.rights}
          </p>
          <nav aria-label={dict.footer.legalNav}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((item) => (
                <li key={item.key}>
                  <Link href={p(item.href)} className="hover:text-white">
                    {dict.legalNav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="container-page pb-8">
          <p className="max-w-4xl text-[11px] leading-relaxed text-navy-100/45">{dict.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
