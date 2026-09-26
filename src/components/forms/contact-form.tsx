'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { createContactSchema } from '@/lib/validation/contact';
import { zodErrorsToRecord } from '@/lib/validation/application';
import { loanLimits } from '@/lib/config/loans';
import { buildWhatsappLink } from '@/lib/contact';
import { Button, ButtonLink } from '@/components/ui/button';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';
import { TextField, TextareaField } from './field';
import { Turnstile } from './turnstile';

interface ContactFormProps {
  formToken: string;
  turnstileSiteKey: string | null;
}

const emptyValues = {
  firstName: '',
  lastName: '',
  profession: '',
  monthlyIncome: '',
  requestedAmount: '',
  desiredDuration: '',
  whatsapp: '',
  phone: '',
  email: '',
  purpose: '',
  other: '',
};

type Values = typeof emptyValues;

export function ContactForm({ formToken, turnstileSiteKey }: ContactFormProps) {
  const { locale, dict } = useLocale();
  const c = dict.contactForm;
  const schema = useMemo(() => createContactSchema(dict.validation, dict.contactForm), [dict]);
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const onTurnstileToken = useCallback((token: string | null) => setTurnstileToken(token), []);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setErrors(zodErrorsToRecord(parsed.error));
      setGlobalError(c.errors.invalid);
      return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setGlobalError(dict.form.captchaError);
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, locale, formToken, website: '', turnstileToken: turnstileToken ?? undefined }),
      });
      const json = (await res.json().catch(() => null)) as { ok: boolean; message?: string; fieldErrors?: Record<string, string> } | null;
      if (!json || !json.ok) {
        if (json?.fieldErrors) setErrors(json.fieldErrors);
        setGlobalError(json?.message ?? c.errors.generic);
        setStatus('idle');
        return;
      }
      setStatus('sent');
    } catch {
      setGlobalError(c.errors.generic);
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <div className="card-surface p-8 text-center" role="status" aria-live="polite">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-navy-900">{c.success.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-muted">{c.success.text}</p>
        <ButtonLink href={buildWhatsappLink(dict.whatsapp.general)} variant="whatsapp" size="lg" className="mt-6">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {c.whatsappCta}
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="card-surface p-6 sm:p-8">
      {globalError && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{globalError}</p>
        </div>
      )}
      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label={c.labels.firstName} name="firstName" autoComplete="given-name" required value={values.firstName} onChange={set('firstName')} error={errors.firstName} />
        <TextField label={c.labels.lastName} name="lastName" autoComplete="family-name" required value={values.lastName} onChange={set('lastName')} error={errors.lastName} />
        <TextField label={c.labels.profession} name="profession" autoComplete="organization-title" required value={values.profession} onChange={set('profession')} error={errors.profession} />
        <TextField label={c.labels.income} name="monthlyIncome" type="number" inputMode="numeric" min={0} step={50} required value={values.monthlyIncome} onChange={set('monthlyIncome')} error={errors.monthlyIncome} />
        <TextField label={c.labels.amount} name="requestedAmount" type="number" inputMode="numeric" min={loanLimits.minAmount} max={loanLimits.maxAmount} step={100} required value={values.requestedAmount} onChange={set('requestedAmount')} error={errors.requestedAmount} />
        <TextField label={c.labels.duration} name="desiredDuration" type="number" inputMode="numeric" min={loanLimits.minDuration} max={loanLimits.maxDuration} required value={values.desiredDuration} onChange={set('desiredDuration')} error={errors.desiredDuration} />
        <TextField label={c.labels.whatsapp} name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+32 470 00 00 00" value={values.whatsapp} onChange={set('whatsapp')} error={errors.whatsapp} help={c.helps.whatsapp} />
        <TextField label={c.labels.phone} name="phone" type="tel" inputMode="tel" value={values.phone} onChange={set('phone')} error={errors.phone} help={c.helps.phone} />
        <TextField label={c.labels.email} name="email" type="email" inputMode="email" autoComplete="email" required value={values.email} onChange={set('email')} error={errors.email} className="sm:col-span-2" />
        <TextField label={c.labels.purpose} name="purpose" required maxLength={600} placeholder={c.placeholders.purpose} value={values.purpose} onChange={set('purpose')} error={errors.purpose} className="sm:col-span-2" />
        <TextareaField label={c.labels.other} name="other" maxLength={1500} placeholder={c.placeholders.other} value={values.other} onChange={set('other')} error={errors.other} help={c.helps.other} className="sm:col-span-2" />
      </div>

      {turnstileSiteKey && (
        <div className="mt-5">
          <Turnstile siteKey={turnstileSiteKey} onToken={onTurnstileToken} />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-subtle">
          {c.privacyNote}{' '}
          <Link href={localePath(locale, '/politique-de-confidentialite')} className="font-medium text-brand-700 underline underline-offset-2">{c.privacyLink}</Link>
        </p>
        <Button type="submit" size="lg" loading={status === 'sending'} className="shrink-0">
          {status === 'sending' ? c.submitting : c.submit}
          {status !== 'sending' && <Send className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
    </form>
  );
}
