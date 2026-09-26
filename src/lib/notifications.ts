import 'server-only';

import { siteConfig } from '@/lib/config/site';
import { escapeHtml, isMailConfigured, mailTo, sendMail } from '@/lib/mail';

/**
 * Notification interne de nouvelle demande de financement (si un transport
 * e-mail est configuré). Aucune donnée sensible : référence, produit, montant.
 */
export async function notifyNewApplication(args: { reference: string; productName: string; amount: number; duration: number }): Promise<void> {
  if (!isMailConfigured) return;
  const adminUrl = `${siteConfig.url}/admin/demandes`;
  const lines = [
    ['Référence', args.reference],
    ['Produit', args.productName],
    ['Montant', `${args.amount.toLocaleString('fr-BE')} €`],
    ['Durée', `${args.duration} mois`],
  ];
  const text = ['Nouvelle demande de financement reçue.', '', ...lines.map(([k, v]) => `${k} : ${v}`), '', `Consulter le dossier : ${adminUrl}`].join('\n');
  const html = `<p>Nouvelle demande de financement reçue.</p><ul>${lines.map(([k, v]) => `<li><strong>${escapeHtml(k)}</strong> : ${escapeHtml(v)}</li>`).join('')}</ul><p><a href="${adminUrl}">Consulter le dossier</a></p>`;
  await sendMail({ to: mailTo(), subject: `[Express Finance] Nouvelle demande ${args.reference}`, text, html });
}
