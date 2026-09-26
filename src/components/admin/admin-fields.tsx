import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface Base {
  label: string;
  name: string;
  help?: string;
}

export function Input({ label, name, help, ...props }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="ef-label">{label}</label>
      <input id={name} name={name} className="ef-input py-2" {...props} />
      {help && <p className="ef-help">{help}</p>}
    </div>
  );
}

export function Textarea({ label, name, help, ...props }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={name} className="ef-label">{label}</label>
      <textarea id={name} name={name} className="ef-input min-h-24 py-2" {...props} />
      {help && <p className="ef-help">{help}</p>}
    </div>
  );
}

export function Select({ label, name, help, children, ...props }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label htmlFor={name} className="ef-label">{label}</label>
      <select id={name} name={name} className="ef-input py-2" {...props}>
        {children}
      </select>
      {help && <p className="ef-help">{help}</p>}
    </div>
  );
}

export function Checkbox({ label, name, help, ...props }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input type="checkbox" name={name} className="mt-0.5 h-4 w-4 rounded border-navy-300 text-brand-600" {...props} />
      <span>
        <span className="font-medium text-navy-900">{label}</span>
        {help && <span className="block text-xs text-ink-subtle">{help}</span>}
      </span>
    </label>
  );
}

export function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="card-surface p-5">
      <legend className="sr-only">{title}</legend>
      <h2 className="mb-4 text-base font-semibold text-navy-900">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </fieldset>
  );
}
