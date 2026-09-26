import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { supabasePublicEnv } from './env';
import type { Database } from '@/types/database';

/**
 * Client Supabase avec la clé SERVICE ROLE.
 *
 * ⚠️  Contourne la Row Level Security. À utiliser UNIQUEMENT :
 *   - côté serveur (`server-only` empêche tout import dans un composant client),
 *   - pour des opérations précises et validées (insertion d'une demande,
 *     dépôt d'un document, génération d'URL signée pour un administrateur
 *     authentifié).
 */
export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabasePublicEnv.url || !serviceRoleKey) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }
  return createClient<Database>(supabasePublicEnv.url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export const isSupabaseAdminConfigured = Boolean(
  supabasePublicEnv.url && process.env.SUPABASE_SERVICE_ROLE_KEY,
);
