import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabasePublicEnv } from './env';
import type { Database } from '@/types/database';

/**
 * Client Supabase côté serveur lié à la session de l'utilisateur (cookies).
 * Soumis à la Row Level Security : c'est le client à utiliser dans les pages
 * et actions de l'espace d'administration.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(supabasePublicEnv.url, supabasePublicEnv.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Appelé depuis un Server Component : les cookies sont rafraîchis
          // par le middleware, cette erreur peut être ignorée.
        }
      },
    },
  });
}
