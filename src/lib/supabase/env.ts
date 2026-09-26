/**
 * Accès centralisé aux variables Supabase.
 * Les clés publiques peuvent être lues partout ; la clé service-role
 * n'est accessible que via `admin.ts` (module `server-only`).
 */
export const supabasePublicEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
};

/** `true` si les clés publiques sont renseignées (site branché sur Supabase). */
export const isSupabaseConfigured = Boolean(
  supabasePublicEnv.url && supabasePublicEnv.anonKey,
);
