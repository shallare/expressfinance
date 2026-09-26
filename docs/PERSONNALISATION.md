# Personnalisation du site

## Remplacer le logo provisoire

1. Déposez les fichiers du client dans `public/brand/` (ex. `logo.svg`, `logo-white.svg`, et un `logo-mark.svg` carré pour le favicon/OG).
2. Ouvrez `src/components/brand/logo.tsx` et renseignez :

```ts
export const brandAssets = {
  logoLight: '/brand/logo.svg',        // fond clair (en-tête)
  logoDark: '/brand/logo-white.svg',   // fond sombre (pied de page)
  width: 180,
  height: 40,
};
```

3. Remplacez `src/app/icon.svg` (favicon) et, si souhaité, adaptez `src/app/opengraph-image.tsx`.

Le composant `<Logo />` bascule automatiquement sur les images fournies ; le monogramme SVG provisoire (`LogoMark`) reste disponible.

## Modifier les informations de contact

Tout est centralisé dans `src/lib/config/site.ts` : nom, slogan, téléphone, WhatsApp, e-mail, adresse, horaires, réseaux sociaux. Les messages WhatsApp pré-remplis et les objets d'e-mail sont dans `src/lib/contact.ts`.

## Produits, taux, frais, pénalités

- **Sans Supabase** : `src/lib/config/loans.ts` (valeurs par défaut).
- **Avec Supabase** : espace d'administration › *Produits* et *Simulateur*. Les valeurs de la base prennent le pas sur le fichier.

Champs `isPlaceholder` : tant qu'ils valent `true` (ou que la case « confirmé » n'est pas cochée dans l'admin), un avertissement « à confirmer » s'affiche sur le site.

### Modèle de taux

| `period` | `method` | Signification |
|---|---|---|
| `annual` | `amortizing` | Taux nominal annuel, mensualité constante (méthode bancaire classique) — **défaut** |
| `monthly` | `amortizing` | Taux mensuel, mensualité constante |
| `annual` / `monthly` | `flat` | Intérêt simple sur le capital initial |
| `total` | `flat` | Pourcentage forfaitaire du capital, une seule fois |

### Frais

Tableau JSON d'objets `{ id, label, kind, value, timing, description? }` :
- `kind` : `fixed` (montant en €) ou `percent_of_principal` ;
- `timing` : `upfront` (payé à la mise en place) ou `monthly` (ajouté à chaque échéance).

## Témoignages authentiques

Admin › *Témoignages* › « Ajouter ». La publication exige une **référence de consentement** (preuve de l'accord du client). Dès qu'un témoignage est publié, les exemples de démonstration disparaissent du site.

Sans Supabase : éditez `src/data/testimonials.ts` et passez `isDemo` à `false`.

## Partenaires vérifiés

Admin › *Partenaires*. Un partenaire n'apparaît que si les trois cases sont cochées : **actif**, **partenariat vérifié**, **droit d'usage du logo confirmé**. Déposez le logo dans le bucket `public-assets` (Storage) et collez l'URL publique.

## FAQ et textes

- FAQ : `src/i18n/faq.ts` (également injectée en données structurées `FAQPage`).
- Sections de l'accueil : `src/components/home/*`.
- Pages légales : textes dans `src/i18n/legal.ts` (FR/IT/ES) — à faire valider par un juriste.

## Couleurs et typographie

Tokens Tailwind v4 dans `src/app/globals.css` (`@theme`). Polices : Poppins (texte) et Lexend (titres), auto-hébergées via `next/font`, modifiables dans `src/lib/fonts.ts`. Couleurs : sauge `#A3C9A8` (`sage-*`), turquoise `#29ADB2` (`brand-*`), vert profond (`navy-*`).

## Langues (10)

- Dictionnaires d'interface : `src/i18n/dictionaries/<code>.ts` (le français est la référence typée ; toute clé ajoutée en FR doit l'être dans les 9 autres).
- Contenus FR/IT/ES : `src/i18n/products.ts`, `faq.ts`, `legal.ts`, `src/data/testimonials.ts`. Contenus EN/HR/SL/SK/EL/NL/PT : `src/i18n/content/<code>.ts`.
- Sélecteur flottant : `src/components/layout/language-switcher.tsx` ; drapeaux : `public/flags/<pays>.svg` (correspondance dans `src/i18n/config.ts`).
- Ajouter une langue : ajouter le code dans `src/i18n/config.ts` (`locales`, `localeNames`, `intlLocales`, `ogLocales`), créer le dictionnaire et compléter chaque fichier de contenu.

## Photos

Les visuels sont dans `public/images/` : `photo-1.jpg` (hero), `photo-2.jpg` (présentation, contact), `photo-3.jpg` (étapes, page Financements), `photo-4.jpg` (avantages, encart Financements), `photo-5.jpg` (conseiller). Remplacez les fichiers en conservant les noms, ou modifiez les chemins dans les composants `src/components/home/*`.

## Partenaires génériques

`src/data/partners.ts` définit 8 établissements dessinés (nom, style de monogramme, couleur). Ils disparaissent dès qu'un partenaire vérifié est publié dans l'admin.
