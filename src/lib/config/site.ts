/**
 * ============================================================================
 *  CONFIGURATION GLOBALE DE L'ENTREPRISE
 * ============================================================================
 *  Point d'entrée UNIQUE pour toutes les informations de contact, l'identité
 *  et les métadonnées du site. Modifier ce fichier suffit à mettre à jour
 *  l'ensemble du site (en-tête, pied de page, CTA, SEO, données structurées).
 * ============================================================================
 */

export const siteConfig = {
  /** Nom commercial affiché partout. */
  name: 'Express Finance',
  /** Raison sociale — À CONFIRMER PAR LE CLIENT (forme juridique, n° BCE/TVA). */
  legalName: 'Express Finance',
  slogan: 'Votre projet. Votre financement. Votre avenir.',
  tagline: 'Solutions de financement internationales, simples et transparentes.',
  description:
    'Express Finance est une entreprise internationale de financement qui propose des solutions de prêts accessibles, rapides à instruire et adaptées aux besoins de chaque client : prêt personnel, crédit immobilier, financement professionnel et financement de projet.',

  /** URL canonique. Définie via NEXT_PUBLIC_SITE_URL en production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),

  locale: 'fr_BE',
  language: 'fr',
  currency: 'EUR',
  currencyLocale: 'fr-BE',

  contact: {
    /** Numéro affiché à l'écran (format lisible). */
    phoneDisplay: '+39 377 326 5418',
    /** Format E.164 pour les liens `tel:`. */
    phoneE164: '+393773265418',
    /** Format attendu par wa.me : indicatif + numéro, sans « + » ni espace. */
    whatsappNumber: '393773265418',
    /** Adresse de contact affichée aux visiteurs (support). */
    email: 'support@expresssfinance.com',
    address: {
      street: '724 Chaussée de Wavre',
      postalCode: '1040',
      city: 'Bruxelles',
      region: 'Bruxelles-Capitale',
      country: 'Belgique',
      countryCode: 'BE',
    },
    /** Horaires — À CONFIRMER PAR LE CLIENT. */
    openingHours: {
      isPlaceholder: true,
      label: 'Du lundi au vendredi, 9h00 – 18h00 (CET)',
    },
  },

  /** Aucun réseau social fourni par le client à ce jour. */
  social: [] as ReadonlyArray<{ name: string; url: string }>,

  /**
   * Éléments non encore fournis / non vérifiés par le client.
   * Sert de source unique à la page d'état interne `/docs` et au rapport.
   */
  pendingClientInformation: [
    'Logo définitif (une identité provisoire est fournie).',
    'Forme juridique exacte, numéro d’entreprise (BCE) et numéro de TVA.',
    'Statut réglementaire éventuel (agrément, enregistrement FSMA, intermédiaire de crédit).',
    'Nature exacte du taux de 2 % (mensuel / annuel / nominal / TAEG / forfaitaire).',
    'Montants et nature des frais de procédure applicables.',
    'Barème de pénalités de retard et délai de grâce contractuel.',
    'Témoignages clients authentiques et autorisations de publication.',
    'Liste des partenaires bancaires vérifiés et droits d’usage des logos.',
    'Textes juridiques validés par un juriste (CGU, confidentialité, mentions légales).',
    'Comptes de réseaux sociaux, le cas échéant.',
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Adresse postale sur une seule ligne. */
export function formatAddressOneLine(): string {
  const a = siteConfig.contact.address;
  return `${a.street}, ${a.postalCode} ${a.city}, ${a.country}`;
}
