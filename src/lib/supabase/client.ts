'use client';

import { createBrowserClient } from '@supabase/ssr';
import { supabasePublicEnv } from './env';
import type { Database } from '@/types/database';

/** Client Supabase pour les composants client (clé anonyme, soumis à la RLS). */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabasePublicEnv.url, supabasePublicEnv.anonKey);
}
