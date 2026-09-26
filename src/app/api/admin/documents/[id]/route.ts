import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/auth/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/documents/:id
 * Génère une URL signée de courte durée (2 min) vers le document privé et
 * redirige l'administrateur authentifié vers celle-ci. La RLS du bucket
 * empêche toute lecture par un non-admin.
 */
export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: 'Non autorisé.' }, { status: 401 });

  const { id } = await context.params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ message: 'Identifiant invalide.' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: doc } = await supabase
    .from('application_documents')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();
  if (!doc) return NextResponse.json({ message: 'Document introuvable.' }, { status: 404 });

  const { data, error } = await supabase.storage.from('loan-documents').createSignedUrl(doc.storage_path, 120);
  if (error || !data) {
    return NextResponse.json({ message: 'Impossible de générer le lien.' }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl, {
    status: 302,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}
