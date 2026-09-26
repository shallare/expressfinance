-- Durée maximale de remboursement portée à 50 ans (600 mois) pour les
-- financements importants (immobilier, projet, sur mesure) ; 30 ans pour le
-- financement professionnel.
alter table public.simulator_settings alter column max_duration set default 600;
update public.simulator_settings set max_duration = 600 where id = 1 and max_duration < 600;

update public.loan_products set max_duration = 600 where slug in ('credit-immobilier', 'financement-de-projet', 'autres-solutions') and max_duration < 600;
update public.loan_products set max_duration = 360 where slug = 'financement-professionnel' and max_duration < 360;
