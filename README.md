# Express Finance — Site vitrine & plateforme de demande de financement

Site Next.js 15 (App Router, TypeScript, Tailwind CSS v4) avec back-end Supabase (PostgreSQL, Auth, Storage, RLS).

## Démarrage rapide

```bash
npm install
cp .env.example .env.local   # compléter les valeurs (voir docs/CONFIGURATION.md)
npm run dev
```

| Script | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm run start` | Build et serveur de production |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint |
| `npm run verify` | typecheck + lint + build |

## Documentation

- [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md) — Supabase, variables d'environnement, premier administrateur
- [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) — mise en production
- [`docs/PERSONNALISATION.md`](docs/PERSONNALISATION.md) — logo, contenus, taux, frais, témoignages, partenaires
- [`docs/RAPPORT.md`](docs/RAPPORT.md) — rapport d'implémentation complet et liste des éléments à fournir par le client

## Structure

```
src/
  app/
    [locale]/(site)/   Pages publiques FR/IT/ES (accueil, financements, simulateur, demande, contact, légal)
    (admin)/admin/     Espace d’administration (protégé)
    api/applications   Dépôt sécurisé des demandes
    api/admin/documents  URL signées vers les documents privés
  components/          UI, sections d'accueil, simulateur, formulaires, admin
  hooks/               useLoanSimulator
  lib/
    config/            site.ts (contact, identité), loans.ts (produits, taux, frais, pénalités)
    finance/           moteur de calcul (amortissement, TAEG estimatif, pénalités), formatage
    data/              accès au catalogue (Supabase avec repli statique)
    security/          rate limiting, jetons anti-robot, validation binaire des fichiers
    supabase/          clients navigateur / serveur / service-role
    validation/        schémas Zod
  i18n/                config, dictionnaires FR/IT/ES, produits, FAQ, textes légaux
  data/                témoignages de lancement, partenaires génériques
  types/               types de la base
supabase/migrations/   schéma SQL, RLS, buckets
```
