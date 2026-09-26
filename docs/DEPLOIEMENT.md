# Déploiement

## Prérequis

- Node.js ≥ 20.9 (testé avec Node 24)
- Projet Supabase configuré (voir `CONFIGURATION.md`)

## Développement local

```bash
npm install
cp .env.example .env.local   # puis compléter les valeurs
npm run dev                   # http://localhost:3000
```

Sans clés Supabase, le site fonctionne en **mode démonstration** : catalogue statique, simulateur complet, formulaire fonctionnel mais non persistant, admin indisponible.

## Vérification avant mise en production

```bash
npm run verify   # typecheck + lint + build
```

## Vercel (recommandé)

1. Importez le dépôt Git dans Vercel (framework détecté : Next.js).
2. **Environment Variables** : renseignez toutes les variables de `.env.example` (production + preview). Marquez `SUPABASE_SERVICE_ROLE_KEY`, `FORM_SECRET`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` comme *Sensitive*.
3. `NEXT_PUBLIC_SITE_URL` doit être l'URL publique finale (`https://www.express-finance.example`) : elle alimente les canonicals, le sitemap et la validation d'origine du formulaire.
4. Déployez. Le sitemap est disponible sur `/sitemap.xml`, le robots sur `/robots.txt`.

## Autre hébergeur Node (VPS, Railway, Render…)

```bash
npm ci
npm run build
npm run start   # port 3000 par défaut
```

Placez un reverse-proxy HTTPS (Nginx/Caddy) devant l'application et transmettez l'en-tête `X-Forwarded-For` (utilisé pour la limitation de débit).

## Après déploiement

- Ajoutez le domaine dans **Supabase › Authentication › URL Configuration › Site URL** et *Redirect URLs* (`https://votre-domaine/admin/**`).
- Testez `/demande` en conditions réelles (dépôt d'un PDF et d'une image).
- Vérifiez les en-têtes de sécurité avec <https://securityheaders.com>.
- Soumettez le sitemap dans Google Search Console.

## Sauvegardes

Activez les sauvegardes quotidiennes Supabase (plan Pro) ou planifiez un `pg_dump`. Les documents du bucket `loan-documents` doivent être inclus dans la politique de sauvegarde.
