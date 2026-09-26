import { requireAdmin } from '@/lib/auth/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { mapSimulatorSettings } from '@/lib/data/mappers';
import { defaultSimulatorSettings } from '@/lib/data/catalog';
import { ActionForm } from '@/components/admin/action-form';
import { Checkbox, Fieldset, Input, Select, Textarea } from '@/components/admin/admin-fields';
import { PlaceholderNotice } from '@/components/ui/badge';
import { saveSettingsAction } from '@/app/(admin)/admin/actions';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  await requireAdmin('admin');
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('simulator_settings').select('*').eq('id', 1).maybeSingle();
  const s = data ? mapSimulatorSettings(data) : defaultSimulatorSettings;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Paramètres du simulateur</h1>
        <p className="text-sm text-ink-muted">Valeurs globales utilisées par le simulateur et la page « Frais et conditions ». Les produits peuvent définir leurs propres valeurs.</p>
      </div>
      <PlaceholderNotice>
        Le taux de 2 % est interprété par défaut comme un taux nominal annuel avec amortissement constant. Confirmez la nature exacte du taux puis cochez « confirmé » pour retirer l’avertissement du site.
      </PlaceholderNotice>

      <ActionForm action={saveSettingsAction} className="grid gap-6">
        <Fieldset title="Modèle de taux par défaut">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Taux (%)" name="rate_percent" type="number" min={0} max={100} step={0.01} required defaultValue={s.rate.percent} />
            <Select label="Période" name="rate_period" defaultValue={s.rate.period}>
              <option value="annual">Annuel (nominal)</option>
              <option value="monthly">Mensuel</option>
              <option value="total">Forfaitaire (total)</option>
            </Select>
            <Select label="Méthode" name="rate_method" defaultValue={s.rate.method}>
              <option value="amortizing">Amortissement constant</option>
              <option value="flat">Intérêt simple (flat)</option>
            </Select>
          </div>
          <Checkbox label="Nature du taux confirmée" name="rate_confirmed" defaultChecked={!s.rate.isPlaceholder} />
          <Checkbox label="Autoriser les visiteurs à modifier le taux dans le simulateur (options avancées)" name="allow_user_rate_override" defaultChecked={s.allowUserRateOverride} />
        </Fieldset>

        <Fieldset title="Frais globaux (JSON)">
          <Textarea
            label="Liste des frais"
            name="fees_json"
            rows={6}
            defaultValue={JSON.stringify(s.fees, null, 2)}
            help='Exemple : [{"id":"dossier","label":"Frais de dossier","kind":"fixed","value":150,"timing":"upfront"}]. Laisser [] si aucun frais publié.'
          />
        </Fieldset>

        <Fieldset title="Pénalités de retard (barème global)">
          <div className="grid gap-4 sm:grid-cols-4">
            <Input label="Délai de grâce (jours)" name="penalty_grace" type="number" min={0} max={365} defaultValue={s.penalty.gracePeriodDays} />
            <Input label="Frais fixes (€)" name="penalty_fixed" type="number" min={0} step={0.01} defaultValue={s.penalty.fixedFee} />
            <Input label="Pénalité (% échéance)" name="penalty_percent" type="number" min={0} max={100} step={0.01} defaultValue={s.penalty.percentOfInstallment} />
            <Input label="Intérêts de retard (%/an)" name="penalty_rate" type="number" min={0} max={100} step={0.01} defaultValue={s.penalty.lateInterestAnnualPercent} />
          </div>
          <Checkbox label="Barème confirmé" name="penalty_confirmed" defaultChecked={!s.penalty.isPlaceholder} />
        </Fieldset>

        <Fieldset title="Bornes générales">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Montant min (€)" name="min_amount" type="number" min={1} step={100} required defaultValue={s.minAmount} />
            <Input label="Montant max (€)" name="max_amount" type="number" min={1} step={100} required defaultValue={s.maxAmount} />
            <div />
            <Input label="Durée min (mois)" name="min_duration" type="number" min={1} required defaultValue={s.minDuration} />
            <Input label="Durée max (mois)" name="max_duration" type="number" min={1} required defaultValue={s.maxDuration} />
            <Input label="Durée par défaut (mois)" name="default_duration" type="number" min={1} required defaultValue={s.defaultDuration} />
          </div>
        </Fieldset>
      </ActionForm>
    </div>
  );
}
