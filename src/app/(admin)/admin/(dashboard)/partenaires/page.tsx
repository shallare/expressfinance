import { Trash2 } from 'lucide-react';
import { requireAdmin } from '@/lib/auth/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Badge, PlaceholderNotice } from '@/components/ui/badge';
import { ActionForm } from '@/components/admin/action-form';
import { Checkbox, Fieldset, Input } from '@/components/admin/admin-fields';
import { deletePartnerAction, savePartnerAction } from '@/app/(admin)/admin/actions';
import type { PartnerRow } from '@/types/database';

export const dynamic = 'force-dynamic';

function PartnerForm({ p }: { p: PartnerRow | null }) {
  return (
    <ActionForm action={savePartnerAction} submitLabel={p ? 'Enregistrer' : 'Ajouter'}>
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nom" name="name" required defaultValue={p?.name ?? ''} />
          <Input label="Site web" name="website" type="url" defaultValue={p?.website ?? ''} />
          <Input label="Logo (URL)" name="logo_url" type="url" defaultValue={p?.logo_url ?? ''} help="Déposez le logo dans le bucket public-assets puis collez l’URL publique." />
          <Input label="Ordre" name="sort_order" type="number" min={0} defaultValue={p?.sort_order ?? 100} />
        </div>
        <div className="grid gap-3">
          <Checkbox label="Partenariat vérifié (confirmation écrite du partenaire)" name="verified" defaultChecked={p?.verified ?? false} />
          <Checkbox label="Droit d’usage du logo confirmé" name="logo_rights_confirmed" defaultChecked={p?.logo_rights_confirmed ?? false} />
          <Checkbox label="Actif" name="active" defaultChecked={p?.active ?? false} help="Un partenaire n’apparaît sur le site que s’il est actif, vérifié ET avec droits de logo confirmés." />
        </div>
      </div>
    </ActionForm>
  );
}

export default async function AdminPartnersPage() {
  const session = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data: items } = await supabase.from('partners').select('*').order('sort_order');
  const canEdit = session.role === 'admin';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Partenaires</h1>
        <p className="text-sm text-ink-muted">Tant qu’aucun partenaire vérifié n’est actif, le site affiche des emplacements neutres.</p>
      </div>
      <PlaceholderNotice>N’affichez jamais le logo d’une banque sans partenariat confirmé par écrit et sans droit d’usage de la marque.</PlaceholderNotice>

      {canEdit && (
        <Fieldset title="Ajouter un partenaire">
          <PartnerForm p={null} />
        </Fieldset>
      )}

      <div className="space-y-4">
        {(items ?? []).map((p) => {
          const visible = p.active && p.verified && p.logo_rights_confirmed;
          return (
            <details key={p.id} className="card-surface">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="font-medium text-navy-900">{p.name}</span>
                <span className="ml-auto flex gap-2">
                  {p.verified ? <Badge tone="success">Vérifié</Badge> : <Badge tone="warning">Non vérifié</Badge>}
                  {visible ? <Badge tone="brand">Visible</Badge> : <Badge tone="neutral">Masqué</Badge>}
                </span>
              </summary>
              <div className="border-t border-line px-5 py-5">
                {canEdit ? (
                  <>
                    <PartnerForm p={p} />
                    <form action={deletePartnerAction} className="mt-4">
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline">
                        <Trash2 className="h-4 w-4" aria-hidden="true" /> Supprimer
                      </button>
                    </form>
                  </>
                ) : (
                  <p className="text-sm text-ink-muted">{p.website}</p>
                )}
              </div>
            </details>
          );
        })}
        {(items ?? []).length === 0 && <p className="text-sm text-ink-muted">Aucun partenaire enregistré.</p>}
      </div>
    </div>
  );
}
