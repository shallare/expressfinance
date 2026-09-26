import 'server-only';

import nodemailer from 'nodemailer';

/**
 * Envoi d'e-mails côté serveur.
 *
 * Transports pris en charge (dans l'ordre) :
 *   1. SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) — ex. Gmail
 *      avec un mot de passe d'application ;
 *   2. Resend (`RESEND_API_KEY`).
 * Sans configuration, `isMailConfigured` vaut `false` et rien n'est envoyé.
 *
 * Sécurité : le sujet et le nom d'expéditeur sont nettoyés de tout retour à la
 * ligne (injection d'en-têtes) ; le corps HTML est construit à partir de
 * valeurs échappées uniquement.
 */

const smtp = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
};

export const isMailConfigured = Boolean(
  (smtp.host && smtp.user && smtp.pass) || process.env.RESEND_API_KEY,
);

export function mailFrom(): string {
  return process.env.NOTIFICATIONS_EMAIL_FROM || smtp.user || 'no-reply@express-finance.local';
}

export function mailTo(): string {
  return process.env.NOTIFICATIONS_EMAIL_TO || 'financeexpress258@gmail.com';
}

/** Supprime les retours à la ligne (protection contre l'injection d'en-têtes). */
export function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, 200);
}

/** Échappement HTML strict pour toute donnée utilisateur insérée dans un e-mail. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

export async function sendMail(message: MailMessage): Promise<{ ok: true } | { ok: false; error: string }> {
  const subject = sanitizeHeader(message.subject);
  const replyTo = message.replyTo ? sanitizeHeader(message.replyTo) : undefined;

  if (smtp.host && smtp.user && smtp.pass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        auth: { user: smtp.user, pass: smtp.pass },
      });
      await transporter.sendMail({
        from: mailFrom(),
        to: message.to,
        subject,
        text: message.text,
        html: message.html,
        replyTo,
        attachments: message.attachments?.map((a) => ({ filename: sanitizeHeader(a.filename), content: a.content, contentType: a.contentType })),
      });
      return { ok: true };
    } catch (error) {
      console.error('[mail] échec SMTP', error instanceof Error ? error.message : '');
      return { ok: false, error: 'smtp' };
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: mailFrom(),
          to: [message.to],
          subject,
          text: message.text,
          html: message.html,
          reply_to: replyTo,
          attachments: message.attachments?.map((a) => ({ filename: sanitizeHeader(a.filename), content: a.content.toString('base64') })),
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { ok: true };
    } catch (error) {
      console.error('[mail] échec Resend', error instanceof Error ? error.message : '');
      return { ok: false, error: 'resend' };
    }
  }

  return { ok: false, error: 'not_configured' };
}
