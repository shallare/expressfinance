import { siteConfig } from '@/lib/config/site';
import type { Dictionary } from '@/i18n/dictionaries/fr';

/**
 * Construit un lien wa.me correctement encodé.
 * @param text Message pré-rempli (issu du dictionnaire de la langue courante).
 * @param reference Référence de dossier à ajouter (optionnel).
 * @param referenceLabel Libellé « Référence » localisé.
 */
export function buildWhatsappLink(text: string, reference?: string, referenceLabel = 'Référence'): string {
  const full = reference ? `${text} ${referenceLabel} : ${reference}.` : text;
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(full)}`;
}

export function buildMailtoLink(subject: string, body?: string): string {
  const params = new URLSearchParams();
  params.set('subject', subject);
  if (body) params.set('body', body);
  return `mailto:${siteConfig.contact.email}?${params.toString().replace(/\+/g, '%20')}`;
}

/** Lien e-mail de suivi après dépôt d'une demande. */
export function buildAfterApplicationMailto(email: Dictionary['email'], reference: string): string {
  return buildMailtoLink(`${email.subjectAfter} — ${reference}`, email.bodyAfter.replace('{ref}', reference));
}

export const telLink = `tel:${siteConfig.contact.phoneE164}`;

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${siteConfig.contact.address.street}, ${siteConfig.contact.address.postalCode} ${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`,
)}`;
