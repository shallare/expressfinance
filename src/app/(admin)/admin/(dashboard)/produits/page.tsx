import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatCurrencyCompact } from '@/lib/finance/format';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: products } = await supabase.from('loan_products').select('*').order('sort_order');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Produits de financement</h1>
          <p className="text-sm text-ink-muted">Montants, durées, taux, frais et pénalités de chaque produit.</p>
        </div>
        <ButtonLink href="/admin/produits/nouveau" size="sm">
          <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau produit
        </ButtonLink>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-2/80 text-left text-xs uppercase tracking-wide text-ink-subtle">
            <tr>
              <th className="px-4 py-3 font-semibold">Produit</th>
              <th className="px-4 py-3 font-semibold">Montants</th>
              <th className="px-4 py-3 font-semibold">Durées</th>
              <th className="px-4 py-3 font-semibold">Taux</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(products ?? []).map((p) => (
              <tr key={p.id} className="hover:bg-brand-50/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/produits/${p.id}`} className="font-medium text-brand-700 underline-offset-2 hover:underline">{p.name}</Link>
                  <span className="block font-mono text-xs text-ink-subtle">/{p.slug}</span>
                </td>
                <td className="px-4 py-3 tabular-nums">{formatCurrencyCompact(Number(p.min_amount))} – {formatCurrencyCompact(Number(p.max_amount))}</td>
                <td className="px-4 py-3 tabular-nums">{p.min_duration} – {p.max_duration} mois</td>
                <td className="px-4 py-3">{Number(p.interest_rate)} %</td>
                <td className="px-4 py-3">{p.active ? <Badge tone="success">Actif</Badge> : <Badge tone="neutral">Inactif</Badge>}</td>
              </tr>
            ))}
            {(products ?? []).length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-muted">Aucun produit en base : la migration SQL insère les 6 produits par défaut.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
