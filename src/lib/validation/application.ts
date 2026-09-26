/**
 * Schéma de validation de la demande de financement.
 * Utilisé côté client (retour immédiat) ET côté serveur (source de vérité),
 * avec des messages dans la langue de l'utilisateur.
 */
import { z } from 'zod';
import { loanLimits, uploadPolicy } from '@/lib/config/loans';
import { t } from '@/i18n/format';
import type { Dictionary } from '@/i18n/dictionaries/fr';

type V = Dictionary['validation'];

const nameRegex = /^[\p{L}\p{M}' \-.]+$/u;
const phoneRegex = /^\+?[0-9 .\-()]{6,24}$/;

export const employmentStatuses = ['employee', 'self_employed', 'business_owner', 'retired', 'student', 'unemployed', 'other'] as const;

export function createApplicationSchema(v: V) {
  const fmt = (n: number) => n.toLocaleString('fr-BE');

  const trimmed = (min: number, max: number, field: string) =>
    z
      .string({ required_error: t(v.required, { field }) })
      .trim()
      .min(min, t(v.min, { field, n: min }))
      .max(max, t(v.max, { field, n: max }));

  return z.object({
    firstName: trimmed(2, 60, v.fields.firstName).regex(nameRegex, v.nameChars),
    lastName: trimmed(2, 60, v.fields.lastName).regex(nameRegex, v.nameChars),
    email: z.string({ required_error: t(v.required, { field: v.fields.email }) }).trim().toLowerCase().email(v.email).max(160, v.emailLong),
    phone: trimmed(6, 24, v.fields.phone).regex(phoneRegex, v.phone),
    addressLine: trimmed(5, 160, v.fields.addressLine),
    postalCode: trimmed(2, 16, v.fields.postalCode),
    city: trimmed(2, 80, v.fields.city),
    country: trimmed(2, 80, v.fields.country),
    profession: trimmed(2, 100, v.fields.profession),
    employmentStatus: z.enum(employmentStatuses, { errorMap: () => ({ message: v.employment }) }),
    monthlyIncome: z.coerce.number({ invalid_type_error: v.number }).min(0, v.incomeNegative).max(10_000_000, v.incomeInvalid),
    loanProductSlug: z.string({ required_error: v.product }).trim().min(1, v.product).max(80).regex(/^[a-z0-9-]+$/, v.productInvalid),
    requestedAmount: z.coerce
      .number({ invalid_type_error: v.number })
      .min(loanLimits.minAmount, t(v.amountMin, { n: fmt(loanLimits.minAmount) }))
      .max(loanLimits.maxAmount, t(v.amountMax, { n: fmt(loanLimits.maxAmount) })),
    desiredDuration: z.coerce
      .number({ invalid_type_error: v.number })
      .int(v.durationInt)
      .min(loanLimits.minDuration, t(v.durationMin, { n: loanLimits.minDuration }))
      .max(loanLimits.maxDuration, t(v.durationMax, { n: loanLimits.maxDuration })),
    purpose: trimmed(10, 1500, v.fields.purpose),
    acceptPrivacy: z.literal(true, { errorMap: () => ({ message: v.acceptPrivacy }) }),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: v.acceptTerms }) }),
    acceptDataProcessing: z.literal(true, { errorMap: () => ({ message: v.acceptProcessing }) }),
  });
}

export type ApplicationInput = z.infer<ReturnType<typeof createApplicationSchema>>;
export type ApplicationFieldName = keyof ApplicationInput;

/** Validation d'un fichier côté client (le serveur re-vérifie la signature binaire). */
export function validateFileClientSide(file: File, messages: Dictionary['form']['upload']): string | null {
  const sizeMb = uploadPolicy.maxFileSizeBytes / 1024 / 1024;
  if (file.size === 0) return messages.empty;
  if (file.size > uploadPolicy.maxFileSizeBytes) return t(messages.tooLarge, { size: sizeMb });
  const accepted = uploadPolicy.acceptedMimeTypes as readonly string[];
  if (!accepted.includes(file.type)) return messages.unsupported;
  return null;
}

export function zodErrorsToRecord(error: z.ZodError): Record<string, string> {
  const record: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_form';
    if (!record[key]) record[key] = issue.message;
  }
  return record;
}

/** Format d'un numéro de référence : EF-AAAAMMJJ-XXXXXX */
export const referenceNumberRegex = /^EF-\d{8}-[A-Z0-9]{6}$/;
