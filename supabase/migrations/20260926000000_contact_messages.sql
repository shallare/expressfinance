-- ============================================================================
--  Messages du formulaire de contact (archivage, en plus de l'e-mail admin)
-- ============================================================================

create table if not exists public.contact_messages (
  id                uuid primary key default gen_random_uuid(),
  locale            text not null default 'fr',
  first_name        text not null,
  last_name         text not null,
  profession        text not null,
  monthly_income    numeric(14,2) not null check (monthly_income >= 0),
  requested_amount  numeric(14,2) not null check (requested_amount > 0),
  desired_duration  integer not null check (desired_duration >= 1),
  whatsapp          text not null,
  phone             text,
  email             text not null,
  purpose           text not null,
  other_info        text,
  status            text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  ip_hash           text,
  created_at        timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Insertion exclusivement côté serveur (clé service-role). Lecture : admins.
create policy "contact_messages: admins read"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

create policy "contact_messages: admins update"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin() and public.admin_role() = 'admin')
  with check (public.is_admin() and public.admin_role() = 'admin');
