import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download, FileText, Mail, MessageCircle, Phone } from 'lucide-react';
import { z } from 'zod';
import { applicationStatusLabels, applicationStatuses, documentTypeLabelsFr } from '@/lib/config/loans';
import { requireAdmin } from '@/lib/auth/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateTime } from '@/lib/finance/format';
import { getDictionary } from '@/i18n';
import { siteConfig } from '@/lib/config/site';
import { StatusBadge } from '@/components/admin/status-badge';
import { ActionForm } from '@/components/admin/action-form';
import { updateApplicationStatusAction, updateInternalNotesAction } from '@/app/(admin)/admin/actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-3">
      <dt className="text-sm text-ink-subtle">{label}</dt>
      <dd className="text-sm text-navy-900 sm:col-span-2">{children}</dd>
    </div>
  );
}

export default async function AdminApplicationDetailPage({ params }: PageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const supabase = await createSupabaseServerClient();
  const [{ data: app }, { data: docs }, { data: history }] = await Promise.all([
    supabase.from('loan_applications').select('*').eq('id', id).maybeSingle(),
    supabase.from('application_documents').select('*').eq('application_id', id).order('created_at'),
    supabase.from('application_status_history').select('*').eq('application_id', id).order('created_at', { ascending: false }),
  ]);
  if (!app) notFound();

  const canEdit = session.role === 'admin';
  const employmentLabels = getDictionary('fr').form.employment;
  const whatsappToApplicant = `https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Bonjour ${app.first_name}, nous vous contactons de la part de ${siteConfig.name} au sujet de votre demande ${app.reference_number}.`,
  )}`;

  return (
    <div className="space-y-6">
      <Link href="/admin/demandes" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Toutes les demandes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-ink-subtle">{app.reference_number}</p>
          <h1 className="text-2xl font-bold text-navy-900">
            {app.first_name} {app.last_name}
          </h1>
          <p className="text-sm text-ink-muted">Reçue le {formatDateTime(app.created_at)}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card-surface p-5">
            <h2 className="mb-2 font-semibold text-navy-900">Projet</h2>
            <dl className="divide-y divide-line">
              <Row label="Produit">{app.loan_product_slug}</Row>
              <Row label="Montant demandé">{formatCurrency(Number(app.requested_amount))}</Row>
              <Row label="Durée souhaitée">{app.desired_duration} mois</Row>
              <Row label="Description"><p className="whitespace-pre-wrap">{app.purpose}</p></Row>
            </dl>
          </section>

          <section className="card-surface p-5">
            <h2 className="mb-2 font-semibold text-navy-900">Demandeur</h2>
            <dl className="divide-y divide-line">
              <Row label="E-mail"><a href={`mailto:${app.email}`} className="text-brand-700 underline-offset-2 hover:underline">{app.email}</a></Row>
              <Row label="Téléphone"><a href={`tel:${app.phone}`} className="text-brand-700 underline-offset-2 hover:underline">{app.phone}</a></Row>
              <Row label="Adresse">{app.address_line}, {app.postal_code} {app.city}, {app.country}</Row>
              <Row label="Profession">{app.profession}</Row>
              <Row label="Statut professionnel">{employmentLabels[app.employment_status as keyof typeof employmentLabels] ?? app.employment_status}</Row>
              <Row label="Revenu mensuel déclaré">{formatCurrency(Number(app.monthly_income))}</Row>
              <Row label="Consentements">
                Confidentialité : {formatDateTime(app.consent_privacy_at)} · CGU : {formatDateTime(app.consent_terms_at)} · Traitement : {formatDateTime(app.consent_processing_at)}
              </Row>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`mailto:${app.email}?subject=${encodeURIComponent(`Votre demande ${app.reference_number} — ${siteConfig.name}`)}`} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-navy-50">
                <Mail className="h-4 w-4" aria-hidden="true" /> E-mail
              </a>
              <a href={`tel:${app.phone}`} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-navy-50">
                <Phone className="h-4 w-4" aria-hidden="true" /> Appeler
              </a>
              <a href={whatsappToApplicant} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-navy-50">
                <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </section>

          <section className="card-surface p-5">
            <h2 className="mb-3 font-semibold text-navy-900">Documents ({docs?.length ?? 0})</h2>
            {docs && docs.length > 0 ? (
              <ul className="divide-y divide-line">
                {docs.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                    <FileText className="h-4 w-4 text-ink-subtle" aria-hidden="true" />
                    <span className="font-medium text-navy-900">{documentTypeLabelsFr[d.document_type as keyof typeof documentTypeLabelsFr] ?? d.document_type}</span>
                    <span className="text-ink-muted">{d.original_name}</span>
                    <span className="text-xs text-ink-subtle">{Math.round(d.size_bytes / 1024)} Ko</span>
                    <a href={`/api/admin/documents/${d.id}`} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-brand-700 underline-offset-2 hover:underline">
                      <Download className="h-4 w-4" aria-hidden="true" /> Ouvrir (lien temporaire)
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-muted">Aucun document joint.</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="card-surface p-5">
            <h2 className="mb-3 font-semibold text-navy-900">Changer le statut</h2>
            <ActionForm action={updateApplicationStatusAction} submitLabel="Mettre à jour" disabled={!canEdit} className="grid gap-3">
              <input type="hidden" name="id" value={app.id} />
              <div>
                <label htmlFor="status" className="ef-label">Nouveau statut</label>
                <select id="status" name="status" defaultValue={app.status} disabled={!canEdit} className="ef-input py-2">
                  {applicationStatuses.map((s) => (
                    <option key={s} value={s}>{applicationStatusLabels[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="note" className="ef-label">Commentaire (journal)</label>
                <textarea id="note" name="note" rows={3} disabled={!canEdit} className="ef-input py-2" placeholder="Motif, pièces demandées…" />
              </div>
            </ActionForm>
          </section>

          <section className="card-surface p-5">
            <h2 className="mb-3 font-semibold text-navy-900">Notes internes</h2>
            <ActionForm action={updateInternalNotesAction} submitLabel="Enregistrer les notes" variant="outline" disabled={!canEdit} className="grid gap-3">
              <input type="hidden" name="id" value={app.id} />
              <textarea name="notes" rows={6} defaultValue={app.internal_notes ?? ''} disabled={!canEdit} className="ef-input py-2" placeholder="Visibles uniquement par l’équipe." />
            </ActionForm>
          </section>

          <section className="card-surface p-5">
            <h2 className="mb-3 font-semibold text-navy-900">Historique</h2>
            <ol className="space-y-3 text-sm">
              {(history ?? []).map((h) => (
                <li key={h.id} className="border-l-2 border-navy-100 pl-3">
                  <p className="text-navy-900">
                    {h.from_status ? `${applicationStatusLabels[h.from_status]} → ` : ''}
                    <strong>{applicationStatusLabels[h.to_status]}</strong>
                  </p>
                  {h.note && <p className="text-ink-muted">{h.note}</p>}
                  <p className="text-xs text-ink-subtle">{formatDateTime(h.created_at)}</p>
                </li>
              ))}
              {(history ?? []).length === 0 && <li className="text-ink-muted">Aucun événement.</li>}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
