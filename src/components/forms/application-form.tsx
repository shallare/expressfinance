'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Lock, MessageCircle, Send } from 'lucide-react';
import type { LoanProduct } from '@/lib/config/loans';
import { documentTypes } from '@/lib/config/loans';
import { createApplicationSchema, employmentStatuses, zodErrorsToRecord, type ApplicationInput } from '@/lib/validation/application';
import { formatCurrency, formatCurrencyCompact } from '@/lib/finance/format';
import { calculateLoan } from '@/lib/finance/loan-calculator';
import { buildWhatsappLink } from '@/lib/contact';
import { Button, ButtonLink } from '@/components/ui/button';
import { t } from '@/i18n/format';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';
import { cn } from '@/lib/utils';
import { CheckboxField, SelectField, TextField, TextareaField } from './field';
import { FileUpload } from './file-upload';
import { Turnstile } from './turnstile';

interface ApplicationFormProps {
  products: LoanProduct[];
  formToken: string;
  turnstileSiteKey: string | null;
  initial?: { productSlug?: string; amount?: number; duration?: number };
}

type FormValues = { [K in keyof ApplicationInput]: ApplicationInput[K] extends boolean ? boolean : string };

const stepFields = [
  ['loanProductSlug', 'requestedAmount', 'desiredDuration', 'purpose'],
  ['firstName', 'lastName', 'email', 'phone', 'addressLine', 'postalCode', 'city', 'country'],
  ['profession', 'employmentStatus', 'monthlyIncome'],
  ['acceptPrivacy', 'acceptTerms', 'acceptDataProcessing'],
] as const;

type StepField = (typeof stepFields)[number][number];

const defaultCountry: Record<string, string> = { fr: 'Belgique', it: 'Italia', es: 'España', en: 'Belgium', hr: 'Hrvatska', sl: 'Slovenija', sk: 'Slovensko', el: 'Ελλάδα', nl: 'België', pt: 'Portugal' };

export function ApplicationForm({ products, formToken, turnstileSiteKey, initial }: ApplicationFormProps) {
  const { locale, dict } = useLocale();
  const f = dict.form;
  const router = useRouter();
  const reduce = useReducedMotion();
  const schema = useMemo(() => createApplicationSchema(dict.validation), [dict]);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<FormValues>(() => ({
    loanProductSlug: products.find((p) => p.slug === initial?.productSlug)?.slug ?? products[0]?.slug ?? '',
    requestedAmount: initial?.amount ? String(initial.amount) : '',
    desiredDuration: initial?.duration ? String(initial.duration) : String(products.find((p) => p.slug === initial?.productSlug)?.defaultDuration ?? products[0]?.defaultDuration ?? 12),
    purpose: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine: '',
    postalCode: '',
    city: '',
    country: defaultCountry[locale] ?? 'Belgique',
    profession: '',
    employmentStatus: '' as FormValues['employmentStatus'],
    monthlyIncome: '',
    acceptPrivacy: false,
    acceptTerms: false,
    acceptDataProcessing: false,
  }));
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const submissionKey = useRef<string>('');
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    submissionKey.current = crypto.randomUUID();
  }, []);

  const product = useMemo(() => products.find((p) => p.slug === values.loanProductSlug), [products, values.loanProductSlug]);
  const fcc = (v: number) => formatCurrencyCompact(v, locale);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const estimate = useMemo(() => {
    if (!product) return null;
    const amount = Number(values.requestedAmount);
    const duration = Number(values.desiredDuration);
    if (!Number.isFinite(amount) || !Number.isFinite(duration) || amount <= 0 || duration <= 0) return null;
    return calculateLoan({ principal: amount, durationMonths: duration, rate: product.rate, fees: product.fees });
  }, [product, values.requestedAmount, values.desiredDuration]);

  const validateStep = (index: number): boolean => {
    const fields = stepFields[index] as readonly StepField[];
    const partial = schema.pick(Object.fromEntries(fields.map((x) => [x, true])) as Record<StepField, true>);
    const result = partial.safeParse(values);
    const nextErrors: Record<string, string> = {};
    if (!result.success) Object.assign(nextErrors, zodErrorsToRecord(result.error));

    if (index === 0 && product && result.success) {
      const amount = Number(values.requestedAmount);
      const duration = Number(values.desiredDuration);
      if (amount < product.minAmount || amount > product.maxAmount) nextErrors.requestedAmount = t(f.errors.productAmount, { min: fcc(product.minAmount), max: fcc(product.maxAmount) });
      if (duration < product.minDuration || duration > product.maxDuration) nextErrors.desiredDuration = t(f.errors.productDuration, { min: product.minDuration, max: product.maxDuration });
    }
    if (index === stepFields.length - 1) {
      for (const def of documentTypes) {
        if (def.required && (files[def.id]?.length ?? 0) === 0) nextErrors[`document:${def.id}`] = f.errors.documentRequired;
      }
      if (turnstileSiteKey && !turnstileToken) nextErrors._form = f.captchaError;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  const next = () => {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, stepFields.length - 1));
    scrollTop();
  };

  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    scrollTop();
  };

  const onTurnstileToken = useCallback((token: string | null) => setTurnstileToken(token), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    if (!validateStep(step)) return;

    const full = schema.safeParse(values);
    if (!full.success) {
      setErrors(zodErrorsToRecord(full.error));
      setGlobalError(f.errors.incomplete);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      for (const [key, value] of Object.entries(values)) fd.append(key, String(value));
      fd.append('submissionKey', submissionKey.current);
      fd.append('formToken', formToken);
      fd.append('locale', locale);
      fd.append('website', ''); // honeypot
      if (turnstileToken) fd.append('turnstileToken', turnstileToken);
      for (const [type, list] of Object.entries(files)) {
        for (const file of list) fd.append(`document:${type}`, file, file.name);
      }

      const res = await fetch('/api/applications', { method: 'POST', body: fd });
      const json = (await res.json().catch(() => null)) as
        | { ok: true; reference: string; stored: boolean; demo?: boolean }
        | { ok: false; message: string; fieldErrors?: Record<string, string> }
        | null;

      if (!json) throw new Error(f.errors.unreadable);
      if (!json.ok) {
        if (json.fieldErrors) {
          setErrors(json.fieldErrors);
          const firstField = Object.keys(json.fieldErrors)[0];
          const stepIndex = stepFields.findIndex((s) => (s as readonly string[]).includes(firstField));
          if (stepIndex >= 0) setStep(stepIndex);
        }
        setGlobalError(json.message);
        scrollTop();
        return;
      }

      const params = new URLSearchParams({ ref: json.reference });
      if (json.demo) params.set('demo', '1');
      router.push(localePath(locale, `/demande/confirmation?${params.toString()}`));
    } catch {
      setGlobalError(f.errors.network);
      scrollTop();
    } finally {
      setSubmitting(false);
    }
  };

  const slide = {
    initial: reduce ? { opacity: 1 } : { opacity: 0, x: 24 * direction },
    animate: { opacity: 1, x: 0 },
    exit: reduce ? { opacity: 1 } : { opacity: 0, x: -24 * direction },
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  };

  const legal = (path: string) => localePath(locale, path);

  return (
    <div ref={topRef} className="scroll-mt-24">
      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label={f.progress}>
        {f.steps.map((title, i) => {
          const state = i < step ? 'done' : i === step ? 'current' : 'todo';
          return (
            <li key={title} aria-current={state === 'current' ? 'step' : undefined} className="flex flex-col gap-2">
              <span className={cn('h-1.5 rounded-full transition-colors', state === 'done' && 'bg-brand-600', state === 'current' && 'bg-sage-400', state === 'todo' && 'bg-navy-100')} />
              <span className={cn('hidden text-xs font-medium sm:block', state === 'todo' ? 'text-ink-subtle' : 'text-navy-900')}>{i + 1}. {title}</span>
            </li>
          );
        })}
      </ol>
      <p className="mb-6 text-sm text-ink-muted sm:hidden">
        {t(f.stepOf, { n: step + 1, total: f.steps.length })} — <span className="font-medium text-navy-900">{f.steps[step]}</span>
      </p>

      {globalError && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{globalError}</p>
        </div>
      )}

      <form onSubmit={submit} noValidate encType="multipart/form-data">
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.fieldset key={step} {...slide} className="card-surface p-6 sm:p-8">
            <legend className="sr-only">{f.steps[step]}</legend>

            {step === 0 && (
              <div className="grid gap-5">
                <h2 className="text-xl font-semibold text-navy-900">{f.titles.project}</h2>
                <SelectField label={f.labels.product} name="loanProductSlug" required value={values.loanProductSlug} onChange={(e) => set('loanProductSlug', e.target.value)} error={errors.loanProductSlug}>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                </SelectField>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label={f.labels.amount} name="requestedAmount" type="number" inputMode="numeric" required min={product?.minAmount} max={product?.maxAmount} step={100} placeholder="30000" value={values.requestedAmount} onChange={(e) => set('requestedAmount', e.target.value)} error={errors.requestedAmount} help={product ? t(f.helps.amountRange, { min: fcc(product.minAmount), max: fcc(product.maxAmount) }) : undefined} />
                  <TextField label={f.labels.duration} name="desiredDuration" type="number" inputMode="numeric" required min={product?.minDuration} max={product?.maxDuration} placeholder="24" value={values.desiredDuration} onChange={(e) => set('desiredDuration', e.target.value)} error={errors.desiredDuration} help={product ? t(f.helps.durationRange, { min: product.minDuration, max: product.maxDuration }) : undefined} />
                </div>
                {estimate && (
                  <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900">{t(f.estimate, { amount: formatCurrency(estimate.monthlyPayment, locale) })}</p>
                )}
                <TextareaField label={f.labels.purpose} name="purpose" required placeholder={f.placeholders.purpose} maxLength={1500} value={values.purpose} onChange={(e) => set('purpose', e.target.value)} error={errors.purpose} help={f.helps.purpose} />
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5">
                <h2 className="text-xl font-semibold text-navy-900">{f.titles.contact}</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label={f.labels.firstName} name="firstName" autoComplete="given-name" required value={values.firstName} onChange={(e) => set('firstName', e.target.value)} error={errors.firstName} />
                  <TextField label={f.labels.lastName} name="lastName" autoComplete="family-name" required value={values.lastName} onChange={(e) => set('lastName', e.target.value)} error={errors.lastName} />
                  <TextField label={f.labels.email} name="email" type="email" autoComplete="email" inputMode="email" required value={values.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
                  <TextField label={f.labels.phone} name="phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="+32 470 00 00 00" value={values.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} help={f.helps.phone} />
                </div>
                <TextField label={f.labels.address} name="addressLine" autoComplete="street-address" required value={values.addressLine} onChange={(e) => set('addressLine', e.target.value)} error={errors.addressLine} />
                <div className="grid gap-5 sm:grid-cols-3">
                  <TextField label={f.labels.postalCode} name="postalCode" autoComplete="postal-code" required value={values.postalCode} onChange={(e) => set('postalCode', e.target.value)} error={errors.postalCode} />
                  <TextField label={f.labels.city} name="city" autoComplete="address-level2" required value={values.city} onChange={(e) => set('city', e.target.value)} error={errors.city} />
                  <TextField label={f.labels.country} name="country" autoComplete="country-name" required value={values.country} onChange={(e) => set('country', e.target.value)} error={errors.country} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5">
                <h2 className="text-xl font-semibold text-navy-900">{f.titles.situation}</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label={f.labels.profession} name="profession" autoComplete="organization-title" required value={values.profession} onChange={(e) => set('profession', e.target.value)} error={errors.profession} />
                  <SelectField label={f.labels.employment} name="employmentStatus" required value={values.employmentStatus} onChange={(e) => set('employmentStatus', e.target.value as FormValues['employmentStatus'])} error={errors.employmentStatus}>
                    <option value="">{f.placeholders.select}</option>
                    {employmentStatuses.map((k) => (
                      <option key={k} value={k}>{f.employment[k]}</option>
                    ))}
                  </SelectField>
                </div>
                <TextField label={f.labels.income} name="monthlyIncome" type="number" inputMode="numeric" required min={0} step={50} placeholder="2500" value={values.monthlyIncome} onChange={(e) => set('monthlyIncome', e.target.value)} error={errors.monthlyIncome} help={f.helps.income} className="sm:max-w-xs" />
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-navy-900">{f.titles.documents}</h2>
                  <p className="mt-1 text-sm text-ink-muted">{f.helps.documents}</p>
                </div>
                {documentTypes.map((def) => (
                  <FileUpload
                    key={def.id}
                    definition={def}
                    files={files[def.id] ?? []}
                    onChange={(list) => {
                      setFiles((x) => ({ ...x, [def.id]: list }));
                      setErrors((e) => { const n = { ...e }; delete n[`document:${def.id}`]; return n; });
                    }}
                    error={errors[`document:${def.id}`]}
                  />
                ))}

                <div className="border-t border-line pt-6">
                  <h2 className="text-xl font-semibold text-navy-900">{f.titles.consents}</h2>
                  <p className="mt-1 mb-4 text-sm text-ink-muted">{f.helps.consents}</p>
                  <div className="grid gap-3">
                    <CheckboxField label={f.consents.privacy} name="acceptPrivacy" checked={values.acceptPrivacy} onChange={(v) => set('acceptPrivacy', v)} error={errors.acceptPrivacy}>
                      <Link href={legal('/politique-de-confidentialite')} target="_blank" className="text-brand-700 underline underline-offset-2">{f.consents.privacyLink}</Link>
                    </CheckboxField>
                    <CheckboxField label={f.consents.terms} name="acceptTerms" checked={values.acceptTerms} onChange={(v) => set('acceptTerms', v)} error={errors.acceptTerms}>
                      <Link href={legal('/conditions-generales')} target="_blank" className="text-brand-700 underline underline-offset-2">{f.consents.termsLink}</Link>
                    </CheckboxField>
                    <CheckboxField label={f.consents.processing} name="acceptDataProcessing" checked={values.acceptDataProcessing} onChange={(v) => set('acceptDataProcessing', v)} error={errors.acceptDataProcessing}>
                      {f.consents.processingText}
                    </CheckboxField>
                  </div>
                </div>

                {turnstileSiteKey && (
                  <div>
                    <Turnstile siteKey={turnstileSiteKey} onToken={onTurnstileToken} />
                    {errors._form && <p className="ef-error" role="alert">{errors._form}</p>}
                  </div>
                )}
              </div>
            )}
          </motion.fieldset>
        </AnimatePresence>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {step > 0 && (
              <Button type="button" variant="ghost" onClick={prev} disabled={submitting}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {f.buttons.back}
              </Button>
            )}
          </div>
          {step < stepFields.length - 1 ? (
            <Button type="button" onClick={next} size="lg">
              {f.buttons.next}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" size="lg" loading={submitting}>
              {submitting ? f.buttons.submitting : f.buttons.submit}
              {!submitting && <Send className="h-4 w-4" aria-hidden="true" />}
            </Button>
          )}
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-surface-2/60 p-5 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          {f.secure}
        </p>
        <ButtonLink href={buildWhatsappLink(dict.whatsapp.general)} variant="whatsapp" size="sm">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {f.buttons.help}
        </ButtonLink>
      </div>

      <ul className="mt-6 grid gap-2 text-xs text-ink-subtle sm:grid-cols-3">
        {f.notes.map((note) => (
          <li key={note} className="flex items-start gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
