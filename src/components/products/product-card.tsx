'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LoanProduct } from '@/lib/config/loans';
import { formatCurrencyCompact, formatDuration } from '@/lib/finance/format';
import { localePath } from '@/i18n/config';
import { useLocale } from '@/i18n/provider';
import { ProductIcon } from './product-icon';

export function ProductCard({ product }: { product: LoanProduct }) {
  const { locale, dict } = useLocale();
  return (
    <article className="card-surface card-hover group relative flex h-full flex-col p-6">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-sage-100 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:from-brand-500 group-hover:to-navy-700 group-hover:text-white">
        <ProductIcon icon={product.icon} className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-navy-900">
        <Link href={localePath(locale, `/financements/${product.slug}`)} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
          {product.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{product.description}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-xs">
        <div>
          <dt className="text-ink-subtle">{dict.products.amount}</dt>
          <dd className="mt-0.5 font-semibold text-navy-900">
            {formatCurrencyCompact(product.minAmount, locale)} – {formatCurrencyCompact(product.maxAmount, locale)}
          </dd>
        </div>
        <div>
          <dt className="text-ink-subtle">{dict.products.duration}</dt>
          <dd className="mt-0.5 font-semibold text-navy-900">
            {product.minDuration} – {formatDuration(product.maxDuration, locale)}
          </dd>
        </div>
      </dl>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        {dict.products.discover}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
      </span>
    </article>
  );
}
