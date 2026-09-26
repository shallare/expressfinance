import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/product-form';

export const dynamic = 'force-dynamic';

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin('admin');
  const { id } = await params;
  const isNew = id === 'nouveau';
  if (!isNew && !z.string().uuid().safeParse(id).success) notFound();

  let product = null;
  if (!isNew) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from('loan_products').select('*').eq('id', id).maybeSingle();
    if (!data) notFound();
    product = data;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/admin/produits" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Tous les produits
      </Link>
      <h1 className="text-2xl font-bold text-navy-900">{isNew ? 'Nouveau produit' : `Modifier : ${product?.name}`}</h1>
      <ProductForm product={product} />
    </div>
  );
}
