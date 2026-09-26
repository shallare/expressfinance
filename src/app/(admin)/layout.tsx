import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { fontClassName } from '@/lib/fonts';
import { RouteProgress } from '@/components/layout/route-progress';
import '../globals.css';

export const metadata: Metadata = {
  title: { default: 'Administration', template: '%s · Administration Express Finance' },
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = { themeColor: '#0d2c2e', width: 'device-width', initialScale: 1 };

/** Layout racine de l'espace d'administration (toujours en français). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontClassName}>
      <body className="flex min-h-dvh flex-col bg-surface">
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
