import { z } from 'zod';
import { loanLimits } from '@/lib/config/loans';
import { t } from '@/i18n/format';
import type { Dictionary } from '@/i18n/dictionaries/fr';

const nameRegex = /^[\p{L}\p{M}' \-.]+$/u;
const phoneRegex = /^\+?[0-9 .\-()]{6,24}$/;

/** Schéma du formulaire de contact (client + serveur), messages localisés. */
export function createContactSchema(v: Dictionary['validation'], cf: Dictionary['contactForm']) {
  const fmt = (n: number) => n.toLocaleString('fr-BE');
  const trimmed = (min: number, max: number, field: string) =>
    z.string({ required_error: t(v.required, { field }) }).trim().min(min, t(v.min, { field, n: min })).max(max, t(v.max, { field, n: max }));

  return z.object({
    firstName: trimmed(2, 60, v.fields.firstName).regex(nameRegex, v.nameChars),
    lastName: trimmed(2, 60, v.fields.lastName).regex(nameRegex, v.nameChars),
    profession: trimmed(2, 100, v.fields.profession),
    monthlyIncome: z.coerce.number({ invalid_type_error: v.number }).min(0, v.incomeNegative).max(10_000_000, v.incomeInvalid),
    requestedAmount: z.coerce
      .number({ invalid_type_error: v.number })
      .min(loanLimits.minAmount, t(v.amountMin, { n: fmt(loanLimits.minAmount) }))
      .max(loanLimits.maxAmount, t(v.amountMax, { n: fmt(loanLimits.maxAmount) })),
    desiredDuration: z.coerce
      .number({ invalid_type_error: v.number })
      .int(v.durationInt)
      .min(loanLimits.minDuration, t(v.durationMin, { n: loanLimits.minDuration }))
      .max(loanLimits.maxDuration, t(v.durationMax, { n: loanLimits.maxDuration })),
    whatsapp: trimmed(6, 24, v.fields.phone).regex(phoneRegex, v.phone),
    phone: z.string().trim().max(24).regex(phoneRegex, v.phone).or(z.literal('')),
    email: z.string({ required_error: t(v.required, { field: v.fields.email }) }).trim().toLowerCase().email(v.email).max(160, v.emailLong),
    purpose: trimmed(5, 600, v.fields.purpose),
    other: z.string().trim().max(1500, t(v.max, { field: cf.fields.other, n: 1500 })).or(z.literal('')),
  });
}

export type ContactInput = z.infer<ReturnType<typeof createContactSchema>>;
