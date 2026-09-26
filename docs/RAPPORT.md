# Rapport d'implémentation — Site EXPRESS FINANCE

Mis à jour le 26 septembre 2026 · Stack : Next.js 15.5 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Supabase · Framer Motion · Zod

---

## 1. Ce qui a été construit

Bandeau du hero : « Express Finance est une structure de financement du complexe EURO BANK » (traduit dans les 10 langues, affirmation fournie par le client — à documenter juridiquement).

Un site vitrine financier complet en **10 langues (FR, IT, ES, EN, HR, SL, SK, EL, NL, PT)**, orienté conversion :

- **Accueil** : hero photo avec message court, présentation illustrée, produits, étapes illustrées, avantages, aperçu du simulateur, confiance, témoignages, carrousel partenaires, FAQ, contact avec conseiller.
- **Catalogue de financements** (6 produits) avec fiche détaillée par produit et simulateur intégré.
- **Simulateur de prêt** : mensualité, intérêts, frais, coût total, TAEG estimatif, tableau d'amortissement, graphiques, options avancées de taux, simulateur de pénalités de retard.
- **Page Contact** : conseiller en fond, WhatsApp en avant, **formulaire de contact** (nom, prénom, profession, salaire, montant, durée, WhatsApp, téléphone, e-mail, motif, autres infos) envoyé par e-mail à l'administrateur par le backend et archivé dans l'admin.
- **Formulaire de demande** en 4 étapes, validation client + serveur (Zod, messages localisés), dépôt de documents chiffré, anti-spam multicouche, référence de dossier unique, page de confirmation avec CTA WhatsApp / e-mail.
- **Back-end Supabase** : schéma relationnel, Row Level Security, bucket privé, audit des statuts.
- **Espace d'administration** protégé (en français) : tableau de bord, demandes, produits, témoignages, partenaires, paramètres du simulateur.
- **SEO** : métadonnées par langue, `hreflang`, canonicals, Open Graph, JSON-LD (Organisation, FAQ, fil d'Ariane), sitemap multilingue, robots.
- **Pages légales** complètes en 3 langues (mentions, confidentialité, CGU, cookies, avertissement).

Vérifications : `tsc` ✔ · ESLint ✔ · tests du moteur de calcul ✔ · `next build` ✔.

## 2. Identité visuelle

- Polices : **Poppins** (texte) et **Lexend** (titres), auto-hébergées via `next/font`.
- Couleurs : primaire sauge `#A3C9A8` (accents, badges, surlignages), secondaire turquoise `#29ADB2` (actions, liens), fond sombre vert profond dérivé (`#0d2c2e`). Tokens dans `src/app/globals.css` (`sage-*`, `brand-*`, `navy-*`).
- Logo provisoire vectoriel (`src/components/brand/logo.tsx`), remplaçable par fichiers.
- Photos : `public/images/photo-1..5.jpg` (hero, présentation, étapes, avantages / financements, conseiller).

## 3. Multilingue

| Langue | URL | Fichiers |
|---|---|---|
| Français (défaut) | `/`, `/simulateur`… | `src/i18n/dictionaries/fr.ts` (+ produits/FAQ/légal dans `products.ts`, `faq.ts`, `legal.ts`) |
| Italien, Espagnol | `/it`, `/es` | `dictionaries/it.ts`, `es.ts` (contenus dans les mêmes fichiers que FR) |
| Anglais, Croate, Slovène, Slovaque, Grec, Néerlandais, Portugais | `/en`, `/hr`, `/sl`, `/sk`, `/el`, `/nl`, `/pt` | `dictionaries/<code>.ts` + `content/<code>.ts` (produits, FAQ, témoignages, textes légaux) |

Sélecteur de langue **flottant en bas à gauche** (drapeau + nom de la langue, menu accessible au clavier), à l'opposé du bouton WhatsApp. Drapeaux SVG servis localement (`public/flags`).

- Le middleware réécrit les URL sans préfixe vers `fr` et redirige `/fr/...` vers la version canonique sans préfixe.
- Contenus traduits : interface, simulateur, formulaire et messages d'erreur (client + API), produits (`src/i18n/products.ts`), FAQ (`src/i18n/faq.ts`), témoignages (`src/data/testimonials.ts`), pages légales (`src/i18n/legal.ts`), messages WhatsApp / e-mail.
- Les produits créés dans l'admin sans traduction s'affichent en français dans toutes les langues.

## 4. Architecture

```
src/app/[locale]/(site)/   pages publiques (layout racine localisé)
src/app/(admin)/admin/     administration (layout racine séparé, FR)
src/app/api/               route handlers (dépôt de demande, documents signés)
src/i18n/                  config, dictionnaires, produits, FAQ, légal, provider client
src/components/            ui / layout / home / simulator / forms / products / admin / legal / motion
src/lib/config/            site.ts, loans.ts, navigation.ts
src/lib/finance/           moteur de calcul, formatage localisé
src/lib/data/              catalogue (Supabase + repli statique)
src/lib/security/          rate limiting, jetons HMAC, validation binaire
src/lib/supabase/          clients navigateur / serveur / service-role
supabase/migrations/       schéma SQL, RLS, buckets
```

## 5. Taux, frais, pénalités, durées

- **Taux** : nominal annuel fixe de 2 %, amortissement constant (mensualités fixes, intérêts sur capital restant dû). Décrit ainsi dans le simulateur, les fiches produits, la FAQ et la page Frais et conditions. Modifiable depuis l'admin.
- **Frais** : aucun montant intégré au simulateur ; la page Frais et conditions indique que des frais de dossier peuvent s'appliquer et sont précisés dans l'offre. Des frais chiffrés peuvent être ajoutés depuis l'admin (ils apparaîtront alors dans le simulateur et sur la page).
- **Pénalités** (barème standard, modifiable) : délai de grâce 5 jours, frais fixes 15 €, pénalité 2 % de l'échéance, intérêts de retard 5 %/an prorata temporis.
- **Durées** : personnel 6–120 mois, immobilier 12–600 (50 ans), consommation 6–84, professionnel 6–360, projet 12–600, sur mesure 6–600 (par défaut 12, 240, 12, 36, 60, 24). Plafond global : 600 mois.

## 6. Témoignages et partenaires

- **Témoignages de lancement** (6, traduits) : signalés `isDemo: true` dans le code, sans mention à l'écran. Ils sont remplacés automatiquement par les témoignages réels publiés dans l'admin. À remplacer avant exploitation publique.
- **Partenaires** : 8 établissements génériques dessinés (aucune marque réelle). Remplacés automatiquement par les partenaires vérifiés publiés dans l'admin (nom, logo, site).

## 7. Formulaire de contact et e-mails

- Route `POST /api/contact` : vérification d'origine, limite 5 envois/heure/IP, honeypot, jeton HMAC temporel, Turnstile optionnel, validation Zod (messages localisés), échappement HTML du corps, en-têtes nettoyés (anti-injection), `Reply-To` = e-mail du demandeur.
- Transport : SMTP (`SMTP_*`, compatible Gmail avec mot de passe d'application) ou Resend. Testé avec un serveur SMTP factice : mail reçu, injection d'en-tête neutralisée, `<script>` échappé.
- Archivage dans `contact_messages` (migration `20260926000000_contact_messages.sql`) et page **Admin › Messages** avec statut (nouveau / contacté / clôturé).
- La notification de nouvelle demande de financement utilise le même transport.

## 8. Supabase, variables d'environnement, sécurité

Inchangés : voir `docs/CONFIGURATION.md`. Rappel sécurité : RLS, service-role côté serveur uniquement, validation Zod client + serveur, signature binaire des fichiers, honeypot + jeton HMAC temporel, Turnstile optionnel, rate limiting mémoire + base, idempotence, vérification d'origine, CSP stricte, IP hachée, audit des statuts.

## 9. Accès à l'espace d'administration

1. Créer le projet Supabase et exécuter la migration (`docs/CONFIGURATION.md`).
2. Renseigner `.env.local` (URL, clé anon, clé service-role).
3. Créer un utilisateur dans **Authentication › Users** et l'insérer dans `admin_users` avec le rôle `admin`.
4. Se connecter sur `/admin/connexion` → tableau de bord `/admin`.

Sans Supabase configuré, `/admin` affiche une page d'indisponibilité (le site public fonctionne en mode démonstration).

## 10. Lancer et déployer

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000 (/, /it, /es, /en, /hr, /sl, /sk, /el, /nl, /pt)
npm run verify     # typecheck + lint + build
npm test
```

Déploiement : `docs/DEPLOIEMENT.md` (Vercel recommandé).

## 11. Points d'attention avant mise en ligne publique

- Remplacer les témoignages de lancement par des avis réels (avec accord écrit).
- Remplacer les partenaires génériques par les partenaires effectifs (avec droit d'usage des logos).
- Faire valider les pages légales par un juriste et compléter : forme juridique, numéros BCE/TVA, statut réglementaire éventuel.
- Confirmer le barème de pénalités et la nature exacte du taux avec Express Finance.
- Fournir le logo définitif, les clés Supabase et les identifiants SMTP (ou Resend) pour l'envoi des e-mails.
- Les 9 traductions ont fait l’objet d’une relecture linguistique dédiée (terminologie bancaire locale, registre, calques du français) ; une validation finale par le client ou un natif reste recommandée avant mise en ligne publique.
- Poppins et Lexend ne couvrent pas l'alphabet grec : la version grecque utilise la police système de secours.
