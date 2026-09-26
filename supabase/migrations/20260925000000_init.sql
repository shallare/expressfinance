-- ============================================================================
--  EXPRESS FINANCE — Schéma initial
--  À exécuter dans Supabase : SQL Editor > New query > coller > Run
--  (ou via `supabase db push` avec la CLI).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
--  0. Utilitaires
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
--  1. Administrateurs
--     Un utilisateur Supabase Auth n'a accès à l'espace d'administration que
--     s'il figure dans cette table. Ajoutez-y manuellement le premier admin :
--       insert into public.admin_users (user_id, role)
--       values ('<uuid de auth.users>', 'admin');
-- ----------------------------------------------------------------------------

create table if not exists public.admin_users (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  role        text not null default 'admin' check (role in ('admin', 'viewer')),
  display_name text,
  created_at  timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Fonction SECURITY DEFINER : vérifie si l'utilisateur courant est admin
-- sans exposer la table admin_users.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create or replace function public.admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.admin_users where user_id = auth.uid();
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;
revoke all on function public.admin_role() from public;
grant execute on function public.admin_role() to authenticated;

-- Un admin peut voir sa propre ligne (et celles des autres admins).
create policy "admin_users: admins can read"
  on public.admin_users for select
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
--  2. Produits de financement
-- ----------------------------------------------------------------------------

create table if not exists public.loan_products (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  name                  text not null,
  short_name            text not null,
  icon                  text not null default 'Layers',
  tagline               text not null default '',
  description           text not null default '',
  long_description      text not null default '',
  min_amount            numeric(14,2) not null check (min_amount > 0),
  max_amount            numeric(14,2) not null check (max_amount >= min_amount),
  min_duration          integer not null check (min_duration >= 1),
  max_duration          integer not null check (max_duration >= min_duration),
  default_duration      integer not null check (default_duration between min_duration and max_duration),
  -- Modèle de taux : { percent, period: annual|monthly|total, method: amortizing|flat, isPlaceholder }
  interest_rate         numeric(8,4) not null check (interest_rate >= 0),
  rate_type             jsonb not null default '{"period":"annual","method":"amortizing","isPlaceholder":true}'::jsonb,
  -- Tableau de FeeDefinition
  fees                  jsonb not null default '[]'::jsonb,
  -- PenaltyConfig
  penalty_configuration jsonb not null default '{"gracePeriodDays":0,"fixedFee":0,"percentOfInstallment":0,"lateInterestAnnualPercent":0,"isPlaceholder":true}'::jsonb,
  key_conditions        text[] not null default '{}',
  use_cases             text[] not null default '{}',
  required_documents    text[] not null default '{}',
  active                boolean not null default true,
  sort_order            integer not null default 100,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger loan_products_set_updated_at
  before update on public.loan_products
  for each row execute function public.set_updated_at();

alter table public.loan_products enable row level security;

create policy "loan_products: public can read active"
  on public.loan_products for select
  to anon, authenticated
  using (active = true or public.is_admin());

create policy "loan_products: admins manage"
  on public.loan_products for all
  to authenticated
  using (public.is_admin() and public.admin_role() = 'admin')
  with check (public.is_admin() and public.admin_role() = 'admin');

-- ----------------------------------------------------------------------------
--  3. Paramètres globaux du simulateur (ligne unique id = 1)
-- ----------------------------------------------------------------------------

create table if not exists public.simulator_settings (
  id                    integer primary key default 1 check (id = 1),
  rate_model            jsonb not null default '{"percent":2,"period":"annual","method":"amortizing","isPlaceholder":true}'::jsonb,
  fees                  jsonb not null default '[]'::jsonb,
  penalty_configuration jsonb not null default '{"gracePeriodDays":0,"fixedFee":0,"percentOfInstallment":0,"lateInterestAnnualPercent":0,"isPlaceholder":true}'::jsonb,
  min_amount            numeric(14,2) not null default 3000,
  max_amount            numeric(14,2) not null default 800000,
  min_duration          integer not null default 6,
  max_duration          integer not null default 600,
  default_duration      integer not null default 12,
  allow_user_rate_override boolean not null default true,
  updated_at            timestamptz not null default now()
);

insert into public.simulator_settings (id) values (1) on conflict (id) do nothing;

create trigger simulator_settings_set_updated_at
  before update on public.simulator_settings
  for each row execute function public.set_updated_at();

alter table public.simulator_settings enable row level security;

create policy "simulator_settings: public can read"
  on public.simulator_settings for select
  to anon, authenticated
  using (true);

create policy "simulator_settings: admins update"
  on public.simulator_settings for update
  to authenticated
  using (public.is_admin() and public.admin_role() = 'admin')
  with check (public.is_admin() and public.admin_role() = 'admin');

-- ----------------------------------------------------------------------------
--  4. Demandes de financement
-- ----------------------------------------------------------------------------

create type public.application_status as enum (
  'pending',
  'under_review',
  'additional_information_required',
  'approved',
  'rejected',
  'completed'
);

create table if not exists public.loan_applications (
  id                  uuid primary key default gen_random_uuid(),
  reference_number    text not null unique check (reference_number ~ '^EF-[0-9]{8}-[A-Z0-9]{6}$'),
  -- Clé d'idempotence générée par le navigateur : empêche les doubles envois.
  submission_key      uuid not null unique,
  loan_product_id     uuid references public.loan_products (id) on delete set null,
  loan_product_slug   text not null,
  first_name          text not null,
  last_name           text not null,
  email               text not null,
  phone               text not null,
  address_line        text not null,
  postal_code         text not null,
  city                text not null,
  country             text not null,
  profession          text not null,
  employment_status   text not null,
  monthly_income      numeric(14,2) not null check (monthly_income >= 0),
  requested_amount    numeric(14,2) not null check (requested_amount > 0),
  desired_duration    integer not null check (desired_duration >= 1),
  purpose             text not null,
  status              public.application_status not null default 'pending',
  internal_notes      text,
  -- Métadonnées anti-abus (aucune donnée personnelle brute : IP hachée + sel).
  ip_hash             text,
  user_agent          text,
  consent_privacy_at  timestamptz not null default now(),
  consent_terms_at    timestamptz not null default now(),
  consent_processing_at timestamptz not null default now(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists loan_applications_status_idx on public.loan_applications (status);
create index if not exists loan_applications_created_at_idx on public.loan_applications (created_at desc);
create index if not exists loan_applications_email_idx on public.loan_applications (email);
create index if not exists loan_applications_ip_hash_created_idx on public.loan_applications (ip_hash, created_at desc);

create trigger loan_applications_set_updated_at
  before update on public.loan_applications
  for each row execute function public.set_updated_at();

alter table public.loan_applications enable row level security;

-- Aucune politique INSERT : l'insertion se fait exclusivement côté serveur
-- via la clé service-role, après validation stricte.
create policy "loan_applications: admins read"
  on public.loan_applications for select
  to authenticated
  using (public.is_admin());

create policy "loan_applications: admins update"
  on public.loan_applications for update
  to authenticated
  using (public.is_admin() and public.admin_role() = 'admin')
  with check (public.is_admin() and public.admin_role() = 'admin');

-- ----------------------------------------------------------------------------
--  5. Historique des statuts (audit)
-- ----------------------------------------------------------------------------

create table if not exists public.application_status_history (
  id              bigint generated always as identity primary key,
  application_id  uuid not null references public.loan_applications (id) on delete cascade,
  from_status     public.application_status,
  to_status       public.application_status not null,
  changed_by      uuid references auth.users (id) on delete set null,
  note            text,
  created_at      timestamptz not null default now()
);

create index if not exists application_status_history_app_idx
  on public.application_status_history (application_id, created_at desc);

alter table public.application_status_history enable row level security;

create policy "status_history: admins read"
  on public.application_status_history for select
  to authenticated
  using (public.is_admin());

create policy "status_history: admins insert"
  on public.application_status_history for insert
  to authenticated
  with check (public.is_admin() and public.admin_role() = 'admin');

-- Journalise automatiquement chaque changement de statut.
create or replace function public.log_application_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.application_status_history (application_id, from_status, to_status, changed_by)
    values (new.id, null, new.status, auth.uid());
  elsif new.status is distinct from old.status then
    insert into public.application_status_history (application_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger loan_applications_log_status
  after insert or update of status on public.loan_applications
  for each row execute function public.log_application_status_change();

-- ----------------------------------------------------------------------------
--  6. Documents joints (stockés dans le bucket PRIVÉ `loan-documents`)
-- ----------------------------------------------------------------------------

create table if not exists public.application_documents (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.loan_applications (id) on delete cascade,
  document_type   text not null,
  original_name   text not null,
  storage_path    text not null unique,
  mime_type       text not null,
  size_bytes      integer not null check (size_bytes > 0),
  status          text not null default 'received' check (status in ('received', 'validated', 'rejected')),
  created_at      timestamptz not null default now()
);

create index if not exists application_documents_app_idx
  on public.application_documents (application_id);

alter table public.application_documents enable row level security;

create policy "documents: admins read"
  on public.application_documents for select
  to authenticated
  using (public.is_admin());

create policy "documents: admins update status"
  on public.application_documents for update
  to authenticated
  using (public.is_admin() and public.admin_role() = 'admin')
  with check (public.is_admin() and public.admin_role() = 'admin');

-- ----------------------------------------------------------------------------
--  7. Témoignages
-- ----------------------------------------------------------------------------

create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  content     text not null,
  loan_type   text not null,
  image_url   text,
  rating      smallint not null default 5 check (rating between 1 and 5),
  location    text,
  published_on date,
  -- Preuve de consentement à la publication (recommandé RGPD).
  consent_reference text,
  active      boolean not null default false,
  sort_order  integer not null default 100,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

create policy "testimonials: public read active"
  on public.testimonials for select
  to anon, authenticated
  using (active = true or public.is_admin());

create policy "testimonials: admins manage"
  on public.testimonials for all
  to authenticated
  using (public.is_admin() and public.admin_role() = 'admin')
  with check (public.is_admin() and public.admin_role() = 'admin');

-- ----------------------------------------------------------------------------
--  8. Partenaires (uniquement vérifiés et actifs côté public)
-- ----------------------------------------------------------------------------

create table if not exists public.partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  website     text,
  verified    boolean not null default false,
  -- Le client atteste disposer du droit d'usage du logo.
  logo_rights_confirmed boolean not null default false,
  active      boolean not null default false,
  sort_order  integer not null default 100,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

alter table public.partners enable row level security;

create policy "partners: public read verified"
  on public.partners for select
  to anon, authenticated
  using ((active = true and verified = true and logo_rights_confirmed = true) or public.is_admin());

create policy "partners: admins manage"
  on public.partners for all
  to authenticated
  using (public.is_admin() and public.admin_role() = 'admin')
  with check (public.is_admin() and public.admin_role() = 'admin');

-- ----------------------------------------------------------------------------
--  9. Stockage : bucket PRIVÉ pour les documents d'identité
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'loan-documents',
  'loan-documents',
  false,
  5242880, -- 5 Mo
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Lecture réservée aux administrateurs (URL signées générées côté serveur).
-- Aucun INSERT public : le dépôt se fait via la clé service-role.
create policy "loan-documents: admins read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'loan-documents' and public.is_admin());

create policy "loan-documents: admins delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'loan-documents' and public.is_admin() and public.admin_role() = 'admin');

-- Bucket PUBLIC pour les visuels marketing (logos partenaires, photos témoignages).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('public-assets', 'public-assets', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "public-assets: anyone read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'public-assets');

create policy "public-assets: admins write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'public-assets' and public.is_admin() and public.admin_role() = 'admin');

create policy "public-assets: admins update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'public-assets' and public.is_admin() and public.admin_role() = 'admin');

create policy "public-assets: admins delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'public-assets' and public.is_admin() and public.admin_role() = 'admin');

-- ----------------------------------------------------------------------------
-- 10. Vue statistique pour le tableau de bord admin
-- ----------------------------------------------------------------------------

create or replace view public.application_stats
with (security_invoker = true)
as
select
  status,
  count(*)::integer as total,
  coalesce(sum(requested_amount), 0)::numeric(16,2) as total_amount
from public.loan_applications
group by status;

-- ----------------------------------------------------------------------------
-- 11. Données initiales : produits (identiques à src/lib/config/loans.ts)
-- ----------------------------------------------------------------------------

insert into public.loan_products
  (slug, name, short_name, icon, tagline, description, min_amount, max_amount, min_duration, max_duration, default_duration, interest_rate, sort_order)
values
  ('pret-personnel', 'Prêt personnel', 'Personnel', 'User', 'Financez vos projets de vie en toute liberté.', 'Un financement souple et sans affectation obligatoire pour concrétiser vos projets personnels.', 3000, 800000, 6, 120, 12, 2, 1),
  ('credit-immobilier', 'Crédit immobilier', 'Immobilier', 'Home', 'Donnez vie à votre projet immobilier.', 'Achat, construction, rénovation ou investissement locatif : une solution de financement structurée.', 3000, 800000, 12, 600, 240, 2, 2),
  ('credit-consommation', 'Crédit à la consommation', 'Consommation', 'ShoppingBag', 'Équipez-vous sans attendre.', 'Véhicule, équipement, travaux : un financement dédié à l’achat d’un bien ou d’un service précis.', 3000, 800000, 6, 84, 12, 2, 3),
  ('financement-professionnel', 'Financement professionnel', 'Professionnel', 'Briefcase', 'Soutenez la croissance de votre entreprise.', 'Trésorerie, investissement, matériel, développement : des solutions pour indépendants, TPE et PME.', 3000, 800000, 6, 360, 36, 2, 4),
  ('financement-de-projet', 'Financement de projet', 'Projet', 'Rocket', 'Transformez une idée en réalisation concrète.', 'Lancement d’activité, projet innovant ou industriel : un financement structuré autour de votre plan.', 3000, 800000, 12, 600, 60, 2, 5),
  ('autres-solutions', 'Autres solutions de financement', 'Sur mesure', 'Layers', 'Un besoin particulier ? Parlons-en.', 'Rachat de crédit, financement d’études, situation atypique : nous étudions les demandes hors catégories.', 3000, 800000, 6, 600, 24, 2, 6)
on conflict (slug) do nothing;
