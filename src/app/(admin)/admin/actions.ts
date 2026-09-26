'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { applicationStatuses } from '@/lib/config/loans';
import { CACHE_TAGS } from '@/lib/data/catalog';
import { feesSchema, penaltySchema, rateModelSchema } from '@/lib/data/mappers';
import { requireAdmin } from '@/lib/auth/admin';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getClientIp } from '@/lib/security/request';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

/* -------------------------------------------------------------------------- */
/*  Authentification                                                          */
/* -------------------------------------------------------------------------- */

export async function signInAction(formData: FormData) {
  const ip = getClientIp(await headers());
  const rl = checkRateLimit(`admin-login:${ip}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) redirect('/admin/connexion?error=rate_limited');

  const parsed = z
    .object({
      email: z.string().trim().email().max(160),
      password: z.string().min(8).max(200),
      next: z.string().max(200).optional(),
    })
    .safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      next: formData.get('next') ?? undefined,
    });
  if (!parsed.success || !isSupabaseConfigured) redirect('/admin/connexion?error=invalid');

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) redirect('/admin/connexion?error=invalid');

  const { data: role } = await supabase.rpc('admin_role');
  if (role !== 'admin' && role !== 'viewer') {
    await supabase.auth.signOut();
    redirect('/admin/connexion?error=unauthorized');
  }

  const next = parsed.data.next?.startsWith('/admin') ? parsed.data.next : '/admin';
  redirect(next);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/admin/connexion');
}

/* -------------------------------------------------------------------------- */
/*  Demandes                                                                  */
/* -------------------------------------------------------------------------- */

const uuid = z.string().uuid();

export async function updateApplicationStatusAction(_prev: unknown, formData: FormData) {
  await requireAdmin('admin');
  const parsed = z
    .object({
      id: uuid,
      status: z.enum(applicationStatuses),
      note: z.string().trim().max(2000).optional(),
    })
    .safeParse({
      id: formData.get('id'),
      status: formData.get('status'),
      note: formData.get('note') ?? undefined,
    });
  if (!parsed.success) return { ok: false, message: 'Données invalides.' };

  const supabase = await createSupabaseServerClient();
  const { data: before } = await supabase
    .from('loan_applications')
    .select('status')
    .eq('id', parsed.data.id)
    .single();

  const { error } = await supabase
    .from('loan_applications')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);
  if (error) return { ok: false, message: 'Mise à jour impossible.' };

  // Le trigger journalise le changement ; on ajoute la note si fournie.
  if (parsed.data.note && before && before.status !== parsed.data.status) {
    const { data: last } = await supabase
      .from('application_status_history')
      .select('id')
      .eq('application_id', parsed.data.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (last) {
      await supabase.from('application_status_history').update({ note: parsed.data.note }).eq('id', last.id);
    }
  } else if (parsed.data.note) {
    await supabase.from('application_status_history').insert({
      application_id: parsed.data.id,
      from_status: parsed.data.status,
      to_status: parsed.data.status,
      note: parsed.data.note,
    });
  }

  revalidatePath(`/admin/demandes/${parsed.data.id}`);
  revalidatePath('/admin/demandes');
  revalidatePath('/admin');
  return { ok: true, message: 'Statut mis à jour.' };
}

export async function updateInternalNotesAction(_prev: unknown, formData: FormData) {
  await requireAdmin('admin');
  const parsed = z
    .object({ id: uuid, notes: z.string().max(5000) })
    .safeParse({ id: formData.get('id'), notes: formData.get('notes') ?? '' });
  if (!parsed.success) return { ok: false, message: 'Données invalides.' };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('loan_applications')
    .update({ internal_notes: parsed.data.notes.trim() || null })
    .eq('id', parsed.data.id);
  if (error) return { ok: false, message: 'Enregistrement impossible.' };
  revalidatePath(`/admin/demandes/${parsed.data.id}`);
  return { ok: true, message: 'Notes enregistrées.' };
}

/* -------------------------------------------------------------------------- */
/*  Produits                                                                  */
/* -------------------------------------------------------------------------- */

const productSchema = z
  .object({
    id: uuid.optional(),
    slug: z.string().trim().regex(/^[a-z0-9-]{2,80}$/, 'Slug invalide (lettres minuscules, chiffres, tirets).'),
    name: z.string().trim().min(2).max(120),
    short_name: z.string().trim().min(2).max(40),
    icon: z.enum(['User', 'Home', 'ShoppingBag', 'Briefcase', 'Rocket', 'Layers']),
    tagline: z.string().trim().max(160),
    description: z.string().trim().max(600),
    long_description: z.string().trim().max(3000),
    min_amount: z.coerce.number().positive(),
    max_amount: z.coerce.number().positive(),
    min_duration: z.coerce.number().int().min(1),
    max_duration: z.coerce.number().int().min(1),
    default_duration: z.coerce.number().int().min(1),
    interest_rate: z.coerce.number().min(0).max(100),
    rate_period: z.enum(['annual', 'monthly', 'total']),
    rate_method: z.enum(['amortizing', 'flat']),
    rate_confirmed: z.boolean(),
    fees_json: z.string().max(5000),
    penalty_grace: z.coerce.number().int().min(0).max(365),
    penalty_fixed: z.coerce.number().min(0),
    penalty_percent: z.coerce.number().min(0).max(100),
    penalty_rate: z.coerce.number().min(0).max(100),
    penalty_confirmed: z.boolean(),
    key_conditions: z.string().max(3000),
    use_cases: z.string().max(1000),
    required_documents: z.string().max(3000),
    active: z.boolean(),
    sort_order: z.coerce.number().int().min(0).max(1000),
  })
  .refine((d) => d.max_amount >= d.min_amount, { message: 'Le montant max doit être ≥ au min.', path: ['max_amount'] })
  .refine((d) => d.max_duration >= d.min_duration, { message: 'La durée max doit être ≥ au min.', path: ['max_duration'] })
  .refine((d) => d.default_duration >= d.min_duration && d.default_duration <= d.max_duration, {
    message: 'La durée par défaut doit être dans l’intervalle.',
    path: ['default_duration'],
  });

const lines = (v: string) =>
  v
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

function bool(formData: FormData, key: string) {
  return formData.get(key) === 'on' || formData.get(key) === 'true';
}

export async function saveProductAction(_prev: unknown, formData: FormData) {
  await requireAdmin('admin');
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = productSchema.safeParse({
    ...raw,
    id: raw.id || undefined,
    rate_confirmed: bool(formData, 'rate_confirmed'),
    penalty_confirmed: bool(formData, 'penalty_confirmed'),
    active: bool(formData, 'active'),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  const d = parsed.data;

  let fees: unknown = [];
  try {
    fees = feesSchema.parse(d.fees_json.trim() ? JSON.parse(d.fees_json) : []);
  } catch {
    return { ok: false, message: 'Le JSON des frais est invalide.' };
  }

  const payload = {
    slug: d.slug,
    name: d.name,
    short_name: d.short_name,
    icon: d.icon,
    tagline: d.tagline,
    description: d.description,
    long_description: d.long_description,
    min_amount: d.min_amount,
    max_amount: d.max_amount,
    min_duration: d.min_duration,
    max_duration: d.max_duration,
    default_duration: d.default_duration,
    interest_rate: d.interest_rate,
    rate_type: { period: d.rate_period, method: d.rate_method, isPlaceholder: !d.rate_confirmed },
    fees: fees as never,
    penalty_configuration: {
      gracePeriodDays: d.penalty_grace,
      fixedFee: d.penalty_fixed,
      percentOfInstallment: d.penalty_percent,
      lateInterestAnnualPercent: d.penalty_rate,
      isPlaceholder: !d.penalty_confirmed,
    },
    key_conditions: lines(d.key_conditions),
    use_cases: lines(d.use_cases),
    required_documents: lines(d.required_documents),
    active: d.active,
    sort_order: d.sort_order,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = d.id
    ? await supabase.from('loan_products').update(payload).eq('id', d.id)
    : await supabase.from('loan_products').insert(payload);
  if (error) return { ok: false, message: error.code === '23505' ? 'Ce slug existe déjà.' : 'Enregistrement impossible.' };

  revalidateTag(CACHE_TAGS.products);
  revalidatePath('/admin/produits');
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Produit enregistré.' };
}

/* -------------------------------------------------------------------------- */
/*  Témoignages                                                               */
/* -------------------------------------------------------------------------- */

const testimonialSchema = z.object({
  id: uuid.optional(),
  name: z.string().trim().min(2).max(80),
  content: z.string().trim().min(10).max(1200),
  loan_type: z.string().trim().min(2).max(80),
  image_url: z.string().trim().url().max(500).or(z.literal('')),
  rating: z.coerce.number().int().min(1).max(5),
  location: z.string().trim().max(80),
  published_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal('')),
  consent_reference: z.string().trim().max(200),
  active: z.boolean(),
  sort_order: z.coerce.number().int().min(0).max(1000),
});

export async function saveTestimonialAction(_prev: unknown, formData: FormData) {
  await requireAdmin('admin');
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = testimonialSchema.safeParse({ ...raw, id: raw.id || undefined, active: bool(formData, 'active') });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  const d = parsed.data;
  if (d.active && !d.consent_reference) {
    return { ok: false, message: 'Indiquez une référence de consentement avant de publier un témoignage.' };
  }
  const payload = {
    name: d.name,
    content: d.content,
    loan_type: d.loan_type,
    image_url: d.image_url || null,
    rating: d.rating,
    location: d.location || null,
    published_on: d.published_on || null,
    consent_reference: d.consent_reference || null,
    active: d.active,
    sort_order: d.sort_order,
  };
  const supabase = await createSupabaseServerClient();
  const { error } = d.id
    ? await supabase.from('testimonials').update(payload).eq('id', d.id)
    : await supabase.from('testimonials').insert(payload);
  if (error) return { ok: false, message: 'Enregistrement impossible.' };
  revalidateTag(CACHE_TAGS.testimonials);
  revalidatePath('/admin/temoignages');
  revalidatePath('/');
  return { ok: true, message: 'Témoignage enregistré.' };
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin('admin');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return;
  const supabase = await createSupabaseServerClient();
  await supabase.from('testimonials').delete().eq('id', id.data);
  revalidateTag(CACHE_TAGS.testimonials);
  revalidatePath('/admin/temoignages');
  revalidatePath('/');
}

/* -------------------------------------------------------------------------- */
/*  Partenaires                                                               */
/* -------------------------------------------------------------------------- */

const partnerSchema = z.object({
  id: uuid.optional(),
  name: z.string().trim().min(2).max(120),
  logo_url: z.string().trim().url().max(500).or(z.literal('')),
  website: z.string().trim().url().max(300).or(z.literal('')),
  verified: z.boolean(),
  logo_rights_confirmed: z.boolean(),
  active: z.boolean(),
  sort_order: z.coerce.number().int().min(0).max(1000),
});

export async function savePartnerAction(_prev: unknown, formData: FormData) {
  await requireAdmin('admin');
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = partnerSchema.safeParse({
    ...raw,
    id: raw.id || undefined,
    verified: bool(formData, 'verified'),
    logo_rights_confirmed: bool(formData, 'logo_rights_confirmed'),
    active: bool(formData, 'active'),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  const d = parsed.data;
  const payload = {
    name: d.name,
    logo_url: d.logo_url || null,
    website: d.website || null,
    verified: d.verified,
    logo_rights_confirmed: d.logo_rights_confirmed,
    active: d.active,
    sort_order: d.sort_order,
  };
  const supabase = await createSupabaseServerClient();
  const { error } = d.id
    ? await supabase.from('partners').update(payload).eq('id', d.id)
    : await supabase.from('partners').insert(payload);
  if (error) return { ok: false, message: 'Enregistrement impossible.' };
  revalidateTag(CACHE_TAGS.partners);
  revalidatePath('/admin/partenaires');
  revalidatePath('/');
  return { ok: true, message: 'Partenaire enregistré.' };
}

export async function deletePartnerAction(formData: FormData) {
  await requireAdmin('admin');
  const id = uuid.safeParse(formData.get('id'));
  if (!id.success) return;
  const supabase = await createSupabaseServerClient();
  await supabase.from('partners').delete().eq('id', id.data);
  revalidateTag(CACHE_TAGS.partners);
  revalidatePath('/admin/partenaires');
  revalidatePath('/');
}

/* -------------------------------------------------------------------------- */
/*  Paramètres du simulateur                                                  */
/* -------------------------------------------------------------------------- */

const settingsSchema = z
  .object({
    rate_percent: z.coerce.number().min(0).max(100),
    rate_period: z.enum(['annual', 'monthly', 'total']),
    rate_method: z.enum(['amortizing', 'flat']),
    rate_confirmed: z.boolean(),
    fees_json: z.string().max(5000),
    penalty_grace: z.coerce.number().int().min(0).max(365),
    penalty_fixed: z.coerce.number().min(0),
    penalty_percent: z.coerce.number().min(0).max(100),
    penalty_rate: z.coerce.number().min(0).max(100),
    penalty_confirmed: z.boolean(),
    min_amount: z.coerce.number().positive(),
    max_amount: z.coerce.number().positive(),
    min_duration: z.coerce.number().int().min(1),
    max_duration: z.coerce.number().int().min(1),
    default_duration: z.coerce.number().int().min(1),
    allow_user_rate_override: z.boolean(),
  })
  .refine((d) => d.max_amount >= d.min_amount, { message: 'Montant max < min.' })
  .refine((d) => d.max_duration >= d.min_duration, { message: 'Durée max < min.' });

export async function saveSettingsAction(_prev: unknown, formData: FormData) {
  await requireAdmin('admin');
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = settingsSchema.safeParse({
    ...raw,
    rate_confirmed: bool(formData, 'rate_confirmed'),
    penalty_confirmed: bool(formData, 'penalty_confirmed'),
    allow_user_rate_override: bool(formData, 'allow_user_rate_override'),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  const d = parsed.data;

  let fees: unknown = [];
  try {
    fees = feesSchema.parse(d.fees_json.trim() ? JSON.parse(d.fees_json) : []);
  } catch {
    return { ok: false, message: 'Le JSON des frais est invalide.' };
  }
  const rate_model = rateModelSchema.parse({
    percent: d.rate_percent,
    period: d.rate_period,
    method: d.rate_period === 'total' ? 'flat' : d.rate_method,
    isPlaceholder: !d.rate_confirmed,
  });
  const penalty_configuration = penaltySchema.parse({
    gracePeriodDays: d.penalty_grace,
    fixedFee: d.penalty_fixed,
    percentOfInstallment: d.penalty_percent,
    lateInterestAnnualPercent: d.penalty_rate,
    isPlaceholder: !d.penalty_confirmed,
  });

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('simulator_settings')
    .update({
      rate_model: rate_model as never,
      fees: fees as never,
      penalty_configuration: penalty_configuration as never,
      min_amount: d.min_amount,
      max_amount: d.max_amount,
      min_duration: d.min_duration,
      max_duration: d.max_duration,
      default_duration: d.default_duration,
      allow_user_rate_override: d.allow_user_rate_override,
    })
    .eq('id', 1);
  if (error) return { ok: false, message: 'Enregistrement impossible.' };

  revalidateTag(CACHE_TAGS.settings);
  revalidatePath('/admin/parametres');
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Paramètres enregistrés.' };
}

/* -------------------------------------------------------------------------- */
/*  Messages de contact                                                       */
/* -------------------------------------------------------------------------- */

export async function updateContactStatusAction(_prev: unknown, formData: FormData) {
  await requireAdmin('admin');
  const parsed = z
    .object({ id: uuid, status: z.enum(['new', 'contacted', 'closed']) })
    .safeParse({ id: formData.get('id'), status: formData.get('status') });
  if (!parsed.success) return { ok: false, message: 'Données invalides.' };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('contact_messages').update({ status: parsed.data.status }).eq('id', parsed.data.id);
  if (error) return { ok: false, message: 'Mise à jour impossible.' };
  revalidatePath('/admin/messages');
  return { ok: true, message: 'Statut mis à jour.' };
}
