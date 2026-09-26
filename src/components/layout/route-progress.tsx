'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Barre de progression fine en haut de l'écran pendant les navigations.
 *
 * Démarrage : clic sur un lien interne (même origine, sans modificateur,
 * sans cible externe) ou navigation historique (précédent / suivant).
 * Fin : changement effectif de route (pathname ou paramètres).
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const timer = useRef<number | null>(null);
  const routeKey = `${pathname}?${searchParams?.toString() ?? ''}`;
  const lastRoute = useRef(routeKey);

  const finish = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setProgress(100);
    window.setTimeout(() => {
      visibleRef.current = false;
      setVisible(false);
      setProgress(0);
    }, 260);
  }, []);

  const start = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    visibleRef.current = true;
    setVisible(true);
    setProgress(12);
    timer.current = window.setInterval(() => {
      // Progression asymptotique : rapide au début, ralentit vers 90 %.
      setProgress((p) => (p < 90 ? p + Math.max(0.5, (90 - p) / 12) : p));
    }, 120);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };
    const onPop = () => start();
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPop);
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [start]);

  useEffect(() => {
    if (lastRoute.current !== routeKey) {
      lastRoute.current = routeKey;
      if (visibleRef.current) finish();
    }
  }, [routeKey, finish]);

  // Sécurité : si la navigation est annulée (erreur, lien intercepté), on referme après 8 s.
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(finish, 8000);
    return () => window.clearTimeout(t);
  }, [visible, finish]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms ease' }}
    >
      <div
        className="h-full bg-gradient-to-r from-brand-500 via-sage-300 to-brand-400 shadow-[0_0_12px_rgba(41,173,178,0.8)]"
        style={{ width: `${progress}%`, transition: 'width 160ms ease-out' }}
      />
    </div>
  );
}
