import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { escapeHtml, isMailConfigured, mailTo, sendMail } from '@/lib/mail';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getClientIp, hashIp, isSameOrigin, verifyFormToken, verifyTurnstile } from '@/lib/security/request';
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { createContactSchema } from '@/lib/validation/contact';
import { getDictionary } from '@/i18n';
import { isLocale, type Locale } from '@/i18n/config';
import { zodErrorsToRecord } from '@/lib/validation/application';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

const metaSchema = z.object({
  formToken: z.string().min(10).max(120),
  honeypot: z.string().max(0).optional().default(''),
  turnstileToken: z.string().max(4096).optional(),
  locale: z.string().max(5).optional(),
});

function fail(status: number, code: string, message: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, code, message, ...extra }, { status });
}

/**
 * POST /api/contact — formulaire de contact.
 * Protections : origine, limite de débit, honeypot, jeton HMAC temporel,
 * Turnstile optionnel, validation Zod, échappement HTML, en-têtes nettoyés.
 * Le message est envoyé par e-mail à l'administrateur et archivé en base si
 * Supabase est configuré.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!isSameOrigin(request.headers)) return fail(403, 'forbidden_origin', getDictionary('fr').api.forbiddenOrigin);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
    if (!body || typeof body !== 'object') throw new Error('invalid');
  } catch {
    return fail(400, 'invalid_payload', getDictionary('fr').api.unreadable);
  }

  const locale: Locale = isLocale(String(body.locale)) ? (body.locale as Locale) : 'fr';
  const dict = getDictionary(locale);
  const api = dict.api;

  const rl = checkRateLimit(`contact:${ip}`, RATE_LIMIT);
  if (!rl.allowed) return fail(429, 'rate_limited', api.rateLimited, { retryAfterSeconds: rl.retryAfterSeconds });

  const meta = metaSchema.safeParse({ formToken: body.formToken, honeypot: body.website ?? '', turnstileToken: body.turnstileToken, locale: body.locale });
  if (!meta.success) return fail(400, 'bot_suspected', api.botSuspected);
  const tokenStatus = verifyFormToken(meta.data.formToken);
  if (tokenStatus !== 'valid') return fail(400, 'bot_suspected', tokenStatus === 'expired' ? api.expired : api.botSuspected);
  if (!(await verifyTurnstile(meta.data.turnstileToken ?? null, ip))) return fail(400, 'captcha_failed', api.captcha);

  const parsed = createContactSchema(dict.validation, dict.contactForm).safeParse(body);
  if (!parsed.success) return fail(422, 'validation_error', dict.contactForm.errors.invalid, { fieldErrors: zodErrorsToRecord(parsed.error) });
  const d = parsed.data;

  /* Archivage (facultatif) ---------------------------------------------- */
  if (isSupabaseAdminConfigured) {
    try {
      const supabase = createSupabaseAdminClient();
      await supabase.from('contact_messages').insert({
        locale,
        first_name: d.firstName,
        last_name: d.lastName,
        profession: d.profession,
        monthly_income: d.monthlyIncome,
        requested_amount: d.requestedAmount,
        desired_duration: d.desiredDuration,
        whatsapp: d.whatsapp,
        phone: d.phone || null,
        email: d.email,
        purpose: d.purpose,
        other_info: d.other || null,
        ip_hash: hashIp(ip),
      });
    } catch (error) {
      console.error('[contact] archivage impossible', error instanceof Error ? error.message : '');
    }
  }

  /* E-mail à l'administrateur --------------------------------------------- */
  const fmt = (n: number) => `${n.toLocaleString('fr-BE')} €`;
  const rows: [string, string][] = [
    ['Langue', locale.toUpperCase()],
    ['Prénom', d.firstName],
    ['Nom', d.lastName],
    ['Profession', d.profession],
    ['Revenu mensuel net', fmt(d.monthlyIncome)],
    ['Montant demandé', fmt(d.requestedAmount)],
    ['Durée souhaitée', `${d.desiredDuration} mois`],
    ['WhatsApp', d.whatsapp],
    ['Téléphone (appel)', d.phone || '—'],
    ['E-mail', d.email],
    ['Motif du prêt', d.purpose],
    ['Autres informations', d.other || '—'],
  ];
  const text = ['Nouvelle demande de contact — Express Finance', '', ...rows.map(([k, v]) => `${k} : ${v}`)].join('\n');
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#0f172a">
<h2 style="color:#0d2c2e">Nouvelle demande de contact — Express Finance</h2>
<table cellpadding="8" style="border-collapse:collapse;border:1px solid #e2e8f0">
${rows.map(([k, v]) => `<tr><th align="left" style="background:#f6f8fc;border:1px solid #e2e8f0">${escapeHtml(k)}</th><td style="border:1px solid #e2e8f0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join('')}
</table>
<p style="color:#64748b;font-size:12px">Message envoyé depuis le formulaire de contact du site. Répondre à cet e-mail écrit directement au demandeur.</p>
</body></html>`;

  if (!isMailConfigured) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[contact] e-mail non configuré — message reçu (mode démonstration)');
      return NextResponse.json({ ok: true, sent: false, demo: true });
    }
    return fail(503, 'unavailable', dict.contactForm.errors.generic);
  }

  const result = await sendMail({
    to: mailTo(),
    subject: `[Express Finance] Contact — ${d.firstName} ${d.lastName} — ${fmt(d.requestedAmount)}`,
    text,
    html,
    replyTo: d.email,
  });
  if (!result.ok) return fail(502, 'mail_error', dict.contactForm.errors.generic);

  return NextResponse.json({ ok: true, sent: true });
}

export function GET() {
  return NextResponse.json({ ok: false, message: 'Méthode non autorisée.' }, { status: 405 });
}
