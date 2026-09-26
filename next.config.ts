import type { NextConfig } from 'next';

/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 *
 * La Content-Security-Policy est volontairement stricte : aucune ressource
 * externe n'est requise par l'application, exception faite de Google Fonts
 * (auto-hébergées par `next/font`, donc servies depuis notre propre domaine)
 * et de l'API Supabase appelée en `fetch`.
 */
const SUPABASE_ORIGIN = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return '';
  try {
    const { origin } = new URL(url);
    return `${origin} ${origin.replace('https://', 'wss://')}`;
  } catch {
    return '';
  }
})();

// Cloudflare Turnstile (anti-robot) n'est autorisé que si une clé est configurée.
const TURNSTILE_ORIGIN = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? 'https://challenges.cloudflare.com' : '';

const contentSecurityPolicy = [
  "default-src 'self'",
  // `unsafe-inline` reste nécessaire pour les styles générés par Next.js.
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  // Next.js injecte des scripts inline pour l'hydratation.
  `${process.env.NODE_ENV === 'production' ? "script-src 'self' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'"} ${TURNSTILE_ORIGIN}`.trim(),
  `connect-src 'self' ${SUPABASE_ORIGIN} ${TURNSTILE_ORIGIN}`.replace(/\s+/g, ' ').trim(),
  `frame-src ${TURNSTILE_ORIGIN || "'none'"}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Build autonome (dossier .next/standalone) pour un déploiement Docker / VPS.
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Les images de témoignages / partenaires peuvent être servies depuis
      // Supabase Storage (bucket public) une fois le projet configuré.
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [
            {
              protocol: 'https' as const,
              hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
    ],
  },
  experimental: {
    // Limite la taille des payloads acceptés par les Server Actions.
    serverActions: { bodySizeLimit: '12mb' },
    // Imports allégés : seules les icônes / fonctions utilisées sont embarquées.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // L'espace d'administration ne doit jamais être indexé.
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
  },
};

export default nextConfig;
