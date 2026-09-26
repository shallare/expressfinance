'use client';

import { useActionState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ActionResult = { ok: boolean; message?: string } | undefined | null;

interface ActionFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

/** Formulaire branché sur une Server Action avec retour d'état (succès / erreur). */
export function ActionForm({ action, children, submitLabel = 'Enregistrer', className, disabled, variant = 'primary' }: ActionFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" loading={pending} disabled={disabled} variant={variant}>
          {submitLabel}
        </Button>
        {state?.message && (
          <p role="status" className={`flex items-center gap-2 text-sm ${state.ok ? 'text-emerald-700' : 'text-red-700'}`}>
            {state.ok ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <AlertCircle className="h-4 w-4" aria-hidden="true" />}
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
