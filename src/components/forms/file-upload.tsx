'use client';

import { useId, useRef, useState } from 'react';
import { FileText, Image as ImageIcon, Trash2, UploadCloud } from 'lucide-react';
import type { DocumentTypeDefinition } from '@/lib/config/loans';
import { uploadPolicy } from '@/lib/config/loans';
import { validateFileClientSide } from '@/lib/validation/application';
import { t } from '@/i18n/format';
import { useLocale } from '@/i18n/provider';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  definition: DocumentTypeDefinition;
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} Ko` : `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

export function FileUpload({ definition, files, onChange, error }: FileUploadProps) {
  const id = useId();
  const { dict } = useLocale();
  const u = dict.form.upload;
  const doc = dict.form.documents[definition.id];
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: FileList | File[]) => {
    const next = [...files];
    let err: string | null = null;
    for (const file of Array.from(incoming)) {
      if (next.length >= definition.maxFiles) {
        err = t(u.tooMany, { n: definition.maxFiles });
        break;
      }
      const problem = validateFileClientSide(file, u);
      if (problem) {
        err = `${file.name} : ${problem}`;
        continue;
      }
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      next.push(file);
    }
    setLocalError(err);
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
    setLocalError(null);
  };

  const shownError = error ?? localError;

  return (
    <div>
      <p className="ef-label" id={`${id}-label`}>
        {doc.label}
        {definition.required ? <span className="ml-0.5 text-red-500" aria-hidden="true">*</span> : <span className="ml-1 text-xs font-normal text-ink-subtle">{dict.form.optional}</span>}
      </p>
      <p className="mb-2 text-xs text-ink-subtle">{doc.description}</p>

      <div
        role="button"
        tabIndex={0}
        aria-labelledby={`${id}-label`}
        aria-describedby={shownError ? `${id}-error` : undefined}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        className={cn('flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors', dragging ? 'border-brand-500 bg-brand-50' : 'border-line bg-surface-2/40 hover:border-brand-300 hover:bg-brand-50/40', shownError && 'border-red-300')}
      >
        <UploadCloud className="h-7 w-7 text-brand-600" aria-hidden="true" />
        <span className="text-sm font-medium text-navy-900">{u.drop}</span>
        <span className="text-xs text-ink-subtle">{t(u.hint, { size: uploadPolicy.maxFileSizeBytes / 1024 / 1024, n: definition.maxFiles })}</span>
        <input ref={inputRef} type="file" className="sr-only" accept={uploadPolicy.acceptedExtensions.join(',')} multiple={definition.maxFiles > 1} onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }} tabIndex={-1} />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li key={`${file.name}-${file.size}`} className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2 text-sm">
              {file.type === 'application/pdf' ? <FileText className="h-4 w-4 shrink-0 text-red-500" aria-hidden="true" /> : <ImageIcon className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />}
              <span className="min-w-0 flex-1 truncate text-navy-900">{file.name}</span>
              <span className="shrink-0 text-xs text-ink-subtle">{formatSize(file.size)}</span>
              <button type="button" onClick={() => remove(i)} aria-label={t(u.remove, { name: file.name })} className="shrink-0 rounded-md p-1 text-ink-subtle hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {shownError && (
        <p id={`${id}-error`} className="ef-error" role="alert">{shownError}</p>
      )}
    </div>
  );
}
