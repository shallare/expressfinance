'use client';

import Image from 'next/image';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { siteConfig, formatAddressOneLine } from '@/lib/config/site';
import { buildMailtoLink, buildWhatsappLink, mapsLink, telLink } from '@/lib/contact';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';

export function ContactCta() {
  const { locale, dict } = useLocale();
  const s = dict.contactCta;
  return (
    <Section tone="dark" ariaLabelledBy="contact-cta-title" className="overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-300">{s.eyebrow}</p>
          <h2 id="contact-cta-title" className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
            {s.title}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-navy-100/80">{s.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localePath(locale, '/demande')} size="lg">
              {s.apply}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={buildWhatsappLink(dict.whatsapp.general)} variant="whatsapp" size="lg">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {s.whatsapp}
            </ButtonLink>
          </div>

          <address className="mt-10 grid gap-4 text-sm not-italic sm:grid-cols-2">
            <a href={buildWhatsappLink(dict.whatsapp.general)} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-navy-100/85 hover:text-white">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#25D366]" aria-hidden="true" />
              <span><span className="block text-xs uppercase tracking-wide text-navy-100/50">{s.labels.whatsapp}</span>{siteConfig.contact.phoneDisplay}</span>
            </a>
            <a href={telLink} className="flex items-start gap-3 text-navy-100/85 hover:text-white">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-sage-300" aria-hidden="true" />
              <span><span className="block text-xs uppercase tracking-wide text-navy-100/50">{s.labels.phone}</span>{siteConfig.contact.phoneDisplay}</span>
            </a>
            <a href={buildMailtoLink(dict.email.subjectGeneral)} className="flex items-start gap-3 text-navy-100/85 hover:text-white">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-sage-300" aria-hidden="true" />
              <span><span className="block text-xs uppercase tracking-wide text-navy-100/50">{s.labels.email}</span><span className="break-all">{siteConfig.contact.email}</span></span>
            </a>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-navy-100/85 hover:text-white">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sage-300" aria-hidden="true" />
              <span><span className="block text-xs uppercase tracking-wide text-navy-100/50">{s.labels.address}</span>{formatAddressOneLine()}</span>
            </a>
          </address>
        </Reveal>

        <Reveal delay={0.1} from="left" className="lg:col-span-6">
          <div className="relative mx-auto max-w-md">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
              <Image src="/images/photo-5.jpg" alt={s.imageAlt} fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="font-display text-base font-semibold text-white">{s.cardTitle}</p>
                <p className="mt-1 text-sm text-navy-100/85">{s.cardText}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
