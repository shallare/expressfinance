import Link from 'next/link';
import { Search } from 'lucide-react';
import { applicationStatusLabels, applicationStatuses, type ApplicationStatus } from '@/lib/config/loans';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateTime } from '@/lib/finance/format';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 25;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statut = typeof params.statut === 'string' && (applicationStatuses as readonly string[]).includes(params.statut)
    ? (params.statut as ApplicationStatus)
    : undefined;
  const q = typeof params.q === 'string' ? params.q.trim().slice(0, 80) : '';
  const page = Math.max(1, Number(params.page) || 1);

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('loan_applications')
    .select('id, reference_number, first_name, last_name, email, requested_amount, desired_duration, loan_product_slug, status, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (statut) query = query.eq('status', statut);
  if (q) {
    // Recherche simple sur référence, nom, e-mail (échappement des caractères spéciaux PostgREST).
    const safe = q.replace(/[%_,()]/g, ' ');
    query = query.or(`reference_number.ilike.%${safe}%,last_name.ilike.%${safe}%,first_name.ilike.%${safe}%,email.ilike.%${safe}%`);
  }
  const { data, count } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Demandes de financement</h1>
        <p className="text-sm text-ink-muted">{count ?? 0} résultat(s).</p>
      </div>

      <form className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-end" role="search">
        <div className="flex-1">
          <label htmlFor="q" className="ef-label">Recherche</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
            <input id="q" name="q" defaultValue={q} placeholder="Référence, nom, e-mail…" className="ef-input py-2 pl-9" />
          </div>
        </div>
        <div>
          <label htmlFor="statut" className="ef-label">Statut</label>
          <select id="statut" name="statut" defaultValue={statut ?? ''} className="ef-input py-2">
            <option value="">Tous</option>
            {applicationStatuses.map((s) => (
              <option key={s} value={s}>{applicationStatusLabels[s]}</option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="secondary">Filtrer</Button>
      </form>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface-2/80 text-left text-xs uppercase tracking-wide text-ink-subtle">
            <tr>
              <th className="px-4 py-3 font-semibold">Référence</th>
              <th className="px-4 py-3 font-semibold">Demandeur</th>
              <th className="px-4 py-3 font-semibold">Produit</th>
              <th className="px-4 py-3 text-right font-semibold">Montant</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Reçue le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(data ?? []).map((a) => (
              <tr key={a.id} className="hover:bg-brand-50/40">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link href={`/admin/demandes/${a.id}`} className="text-brand-700 underline-offset-2 hover:underline">
                    {a.reference_number}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="block font-medium text-navy-900">{a.first_name} {a.last_name}</span>
                  <span className="text-xs text-ink-subtle">{a.email}</span>
                </td>
                <td className="px-4 py-3 text-ink-muted">{a.loan_product_slug}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrency(Number(a.requested_amount))}
                  <span className="block text-xs text-ink-subtle">{a.desired_duration} mois</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3 text-xs text-ink-subtle">{formatDateTime(a.created_at)}</td>
              </tr>
            ))}
            {(data ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-muted">Aucune demande ne correspond à ces critères.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">Page {page} sur {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={`?q=${encodeURIComponent(q)}&statut=${statut ?? ''}&page=${page - 1}`} className="rounded-lg border border-line px-3 py-1.5 hover:bg-navy-50">Précédent</Link>}
            {page < totalPages && <Link href={`?q=${encodeURIComponent(q)}&statut=${statut ?? ''}&page=${page + 1}`} className="rounded-lg border border-line px-3 py-1.5 hover:bg-navy-50">Suivant</Link>}
          </div>
        </nav>
      )}
    </div>
  );
}
