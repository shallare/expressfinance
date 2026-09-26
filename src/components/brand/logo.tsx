import Image from 'next/image';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config/site';

/**
 * ============================================================================
 *  LOGO PROVISOIRE
 * ============================================================================
 *  Pour remplacer par le logo définitif du client :
 *    1. Déposez les fichiers dans `public/brand/` (ex. logo.svg, logo-white.svg).
 *    2. Renseignez `brandAssets.logoLight` / `brandAssets.logoDark` ci-dessous.
 *  Le composant basculera automatiquement sur les images fournies.
 * ============================================================================
 */
export const brandAssets = {
  /** Logo complet sur fond clair (ex. '/brand/logo.svg'). `null` = logo SVG provisoire. */
  logoLight: null as string | null,
  /** Logo complet sur fond sombre (ex. '/brand/logo-white.svg'). */
  logoDark: null as string | null,
  /** Dimensions intrinsèques utilisées par next/image si des fichiers sont fournis. */
  width: 180,
  height: 40,
};

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  /** Affiche uniquement le monogramme. */
  markOnly?: boolean;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={cn('h-10 w-10', className)}
      fill="none"
    >
      <defs>
        <linearGradient id="ef-mark-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#29adb2" />
          <stop offset="1" stopColor="#0d2c2e" />
        </linearGradient>
        <linearGradient id="ef-mark-gold" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d6e8d9" />
          <stop offset="1" stopColor="#a3c9a8" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#ef-mark-bg)" />
      {/* Trois barres ascendantes : « E » stylisé + croissance */}
      <rect x="10" y="22" width="5" height="9" rx="1.5" fill="#ffffff" fillOpacity="0.55" />
      <rect x="17.5" y="16" width="5" height="15" rx="1.5" fill="#ffffff" fillOpacity="0.8" />
      <rect x="25" y="9" width="5" height="22" rx="1.5" fill="url(#ef-mark-gold)" />
      <path d="M9 12.5 L20 9 L31 5.5" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ variant = 'light', className, markOnly = false }: LogoProps) {
  const src = variant === 'dark' ? brandAssets.logoDark : brandAssets.logoLight;

  if (src) {
    return (
      <Image
        src={src}
        alt={siteConfig.name}
        width={brandAssets.width}
        height={brandAssets.height}
        priority
        className={cn('h-10 w-auto', className)}
      />
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-[1.05rem] font-bold tracking-tight',
              variant === 'dark' ? 'text-white' : 'text-navy-900',
            )}
          >
            EXPRESS
          </span>
          <span
            className={cn(
              'font-display text-[0.7rem] font-semibold tracking-[0.28em]',
              variant === 'dark' ? 'text-sage-300' : 'text-brand-600',
            )}
          >
            FINANCE
          </span>
        </span>
      )}
    </span>
  );
}
