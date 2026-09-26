import 'server-only';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AdminRole = 'admin' | 'viewer';

export interface AdminSession {
  userId: string;
  email: string | null;
  role: AdminRole;
}

/**
 * Récupère la session administrateur courante, ou `null`.
 * Le rôle provient de la fonction SQL `admin_role()` (SECURITY DEFINER) :
 * un utilisateur authentifié mais absent de `admin_users` est refusé.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: role } = await supabase.rpc('admin_role');
  if (role !== 'admin' && role !== 'viewer') return null;

  return { userId: user.id, email: user.email ?? null, role };
}

/**
 * Garde d'accès pour pages et actions admin.
 * @param minimumRole `'admin'` pour les opérations d'écriture.
 */
export async function requireAdmin(minimumRole: AdminRole = 'viewer'): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect('/admin/connexion?error=unauthorized');
  if (minimumRole === 'admin' && session.role !== 'admin') redirect('/admin?error=forbidden');
  return session;
}
