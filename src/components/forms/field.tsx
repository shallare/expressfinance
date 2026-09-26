'use client';

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '@/i18n/provider';
import { cn } from '@/lib/utils';

interface BaseProps {
  label: string;
  name: string;
  error?: string;
  help?: string;
  required?: boolean;
  className?: string;
}

function LabelRow({ label, name, required, help, error }: BaseProps) {
  const { dict } = useLocale();
  return (
    <>
      <label htmlFor={name} className="ef-label">
        {label}
        {required ? <span className="ml-0.5 text-red-500" aria-hidden="true">*</span> : <span className="ml-1 text-xs font-normal text-ink-subtle">{dict.form.optional}</span>}
      </label>
      {help && !error && (
        <p id={`${name}-help`} className="ef-help -mt-1 mb-1.5">{help}</p>
      )}
    </>
  );
}

function ErrorRow({ name, error }: { name: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${name}-error`} className="ef-error" role="alert">{error}</p>
  );
}

function describedBy(name: string, help?: string, error?: string) {
  return [error ? `${name}-error` : null, help && !error ? `${name}-help` : null].filter(Boolean).join(' ') || undefined;
}

export function TextField({ label, name, error, help, required, className, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <LabelRow label={label} name={name} required={required} help={help} error={error} />
      <input id={name} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy(name, help, error)} className="ef-input" {...props} />
      <ErrorRow name={name} error={error} />
    </div>
  );
}

export function TextareaField({ label, name, error, help, required, className, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <LabelRow label={label} name={name} required={required} help={help} error={error} />
      <textarea id={name} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy(name, help, error)} className="ef-input min-h-32 resize-y" {...props} />
      <ErrorRow name={name} error={error} />
    </div>
  );
}

export function SelectField({ label, name, error, help, required, className, children, ...props }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={className}>
      <LabelRow label={label} name={name} required={required} help={help} error={error} />
      <div className="relative">
        <select id={name} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy(name, help, error)} className="ef-input appearance-none pr-10" {...props}>
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
      </div>
      <ErrorRow name={name} error={error} />
    </div>
  );
}

export function CheckboxField({ label, name, error, checked, onChange, children }: { label: string; name: string; error?: string; checked: boolean; onChange: (v: boolean) => void; children?: React.ReactNode }) {
  return (
    <div>
      <label className={cn('flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors', error ? 'border-red-300 bg-red-50/40' : 'border-line bg-white hover:border-navy-200')}>
        <input type="checkbox" id={name} name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : undefined} className="mt-0.5 h-5 w-5 shrink-0 rounded border-navy-300 text-brand-600 focus:ring-brand-500" />
        <span className="text-sm text-ink-muted">
          <span className="font-medium text-navy-900">{label}</span>
          {children && <span className="mt-0.5 block">{children}</span>}
        </span>
      </label>
      <ErrorRow name={name} error={error} />
    </div>
  );
}
