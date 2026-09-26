import type { LoanProductRow } from '@/types/database';
import { parseFees, parsePenalty, parseRateModel } from '@/lib/data/mappers';
import { ActionForm } from './action-form';
import { Checkbox, Fieldset, Input, Select, Textarea } from './admin-fields';
import { saveProductAction } from '@/app/(admin)/admin/actions';

export function ProductForm({ product }: { product: LoanProductRow | null }) {
  const rate = product ? parseRateModel(product.rate_type, Number(product.interest_rate)) : null;
  const fees = product ? parseFees(product.fees) : [];
  const penalty = product ? parsePenalty(product.penalty_configuration) : null;

  return (
    <ActionForm action={saveProductAction} className="grid gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Fieldset title="Identité du produit">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nom" name="name" required defaultValue={product?.name ?? ''} />
          <Input label="Nom court" name="short_name" required defaultValue={product?.short_name ?? ''} />
          <Input label="Slug (URL)" name="slug" required pattern="[a-z0-9-]{2,80}" defaultValue={product?.slug ?? ''} help="Ex. pret-personnel — lettres minuscules, chiffres, tirets." />
          <Select label="Icône" name="icon" defaultValue={product?.icon ?? 'Layers'}>
            {['User', 'Home', 'ShoppingBag', 'Briefcase', 'Rocket', 'Layers'].map((i) => <option key={i} value={i}>{i}</option>)}
          </Select>
        </div>
        <Input label="Accroche" name="tagline" defaultValue={product?.tagline ?? ''} maxLength={160} />
        <Textarea label="Description courte" name="description" defaultValue={product?.description ?? ''} maxLength={600} />
        <Textarea label="Description détaillée" name="long_description" defaultValue={product?.long_description ?? ''} maxLength={3000} />
      </Fieldset>

      <Fieldset title="Montants et durées">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Montant min (€)" name="min_amount" type="number" min={1} step={100} required defaultValue={product?.min_amount ?? 3000} />
          <Input label="Montant max (€)" name="max_amount" type="number" min={1} step={100} required defaultValue={product?.max_amount ?? 800000} />
          <div />
          <Input label="Durée min (mois)" name="min_duration" type="number" min={1} required defaultValue={product?.min_duration ?? 6} />
          <Input label="Durée max (mois)" name="max_duration" type="number" min={1} required defaultValue={product?.max_duration ?? 240} />
          <Input label="Durée par défaut (mois)" name="default_duration" type="number" min={1} required defaultValue={product?.default_duration ?? 12} />
        </div>
      </Fieldset>

      <Fieldset title="Taux d’intérêt">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Taux (%)" name="interest_rate" type="number" min={0} max={100} step={0.01} required defaultValue={product ? Number(product.interest_rate) : 2} />
          <Select label="Période" name="rate_period" defaultValue={rate?.period ?? 'annual'}>
            <option value="annual">Annuel (nominal)</option>
            <option value="monthly">Mensuel</option>
            <option value="total">Forfaitaire (total)</option>
          </Select>
          <Select label="Méthode" name="rate_method" defaultValue={rate?.method ?? 'amortizing'}>
            <option value="amortizing">Amortissement constant</option>
            <option value="flat">Intérêt simple (flat)</option>
          </Select>
        </div>
        <Checkbox label="Nature du taux confirmée par Express Finance" name="rate_confirmed" defaultChecked={rate ? !rate.isPlaceholder : false} help="Tant que cette case n’est pas cochée, un avertissement « à confirmer » s’affiche sur le site." />
      </Fieldset>

      <Fieldset title="Frais (JSON)">
        <Textarea
          label="Liste des frais"
          name="fees_json"
          defaultValue={JSON.stringify(fees, null, 2)}
          rows={6}
          help='Tableau JSON. Exemple : [{"id":"dossier","label":"Frais de dossier","kind":"fixed","value":150,"timing":"upfront"}] — kind : fixed | percent_of_principal ; timing : upfront | monthly. Laisser [] si aucun frais.'
        />
      </Fieldset>

      <Fieldset title="Pénalités de retard">
        <div className="grid gap-4 sm:grid-cols-4">
          <Input label="Délai de grâce (jours)" name="penalty_grace" type="number" min={0} max={365} defaultValue={penalty?.gracePeriodDays ?? 0} />
          <Input label="Frais fixes (€)" name="penalty_fixed" type="number" min={0} step={0.01} defaultValue={penalty?.fixedFee ?? 0} />
          <Input label="Pénalité (% échéance)" name="penalty_percent" type="number" min={0} max={100} step={0.01} defaultValue={penalty?.percentOfInstallment ?? 0} />
          <Input label="Intérêts de retard (%/an)" name="penalty_rate" type="number" min={0} max={100} step={0.01} defaultValue={penalty?.lateInterestAnnualPercent ?? 0} />
        </div>
        <Checkbox label="Barème de pénalités confirmé" name="penalty_confirmed" defaultChecked={penalty ? !penalty.isPlaceholder : false} />
      </Fieldset>

      <Fieldset title="Contenu de la fiche">
        <Textarea label="Conditions clés (une par ligne)" name="key_conditions" defaultValue={(product?.key_conditions ?? []).join('\n')} />
        <Textarea label="Exemples d’utilisation (un par ligne)" name="use_cases" defaultValue={(product?.use_cases ?? []).join('\n')} />
        <Textarea label="Documents demandés (un par ligne)" name="required_documents" defaultValue={(product?.required_documents ?? []).join('\n')} />
      </Fieldset>

      <Fieldset title="Publication">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Ordre d’affichage" name="sort_order" type="number" min={0} defaultValue={product?.sort_order ?? 100} />
          <div className="flex items-end">
            <Checkbox label="Produit actif (visible sur le site)" name="active" defaultChecked={product?.active ?? true} />
          </div>
        </div>
      </Fieldset>
    </ActionForm>
  );
}
