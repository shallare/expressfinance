import { requireAdmin } from '@/lib/auth/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateTime } from '@/lib/finance/format';
import { Badge } from '@/components/ui/badge';
import { ActionForm } from '@/components/admin/action-form';
import { updateContactStatusAction } from '@/app/(admin)/admin/actions';

export const dynamic = 'force-dynamic';

const statusLabels = { new: 'Nouveau', contacted: 'Contacté', closed: 'Clôturé' } as const;
const statusTones = { new: 'info', contacted: 'success', closed: 'neutral' } as const;

export default async function AdminMessagesPage() {
  const session = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data: messages } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(200);
  const canEdit = session.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Messages de contact</h1>
        <p className="text-sm text-ink-muted">Demandes reçues via le formulaire de contact (également envoyées par e-mail).</p>
      </div>

      <div className="space-y-4">
        {(messages ?? []).map((m) => (
          <details key={m.id} className="card-surface">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="font-medium text-navy-900">{m.first_name} {m.last_name}</span>
              <span className="text-sm text-ink-muted">{formatCurrency(Number(m.requested_amount))} · {m.desired_duration} mois</span>
              <span className="text-xs text-ink-subtle">{m.locale.toUpperCase()}</span>
              <span className="ml-auto flex items-center gap-3">
                <Badge tone={statusTones[m.status]}>{statusLabels[m.status]}</Badge>
                <span className="text-xs text-ink-subtle">{formatDateTime(m.created_at)}</span>
              </span>
            </summary>
            <div className="grid gap-6 border-t border-line px-5 py-5 lg:grid-cols-3">
              <dl className="grid gap-2 text-sm lg:col-span-2 sm:grid-cols-2">
                <div><dt className="text-ink-subtle">Profession</dt><dd className="text-navy-900">{m.profession}</dd></div>
                <div><dt className="text-ink-subtle">Revenu mensuel</dt><dd className="text-navy-900">{formatCurrency(Number(m.monthly_income))}</dd></div>
                <div><dt className="text-ink-subtle">WhatsApp</dt><dd><a href={`https://wa.me/${m.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline-offset-2 hover:underline">{m.whatsapp}</a></dd></div>
                <div><dt className="text-ink-subtle">Téléphone</dt><dd>{m.phone ? <a href={`tel:${m.phone}`} className="text-brand-700 underline-offset-2 hover:underline">{m.phone}</a> : '—'}</dd></div>
                <div className="sm:col-span-2"><dt className="text-ink-subtle">E-mail</dt><dd><a href={`mailto:${m.email}`} className="text-brand-700 underline-offset-2 hover:underline">{m.email}</a></dd></div>
                <div className="sm:col-span-2"><dt className="text-ink-subtle">Motif du prêt</dt><dd className="whitespace-pre-wrap text-navy-900">{m.purpose}</dd></div>
                {m.other_info && <div className="sm:col-span-2"><dt className="text-ink-subtle">Autres informations</dt><dd className="whitespace-pre-wrap text-navy-900">{m.other_info}</dd></div>}
              </dl>
              <ActionForm action={updateContactStatusAction} submitLabel="Mettre à jour" disabled={!canEdit} className="grid gap-3">
                <input type="hidden" name="id" value={m.id} />
                <div>
                  <label htmlFor={`status-${m.id}`} className="ef-label">Statut</label>
                  <select id={`status-${m.id}`} name="status" defaultValue={m.status} disabled={!canEdit} className="ef-input py-2">
                    {Object.entries(statusLabels).map(([k, label]) => (
                      <option key={k} value={k}>{label}</option>
                    ))}
                  </select>
                </div>
              </ActionForm>
            </div>
          </details>
        ))}
        {(messages ?? []).length === 0 && <p className="text-sm text-ink-muted">Aucun message reçu pour le moment.</p>}
      </div>
    </div>
  );
}
