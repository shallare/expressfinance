import Link from 'next/link';
import { BarChart3, FileText, Handshake, Inbox, LogOut, MessageSquareQuote, Package, Settings, ExternalLink } from 'lucide-react';
import { requireAdmin } from '@/lib/auth/admin';
import { Logo } from '@/components/brand/logo';
import { Badge } from '@/components/ui/badge';
import { signOutAction } from '@/app/(admin)/admin/actions';

const nav = [
  { href: '/admin', label: 'Tableau de bord', icon: BarChart3 },
  { href: '/admin/demandes', label: 'Demandes', icon: FileText },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/temoignages', label: 'Témoignages', icon: MessageSquareQuote },
  { href: '/admin/partenaires', label: 'Partenaires', icon: Handshake },
  { href: '/admin/parametres', label: 'Simulateur', icon: Settings },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="border-b border-line bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block">
          <Link href="/admin" aria-label="Tableau de bord">
            <Logo />
          </Link>
          <Badge tone="neutral" className="lg:mt-3">
            {session.role === 'admin' ? 'Administrateur' : 'Lecture seule'}
          </Badge>
        </div>
        <nav aria-label="Administration" className="px-3 pb-3 lg:pb-0">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-navy-50 hover:text-navy-900">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden border-t border-line p-3 lg:block">
          <p className="truncate px-3 py-2 text-xs text-ink-subtle">{session.email}</p>
          <Link href="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-navy-50">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Voir le site
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-red-50 hover:text-red-700">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
