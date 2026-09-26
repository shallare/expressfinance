import { Briefcase, Home, Layers, Rocket, ShoppingBag, User, type LucideProps } from 'lucide-react';
import type { LoanProduct } from '@/lib/config/loans';

const icons: Record<LoanProduct['icon'], React.ComponentType<LucideProps>> = {
  User,
  Home,
  ShoppingBag,
  Briefcase,
  Rocket,
  Layers,
};

export function ProductIcon({ icon, className }: { icon: LoanProduct['icon']; className?: string }) {
  const Icon = icons[icon] ?? Layers;
  return <Icon className={className} aria-hidden="true" />;
}
