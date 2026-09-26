'use client';

import { ButtonLink } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { useLocale } from '@/i18n/provider';
import { localePath } from '@/i18n/config';

export function NotFoundContent() {
  const { locale, dict } = useLocale();
  return (
    <Section className="flex min-h-[60vh] items-center">
      <div className="container-page text-center">
        <p className="font-display text-7xl font-bold text-navy-100">404</p>
        <h1 className="mt-4 text-3xl font-bold text-navy-900">{dict.notFound.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">{dict.notFound.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={localePath(locale, '/')}>{dict.notFound.home}</ButtonLink>
          <ButtonLink href={localePath(locale, '/simulateur')} variant="outline">
            {dict.notFound.simulate}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
