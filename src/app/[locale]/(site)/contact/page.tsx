import type { Metadata } from 'next';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/config/site';
import { buildWhatsappLink } from '@/lib/contact';
import { createFormToken } from '@/lib/security/request';
import { resolveLocale } from '@/lib/i18n-server';
import { Section } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { ContactForm } from '@/components/forms/contact-form';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return buildMetadata({ title: dict.meta.contact.title, description: dict.meta.contact.description, path: '/contact', locale });
}

// Jeton anti-robot généré à chaque rendu.
export const dynamic = 'force-dynamic';

export default async function ContactPage({ params }: Props) {
  const { dict } = await resolveLocale(params);
  const s = dict.contactPage;
  const c = dict.contactForm;
  const formToken = createFormToken();
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null;

  return (
    <>
      {/* Bandeau : conseiller en fond + WhatsApp -------------------------- */}
      <section className="relative isolate min-h-[70vh] overflow-hidden bg-navy-950 text-white" aria-labelledby="contact-title">
        <Image src="/images/photo-5.jpg" alt={s.imageAlt} fill priority sizes="100vw" className="object-cover object-[center_20%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" aria-hidden="true" />
        <div className="container-page relative flex min-h-[70vh] items-center py-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-300">{s.eyebrow}</p>
            <h1 id="contact-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">{s.title}</h1>
            <p className="mt-5 text-lg text-navy-100/85">{s.description}</p>

            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="font-display text-lg font-semibold">{c.whatsappTitle}</p>
              <p className="mt-1 text-sm text-navy-100/85">{c.whatsappText}</p>
              <p className="mt-3 font-display text-2xl font-bold text-sage-300">{siteConfig.contact.phoneDisplay}</p>
              <ButtonLink href={buildWhatsappLink(dict.whatsapp.general)} variant="whatsapp" size="lg" className="mt-4 w-full sm:w-auto">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {c.whatsappCta}
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs text-navy-100/60">{s.hours}</p>
          </div>
        </div>
      </section>

      {/* Formulaire ------------------------------------------------------- */}
      <Section tone="muted" ariaLabelledBy="contact-form-title">
        <div className="container-page max-w-3xl">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">{c.eyebrow}</p>
            <h2 id="contact-form-title" className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">{c.title}</h2>
            <p className="mt-3 text-ink-muted">{c.description}</p>
          </Reveal>
          <Reveal delay={0.05} className="mt-8">
            <ContactForm formToken={formToken} turnstileSiteKey={turnstileSiteKey} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
