import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CheckCircle2, Copy, Mail, MessageCircle } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/config/site';
import { buildAfterApplicationMailto, buildWhatsappLink } from '@/lib/contact';
import { referenceNumberRegex } from '@/lib/validation/application';
import { resolveLocale, str } from '@/lib/i18n-server';
import { localePath } from '@/i18n/config';
import { Section } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return buildMetadata({ title: dict.meta.confirmation.title, description: dict.meta.confirmation.description, path: '/demande/confirmation', locale, noIndex: true });
}

export const dynamic = 'force-dynamic';

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const sp = await searchParams;
  const ref = str(sp.ref);
  if (!ref || !referenceNumberRegex.test(ref)) redirect(localePath(locale, '/demande'));
  const s = dict.confirmation;

  return (
    <Section className="min-h-[70vh]">
      <div className="container-page max-w-2xl">
        <div className="card-surface overflow-hidden">
          <div className="bg-navy-950 px-8 py-10 text-center text-white">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold">{s.title}</h1>
            <p className="mt-3 text-navy-100/80">{s.subtitle}</p>
          </div>
          <div className="p-8">
            <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{s.referenceLabel}</p>
              <p className="mt-2 font-display text-2xl font-bold tracking-wide text-navy-900 sm:text-3xl">{ref}</p>
              <CopyButton value={ref} copiedLabel={s.copied} className="mt-3">
                <Copy className="h-4 w-4" aria-hidden="true" />
                {s.copy}
              </CopyButton>
            </div>

            <h2 className="mt-8 text-lg font-semibold text-navy-900">{s.nextTitle}</h2>
            <ol className="mt-3 space-y-3 text-sm text-ink-muted">
              {s.steps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-950 text-xs font-bold text-sage-300">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ButtonLink href={buildWhatsappLink(dict.whatsapp.afterApplication, ref, dict.whatsapp.reference)} variant="whatsapp" size="lg">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {s.whatsapp}
              </ButtonLink>
              <ButtonLink href={buildAfterApplicationMailto(dict.email, ref)} variant="outline" size="lg">
                <Mail className="h-5 w-5" aria-hidden="true" />
                {s.email}
              </ButtonLink>
            </div>
            <p className="mt-6 text-center text-xs text-ink-subtle">
              {s.directContact} {siteConfig.contact.phoneDisplay} · {siteConfig.contact.email}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
