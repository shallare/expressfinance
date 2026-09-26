import type { Metadata } from 'next';
import Link from 'next/link';
import { getLoanProducts, getSimulatorSettings } from '@/lib/data/catalog';
import { buildMetadata } from '@/lib/seo';
import { loanLimits } from '@/lib/config/loans';
import { formatCurrency, formatCurrencyCompact } from '@/lib/finance/format';
import { resolveLocale } from '@/lib/i18n-server';
import { t } from '@/i18n';
import { localePath } from '@/i18n/config';
import { localizeProducts } from '@/i18n/products';
import { PageHero } from '@/components/layout/page-hero';
import { Section } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return buildMetadata({ title: dict.meta.fees.title, description: dict.meta.fees.description, path: '/frais-et-conditions', locale });
}

export default async function FraisPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const [settings, rawProducts] = await Promise.all([getSimulatorSettings(), getLoanProducts()]);
  const products = localizeProducts(rawProducts, locale);
  const s = dict.feesPage;
  const sec = s.sections;
  const fc = (v: number) => formatCurrency(v, locale);
  const fcc = (v: number) => formatCurrencyCompact(v, locale);
  const p = (path: string) => localePath(locale, path);
  const penalty = settings.penalty;

  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} description={s.description} breadcrumbs={[{ name: s.title, path: '/frais-et-conditions' }]} compact />
      <Section>
        <div className="container-page max-w-4xl">
          <div className="prose-legal">
            <h2 className="mt-0">{sec.rate.title}</h2>
            <p>{sec.rate.p1}</p>
            <p>{sec.rate.p2}</p>

            <h2>{sec.fees.title}</h2>
            <p>{sec.fees.p1}</p>
            {settings.fees.length > 0 && (
              <table className="my-6 w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-2 font-semibold">{sec.fees.cols.fee}</th>
                    <th className="py-2 font-semibold">{sec.fees.cols.amount}</th>
                    <th className="py-2 font-semibold">{sec.fees.cols.application}</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.fees.map((f) => (
                    <tr key={f.id} className="border-b border-line">
                      <td className="py-2">{f.label}</td>
                      <td className="py-2">{f.kind === 'fixed' ? fc(f.value) : `${f.value} ${sec.fees.percent}`}</td>
                      <td className="py-2">{f.timing === 'upfront' ? sec.fees.upfront : sec.fees.monthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h2>{sec.penalty.title}</h2>
            <p>{sec.penalty.p1}</p>
            <ul>
              <li>{t(sec.penalty.grace, { n: penalty.gracePeriodDays })}</li>
              <li>{t(sec.penalty.fixed, { n: fc(penalty.fixedFee) })}</li>
              <li>{t(sec.penalty.percent, { n: penalty.percentOfInstallment })}</li>
              <li>{t(sec.penalty.rate, { n: penalty.lateInterestAnnualPercent })}</li>
            </ul>
            <p className="text-sm">{sec.penalty.note}</p>

            <h2>{sec.amounts.title}</h2>
            <p>{t(sec.amounts.p1, { min: fcc(loanLimits.minAmount), max: fcc(loanLimits.maxAmount) })}</p>
            <ul>
              {products.map((pr) => (
                <li key={pr.slug}>
                  <Link href={p(`/financements/${pr.slug}`)}>{pr.name}</Link>
                  {t(sec.amounts.line, { name: '', min: fcc(pr.minAmount), max: fcc(pr.maxAmount), dmin: pr.minDuration, dmax: pr.maxDuration })}
                </li>
              ))}
            </ul>

            <h2>{sec.conditions.title}</h2>
            <p>{sec.conditions.p1}</p>

            <h2>{sec.offer.title}</h2>
            <p>{sec.offer.p1}</p>
            <p>
              {sec.offer.p2} <Link href={p('/avertissement-pret')}>{sec.offer.disclaimer}</Link> {sec.offer.and}{' '}
              <Link href={p('/conditions-generales')}>{sec.offer.terms}</Link>.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={p('/simulateur')} size="lg">{s.simulate}</ButtonLink>
            <ButtonLink href={p('/contact')} variant="outline" size="lg">{s.ask}</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
