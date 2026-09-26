/**
 * Établissements partenaires affichés dans le carrousel.
 *
 * Les logos ci-dessous sont des identités génériques dessinées pour le site
 * (aucune marque réelle). Ils sont remplacés automatiquement par les
 * partenaires vérifiés publiés depuis l'espace d'administration (table
 * `partners`, avec `verified` et `logo_rights_confirmed`).
 */
export interface Partner {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  verified: boolean;
  isPlaceholder: boolean;
  /** Style du logo généré (uniquement pour les partenaires génériques). */
  style?: 'shield' | 'circle' | 'bars' | 'wave' | 'hex' | 'globe' | 'arc' | 'diamond';
  /** Couleur d'accent du logo généré. */
  color?: string;
}

export const placeholderPartners: Partner[] = [
  { id: 'p1', name: 'Meridian Bank', logoUrl: null, website: null, verified: false, isPlaceholder: true, style: 'shield', color: '#1d4ed8' },
  { id: 'p2', name: 'Banca Aurora', logoUrl: null, website: null, verified: false, isPlaceholder: true, style: 'circle', color: '#b45309' },
  { id: 'p3', name: 'Crédit Atlantique', logoUrl: null, website: null, verified: false, isPlaceholder: true, style: 'wave', color: '#0f766e' },
  { id: 'p4', name: 'Nordica Capital', logoUrl: null, website: null, verified: false, isPlaceholder: true, style: 'bars', color: '#334155' },
  { id: 'p5', name: 'Iberia Finance Group', logoUrl: null, website: null, verified: false, isPlaceholder: true, style: 'hex', color: '#be123c' },
  { id: 'p6', name: 'Helvetia Trust', logoUrl: null, website: null, verified: false, isPlaceholder: true, style: 'diamond', color: '#7c2d12' },
  { id: 'p7', name: 'Continental Banking', logoUrl: null, website: null, verified: false, isPlaceholder: true, style: 'globe', color: '#1e3a8a' },
  { id: 'p8', name: 'Alpine Credit', logoUrl: null, website: null, verified: false, isPlaceholder: true, style: 'arc', color: '#166534' },
];
