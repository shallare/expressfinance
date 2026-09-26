import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { documentTypes, uploadPolicy } from '@/lib/config/loans';
import { getLoanProducts } from '@/lib/data/catalog';
import { notifyNewApplication } from '@/lib/notifications';
import { escapeHtml, isMailConfigured, mailTo, sendMail } from '@/lib/mail';
import { validateUploadedFile } from '@/lib/security/files';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { generateReferenceNumber, getClientIp, hashIp, isSameOrigin, verifyFormToken, verifyTurnstile } from '@/lib/security/request';
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { createApplicationSchema, zodErrorsToRecord } from '@/lib/validation/application';
import { getDictionary, t } from '@/i18n';
import { isLocale, type Locale } from '@/i18n/config';
import { localizeProduct } from '@/i18n/products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ErrorCode = 'forbidden_origin' | 'rate_limited' | 'invalid_payload' | 'validation_error' | 'bot_suspected' | 'captcha_failed' | 'duplicate' | 'file_error' | 'unavailable' | 'server_error';

function fail(status: number, code: ErrorCode, message: string, extra: Record<string, unknown> = {}, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, code, message, ...extra }, { status, headers });
}

const RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 }; // 5 demandes / heure / IP
const DUPLICATE_WINDOW_MINUTES = 10;
const MB = 1024 * 1024;

const metaSchema = z.object({
  submissionKey: z.string().uuid(),
  formToken: z.string().min(10).max(120),
  honeypot: z.string().max(0, 'bot').optional().default(''),
  turnstileToken: z.string().max(4096).optional(),
});

export async function POST(request: NextRequest) {
  /* 1. Origine ---------------------------------------------------------- */
  const ip = getClientIp(request.headers);
  if (!isSameOrigin(request.headers)) return fail(403, 'forbidden_origin', getDictionary('fr').api.forbiddenOrigin);

  /* 2. Lecture du formulaire -------------------------------------------- */
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return fail(400, 'invalid_payload', getDictionary('fr').api.unreadable);
  }

  const rawFields: Record<string, unknown> = {};
  const files: { type: string; file: File }[] = [];
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (key.startsWith('document:')) files.push({ type: key.slice('document:'.length), file: value });
    } else if (key.startsWith('accept')) {
      rawFields[key] = value === 'true' || value === 'on';
    } else {
      rawFields[key] = value;
    }
  }

  const locale: Locale = isLocale(String(rawFields.locale)) ? (rawFields.locale as Locale) : 'fr';
  const dict = getDictionary(locale);
  const api = dict.api;
  const docLabel = (id: string) => dict.form.documents[id as keyof typeof dict.form.documents]?.label ?? id;

  /* 3. Limite de débit en mémoire --------------------------------------- */
  const rl = checkRateLimit(`applications:${ip}`, RATE_LIMIT);
  if (!rl.allowed) {
    return fail(429, 'rate_limited', api.rateLimited, { retryAfterSeconds: rl.retryAfterSeconds }, { 'Retry-After': String(rl.retryAfterSeconds) });
  }

  /* 4. Métadonnées anti-robot ------------------------------------------- */
  const meta = metaSchema.safeParse({
    submissionKey: rawFields.submissionKey,
    formToken: rawFields.formToken,
    honeypot: rawFields.website ?? '',
    turnstileToken: rawFields.turnstileToken,
  });
  if (!meta.success) return fail(400, 'bot_suspected', api.botSuspected);
  const tokenStatus = verifyFormToken(meta.data.formToken);
  if (tokenStatus !== 'valid') return fail(400, 'bot_suspected', tokenStatus === 'expired' ? api.expired : api.botSuspected);
  if (!(await verifyTurnstile(meta.data.turnstileToken ?? null, ip))) return fail(400, 'captcha_failed', api.captcha);

  /* 5. Validation métier ------------------------------------------------ */
  const parsed = createApplicationSchema(dict.validation).safeParse(rawFields);
  if (!parsed.success) {
    return fail(422, 'validation_error', api.invalidFields, { fieldErrors: zodErrorsToRecord(parsed.error) });
  }
  const data = parsed.data;

  const products = await getLoanProducts();
  const rawProduct = products.find((p) => p.slug === data.loanProductSlug && p.active);
  if (!rawProduct) {
    return fail(422, 'validation_error', api.unknownProduct, { fieldErrors: { loanProductSlug: dict.validation.productInvalid } });
  }
  const product = localizeProduct(rawProduct, locale);
  const fmt = (n: number) => `${n.toLocaleString('fr-BE')} €`;
  const fieldErrors: Record<string, string> = {};
  if (data.requestedAmount < product.minAmount || data.requestedAmount > product.maxAmount) {
    fieldErrors.requestedAmount = t(dict.form.errors.productAmount, { min: fmt(product.minAmount), max: fmt(product.maxAmount) });
  }
  if (data.desiredDuration < product.minDuration || data.desiredDuration > product.maxDuration) {
    fieldErrors.desiredDuration = t(dict.form.errors.productDuration, { min: product.minDuration, max: product.maxDuration });
  }
  if (Object.keys(fieldErrors).length > 0) return fail(422, 'validation_error', api.invalidFields, { fieldErrors });

  /* 6. Fichiers --------------------------------------------------------- */
  if (files.length > uploadPolicy.maxFilesPerApplication) return fail(422, 'file_error', t(api.tooManyFiles, { n: uploadPolicy.maxFilesPerApplication }));
  const totalSize = files.reduce((s, f) => s + f.file.size, 0);
  if (totalSize > uploadPolicy.maxTotalSizeBytes) return fail(422, 'file_error', t(api.totalSize, { n: uploadPolicy.maxTotalSizeBytes / MB }));

  const countByType = new Map<string, number>();
  for (const { type } of files) {
    const def = documentTypes.find((d) => d.id === type);
    if (!def) return fail(422, 'file_error', api.unknownDocType);
    const count = (countByType.get(type) ?? 0) + 1;
    if (count > def.maxFiles) return fail(422, 'file_error', t(api.tooManyForType, { label: docLabel(type), n: def.maxFiles }));
    countByType.set(type, count);
  }
  for (const def of documentTypes) {
    if (def.required && !countByType.has(def.id)) {
      return fail(422, 'file_error', t(api.docRequired, { label: docLabel(def.id) }), { fieldErrors: { [`document:${def.id}`]: dict.form.errors.documentRequired } });
    }
  }
  const validatedFiles: { type: string; file: Awaited<ReturnType<typeof validateUploadedFile>> }[] = [];
  for (const entry of files) {
    const result = await validateUploadedFile(entry.file);
    if (!result.ok) {
      const messages: Record<string, string> = {
        empty: api.fileEmpty,
        too_large: t(api.fileTooLarge, { n: uploadPolicy.maxFileSizeBytes / MB }),
        unsupported_type: api.fileUnsupported,
        name_too_long: api.fileName,
      };
      return fail(422, 'file_error', messages[result.error], { fieldErrors: { [`document:${entry.type}`]: messages[result.error] } });
    }
    validatedFiles.push({ type: entry.type, file: result });
  }

  /* 7. Persistance ------------------------------------------------------ */
  const reference = generateReferenceNumber();

  if (!isSupabaseAdminConfigured) {
    // Sans base de données : la demande complète (avec pièces jointes) est
    // transmise par e-mail à l'administrateur. Rien n'est perdu.
    if (isMailConfigured) {
      const rows: [string, string][] = [
        ['Référence', reference],
        ['Langue', locale.toUpperCase()],
        ['Produit', rawProduct.name],
        ['Montant demandé', `${data.requestedAmount.toLocaleString('fr-BE')} €`],
        ['Durée souhaitée', `${data.desiredDuration} mois`],
        ['Prénom', data.firstName],
        ['Nom', data.lastName],
        ['E-mail', data.email],
        ['Téléphone', data.phone],
        ['Adresse', `${data.addressLine}, ${data.postalCode} ${data.city}, ${data.country}`],
        ['Profession', data.profession],
        ['Statut', data.employmentStatus],
        ['Revenu mensuel net', `${data.monthlyIncome.toLocaleString('fr-BE')} €`],
        ['Projet', data.purpose],
      ];
      const sent = await sendMail({
        to: mailTo(),
        subject: `[Express Finance] Nouvelle demande ${reference} — ${data.firstName} ${data.lastName}`,
        replyTo: data.email,
        text: ['Nouvelle demande de financement.', '', ...rows.map(([k, v]) => `${k} : ${v}`)].join('\n'),
        html: `<h2 style="color:#0d2c2e">Nouvelle demande de financement</h2><table cellpadding="8" style="border-collapse:collapse;border:1px solid #e2e8f0">${rows
          .map(([k, v]) => `<tr><th align="left" style="background:#f6f8fc;border:1px solid #e2e8f0">${escapeHtml(k)}</th><td style="border:1px solid #e2e8f0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
          .join('')}</table><p style="color:#64748b;font-size:12px">Les pièces justificatives sont jointes à cet e-mail.</p>`,
        attachments: validatedFiles
          .filter((f) => f.file.ok)
          .map((f) => (f.file.ok ? { filename: `${f.type}-${f.file.file.originalName || f.file.file.storageName}`, content: f.file.file.buffer, contentType: f.file.file.mime } : null))
          .filter((a): a is NonNullable<typeof a> => a !== null),
      });
      if (sent.ok) return NextResponse.json({ ok: true, reference, stored: false, sent: true });
      return fail(502, 'server_error', api.serverError);
    }
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ ok: true, reference, stored: false, demo: true });
    }
    return fail(503, 'unavailable', api.unavailable);
  }

  try {
    const supabase = createSupabaseAdminClient();
    const ipHash = hashIp(ip);

    const { data: existingByKey } = await supabase.from('loan_applications').select('reference_number').eq('submission_key', meta.data.submissionKey).maybeSingle();
    if (existingByKey) return NextResponse.json({ ok: true, reference: existingByKey.reference_number, stored: true, duplicate: true });

    const since = new Date(Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count: recentByEmail } = await supabase.from('loan_applications').select('id', { count: 'exact', head: true }).eq('email', data.email).gte('created_at', since);
    if ((recentByEmail ?? 0) > 0) return fail(409, 'duplicate', api.duplicateEmail);

    const hourAgo = new Date(Date.now() - RATE_LIMIT.windowMs).toISOString();
    const { count: recentByIp } = await supabase.from('loan_applications').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', hourAgo);
    if ((recentByIp ?? 0) >= RATE_LIMIT.limit) return fail(429, 'rate_limited', api.rateLimited);

    const { data: inserted, error: insertError } = await supabase
      .from('loan_applications')
      .insert({
        reference_number: reference,
        submission_key: meta.data.submissionKey,
        loan_product_id: /^[0-9a-f-]{36}$/.test(rawProduct.id) ? rawProduct.id : null,
        loan_product_slug: rawProduct.slug,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        address_line: data.addressLine,
        postal_code: data.postalCode,
        city: data.city,
        country: data.country,
        profession: data.profession,
        employment_status: data.employmentStatus,
        monthly_income: data.monthlyIncome,
        requested_amount: data.requestedAmount,
        desired_duration: data.desiredDuration,
        purpose: `[${locale.toUpperCase()}] ${data.purpose}`,
        ip_hash: ipHash,
        user_agent: request.headers.get('user-agent')?.slice(0, 300) ?? null,
      })
      .select('id')
      .single();

    if (insertError || !inserted) {
      if (insertError?.code === '23505') return fail(409, 'duplicate', api.duplicate);
      console.error('[applications] insertion impossible', insertError?.code);
      return fail(500, 'server_error', api.serverError);
    }

    const documentWarnings: string[] = [];
    for (const { type, file } of validatedFiles) {
      if (!file.ok) continue;
      const storagePath = `applications/${inserted.id}/${type}/${file.file.storageName}`;
      const { error: uploadError } = await supabase.storage.from('loan-documents').upload(storagePath, file.file.buffer, { contentType: file.file.mime, upsert: false });
      if (uploadError) {
        console.error('[applications] upload document échoué', uploadError.message);
        documentWarnings.push(type);
        continue;
      }
      const { error: docError } = await supabase.from('application_documents').insert({
        application_id: inserted.id,
        document_type: type,
        original_name: file.file.originalName,
        storage_path: storagePath,
        mime_type: file.file.mime,
        size_bytes: file.file.size,
      });
      if (docError) {
        console.error('[applications] enregistrement document échoué', docError.code);
        documentWarnings.push(type);
      }
    }

    void notifyNewApplication({ reference, productName: rawProduct.name, amount: data.requestedAmount, duration: data.desiredDuration });

    return NextResponse.json({ ok: true, reference, stored: true, documentWarnings: documentWarnings.length ? documentWarnings : undefined });
  } catch (error) {
    console.error('[applications] erreur inattendue', error instanceof Error ? error.message : '');
    return fail(500, 'server_error', api.unexpected);
  }
}

export function GET() {
  return NextResponse.json({ ok: false, message: 'Méthode non autorisée.' }, { status: 405 });
}
