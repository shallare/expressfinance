import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { applicationStatusLabels, applicationStatuses, type ApplicationStatus } from '@/lib/config/loans';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateTime } from '@/lib/finance/format';
import { StatusBadge } from '@/components/admin/status-badge';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: stats }, { data: recent }] = await Promise.all([
    supabase.from('application_stats').select('*'),
    supabase
      .from('loan_applications')
      .select('id, reference_number, first_name, last_name, requested_amount, loan_product_slug, status, created_at')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const byStatus = new Map<ApplicationStatus, { total: number; amount: number }>();
  for (const s of stats ?? []) byStatus.set(s.status, { total: s.total, amount: Number(s.total_amount) });
  const totalAll = [...byStatus.values()].reduce((s, v) => s + v.total, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Tableau de bord</h1>
        <p className="text-sm text-ink-muted">{totalAll} demande(s) au total.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applicationStatuses.map((status) => {
          const v = byStatus.get(status) ?? { total: 0, amount: 0 };
          return (
            <Link key={status} href={`/admin/demandes?statut=${status}`} className="card-surface card-hover p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{applicationStatusLabels[status]}</p>
              <p className="mt-2 font-display text-3xl font-bold text-navy-900">{v.total}</p>
              <p className="text-xs text-ink-muted">{formatCurrency(v.amount)} demandés</p>
            </Link>
          );
        })}
      </div>

      <section className="card-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold text-navy-900">Dernières demandes</h2>
          <Link href="/admin/demandes" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700">
            Tout voir <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {recent && recent.length > 0 ? (
          <ul className="divide-y divide-line">
            {recent.map((a) => (
              <li key={a.id}>
                <Link href={`/admin/demandes/${a.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm hover:bg-surface-2/60">
                  <span className="font-mono text-xs text-ink-subtle">{a.reference_number}</span>
                  <span className="font-medium text-navy-900">
                    {a.first_name} {a.last_name}
                  </span>
                  <span className="text-ink-muted">{formatCurrency(Number(a.requested_amount))}</span>
                  <span className="ml-auto flex items-center gap-3">
                    <StatusBadge status={a.status} />
                    <span className="text-xs text-ink-subtle">{formatDateTime(a.created_at)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-ink-muted">Aucune demande reçue pour le moment.</p>
        )}
      </section>
    </div>
  );
}
