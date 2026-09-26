import 'server-only';

import { createHash, createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { siteConfig } from '@/lib/config/site';

/* -------------------------------------------------------------------------- */
/*  Secret serveur                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Secret utilisé pour signer les jetons de formulaire et hacher les adresses
 * IP. Dérivé de FORM_SECRET (recommandé) ou, à défaut, de la clé service-role.
 * Sans aucun secret, un secret éphémère est généré au démarrage (les jetons
 * ne survivent pas à un redémarrage — acceptable en développement).
 */
const ephemeral = randomBytes(32).toString('hex');
function serverSecret(): string {
  return process.env.FORM_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ephemeral;
}

/* -------------------------------------------------------------------------- */
/*  Adresse IP                                                                */
/* -------------------------------------------------------------------------- */

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') ?? headers.get('cf-connecting-ip') ?? 'unknown';
}

/** Hachage salé et irréversible : jamais d'IP en clair en base. */
export function hashIp(ip: string): string {
  return createHash('sha256').update(`${serverSecret()}:${ip}`).digest('hex').slice(0, 40);
}

/* -------------------------------------------------------------------------- */
/*  Vérification d'origine (protection CSRF)                                  */
/* -------------------------------------------------------------------------- */

export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get('origin') ?? headers.get('referer');
  if (!origin) return false;
  try {
    const requestOrigin = new URL(origin).origin;
    const allowed = new Set<string>([siteConfig.url]);
    const host = headers.get('host');
    if (host) {
      allowed.add(`https://${host}`);
      allowed.add(`http://${host}`);
    }
    return allowed.has(requestOrigin);
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*  Jeton temporel signé (piège à robots)                                     */
/* -------------------------------------------------------------------------- */

/**
 * Le formulaire embarque un jeton `timestamp.signature` généré côté serveur
 * au rendu. À la soumission on vérifie :
 *   - la signature (impossible à forger sans le secret),
 *   - un délai minimal (un humain ne remplit pas le formulaire en 3 s),
 *   - un délai maximal (jeton expiré après 2 h).
 */
export function createFormToken(now = Date.now()): string {
  const payload = String(now);
  const signature = createHmac('sha256', serverSecret()).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export type FormTokenStatus = 'valid' | 'invalid' | 'too_fast' | 'expired';

export function verifyFormToken(
  token: string | null,
  { minMs = 3_000, maxMs = 2 * 60 * 60 * 1000, now = Date.now() } = {},
): FormTokenStatus {
  if (!token || !token.includes('.')) return 'invalid';
  const [payload, signature] = token.split('.');
  if (!/^\d{10,16}$/.test(payload) || !/^[a-f0-9]{64}$/.test(signature)) return 'invalid';
  const expected = createHmac('sha256', serverSecret()).update(payload).digest('hex');
  const a = Buffer.from(signature, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return 'invalid';
  const issuedAt = Number(payload);
  if (now - issuedAt < minMs) return 'too_fast';
  if (now - issuedAt > maxMs) return 'expired';
  return 'valid';
}

/* -------------------------------------------------------------------------- */
/*  Cloudflare Turnstile (optionnel)                                          */
/* -------------------------------------------------------------------------- */

export const isTurnstileEnabled = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY,
);

export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  if (!isTurnstileEnabled) return true;
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip === 'unknown' ? undefined : ip,
      }),
      signal: AbortSignal.timeout(5_000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*  Numéro de référence                                                       */
/* -------------------------------------------------------------------------- */

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans 0/O/1/I

export function generateReferenceNumber(date = new Date()): string {
  const ymd = `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(
    date.getUTCDate(),
  ).padStart(2, '0')}`;
  const bytes = randomBytes(6);
  let suffix = '';
  for (let i = 0; i < 6; i += 1) suffix += REFERENCE_ALPHABET[bytes[i] % REFERENCE_ALPHABET.length];
  return `EF-${ymd}-${suffix}`;
}
