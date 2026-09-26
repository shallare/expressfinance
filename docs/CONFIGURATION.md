# Configuration Supabase & variables d'environnement

Ce guide décrit, étape par étape, la mise en service du back-end du site Express Finance.

## 1. Créer le projet Supabase

1. Rendez-vous sur <https://supabase.com/dashboard> et créez un nouveau projet.
2. **Région** : choisissez une région de l'Union européenne (ex. `eu-central-1` Francfort) pour la conformité RGPD.
3. Notez le **mot de passe de la base** (il n'est pas utilisé par le site, mais nécessaire pour la CLI).

## 2. Exécuter la migration SQL

1. Dans le tableau de bord : **SQL Editor › New query**.
2. Collez l'intégralité de `supabase/migrations/20260925000000_init.sql`, puis **Run**.
3. Répétez avec `supabase/migrations/20260926000000_contact_messages.sql` (archivage des messages du formulaire de contact).

La migration crée :

| Objet | Rôle |
|---|---|
| `admin_users` | Liste des comptes autorisés à accéder à l'administration (`admin` ou `viewer`). |
| `loan_products` | Catalogue des financements (6 produits insérés par défaut). |
| `simulator_settings` | Réglages globaux du simulateur (ligne unique `id = 1`). |
| `loan_applications` | Demandes de financement. |
| `application_status_history` | Journal automatique des changements de statut (audit). |
| `application_documents` | Métadonnées des pièces jointes. |
| `testimonials`, `partners` | Contenus marketing gérés depuis l'admin. |
| Bucket `loan-documents` (**privé**) | Justificatifs des demandeurs. |
| Bucket `public-assets` (public) | Logos partenaires, photos témoignages. |
| Fonctions `is_admin()`, `admin_role()` | Vérification du rôle côté SQL (SECURITY DEFINER). |

Toutes les tables ont la **Row Level Security activée**. Aucune politique n'autorise l'insertion anonyme dans `loan_applications` : l'insertion passe exclusivement par le serveur Next.js avec la clé service-role.

Alternative CLI : `supabase link --project-ref <ref>` puis `supabase db push`.

## 3. Récupérer les clés

**Project Settings › API** :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key — **secret absolu, jamais côté client** |

## 4. Renseigner `.env.local`

Copiez `.env.example` vers `.env.local` et complétez :

```env
NEXT_PUBLIC_SITE_URL="https://www.votre-domaine.com"
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
FORM_SECRET="<chaîne aléatoire longue>"        # openssl rand -hex 32
```

Variables optionnelles :

| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Active Cloudflare Turnstile (anti-robot) sur le formulaire. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | **Envoi des e-mails** (formulaire de contact → boîte admin, notification de nouvelle demande). Gmail : `smtp.gmail.com`, port `465`, identifiant = adresse Gmail, mot de passe = *mot de passe d'application* (compte Google › Sécurité › Validation en 2 étapes › Mots de passe des applications). |
| `RESEND_API_KEY`, `NOTIFICATIONS_EMAIL_FROM` | Alternative à SMTP (API Resend). |
| `NOTIFICATIONS_EMAIL_TO` | Adresse qui reçoit les messages de contact et les notifications (défaut : financeexpress258@gmail.com). |

## 5. Créer le premier administrateur

1. **Authentication › Users › Add user** : créez un utilisateur avec e-mail + mot de passe (désactivez « Send confirmation » ou confirmez-le).
2. Copiez son **UUID**.
3. **SQL Editor** :

```sql
insert into public.admin_users (user_id, role, display_name)
values ('<uuid-copié>', 'admin', 'Prénom Nom');
```

Rôles disponibles : `admin` (lecture + écriture) et `viewer` (lecture seule).

4. Connectez-vous sur `/admin/connexion`.

Recommandations : **Authentication › Providers › Email** — désactivez les inscriptions publiques (« Enable sign ups » = off) pour que seuls les comptes créés manuellement existent.

## 6. Formulaire de contact

Le formulaire de la page `/contact` envoie un e-mail à `NOTIFICATIONS_EMAIL_TO` (avec `Reply-To` = adresse du demandeur) et archive le message dans la table `contact_messages` (visible dans **Admin › Messages**). Sans SMTP ni Resend configuré, le site renvoie une erreur propre en production et un mode démonstration en développement.

## 7. Vérifications

- `/demande` : le bandeau « Mode démonstration » disparaît une fois la clé service-role renseignée.
- Envoyez une demande de test : elle apparaît dans `/admin/demandes`, ses documents dans **Storage › loan-documents** (privé).
- Le lien « Ouvrir (lien temporaire) » d'un document génère une URL signée de 2 minutes.

## 8. Cache et mises à jour

Les données publiques (produits, réglages, témoignages, partenaires) sont mises en cache 5 minutes et invalidées immédiatement lors d'une modification depuis l'espace d'administration (`revalidateTag`).
