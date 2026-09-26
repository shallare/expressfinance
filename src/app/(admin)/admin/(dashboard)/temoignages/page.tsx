import { Star, Trash2 } from 'lucide-react';
import { requireAdmin } from '@/lib/auth/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Badge, PlaceholderNotice } from '@/components/ui/badge';
import { ActionForm } from '@/components/admin/action-form';
import { Checkbox, Fieldset, Input, Textarea } from '@/components/admin/admin-fields';
import { deleteTestimonialAction, saveTestimonialAction } from '@/app/(admin)/admin/actions';
import type { TestimonialRow } from '@/types/database';

export const dynamic = 'force-dynamic';

function TestimonialForm({ t }: { t: TestimonialRow | null }) {
  return (
    <ActionForm action={saveTestimonialAction} submitLabel={t ? 'Enregistrer' : 'Ajouter'}>
      {t && <input type="hidden" name="id" value={t.id} />}
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nom affiché" name="name" required defaultValue={t?.name ?? ''} help="Ex. « Marie D. » — avec accord écrit du client." />
          <Input label="Type de financement" name="loan_type" required defaultValue={t?.loan_type ?? ''} />
          <Input label="Note (1–5)" name="rating" type="number" min={1} max={5} required defaultValue={t?.rating ?? 5} />
          <Input label="Localisation" name="location" defaultValue={t?.location ?? ''} />
          <Input label="Date de publication" name="published_on" type="date" defaultValue={t?.published_on ?? ''} />
          <Input label="Photo (URL)" name="image_url" type="url" defaultValue={t?.image_url ?? ''} help="Bucket public-assets ou URL https." />
        </div>
        <Textarea label="Témoignage" name="content" required minLength={10} maxLength={1200} defaultValue={t?.content ?? ''} />
        <Input label="Référence du consentement" name="consent_reference" defaultValue={t?.consent_reference ?? ''} help="Obligatoire pour publier : e-mail d’accord, date, référence de dossier…" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Ordre" name="sort_order" type="number" min={0} defaultValue={t?.sort_order ?? 100} />
          <div className="flex items-end"><Checkbox label="Publié sur le site" name="active" defaultChecked={t?.active ?? false} /></div>
        </div>
      </div>
    </ActionForm>
  );
}

export default async function AdminTestimonialsPage() {
  const session = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data: items } = await supabase.from('testimonials').select('*').order('sort_order');
  const canEdit = session.role === 'admin';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Témoignages</h1>
        <p className="text-sm text-ink-muted">Tant qu’aucun témoignage n’est publié ici, le site affiche des exemples clairement marqués « démonstration ».</p>
      </div>
      <PlaceholderNotice>Ne publiez que des témoignages authentiques, avec l’accord écrit de leur auteur (référence de consentement obligatoire).</PlaceholderNotice>

      {canEdit && (
        <Fieldset title="Ajouter un témoignage">
          <TestimonialForm t={null} />
        </Fieldset>
      )}

      <div className="space-y-4">
        {(items ?? []).map((t) => (
          <details key={t.id} className="card-surface group">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="font-medium text-navy-900">{t.name}</span>
              <span className="text-sm text-ink-muted">{t.loan_type}</span>
              <span className="inline-flex items-center gap-0.5 text-sage-500" aria-label={`${t.rating} sur 5`}>
                {Array.from({ length: t.rating }, (_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />)}
              </span>
              <span className="ml-auto">{t.active ? <Badge tone="success">Publié</Badge> : <Badge tone="neutral">Brouillon</Badge>}</span>
            </summary>
            <div className="border-t border-line px-5 py-5">
              {canEdit ? (
                <>
                  <TestimonialForm t={t} />
                  <form action={deleteTestimonialAction} className="mt-4">
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline">
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Supprimer ce témoignage
                    </button>
                  </form>
                </>
              ) : (
                <p className="text-sm text-ink-muted">{t.content}</p>
              )}
            </div>
          </details>
        ))}
        {(items ?? []).length === 0 && <p className="text-sm text-ink-muted">Aucun témoignage enregistré.</p>}
      </div>
    </div>
  );
}
