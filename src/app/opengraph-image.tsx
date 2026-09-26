import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config/site';

export const runtime = 'edge';
export const alt = `${siteConfig.name} — ${siteConfig.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Image Open Graph générée dynamiquement (partages réseaux sociaux / messageries). */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #081e20 0%, #0d2c2e 55%, #1a7276 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #29adb2, #0d2c2e)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 6,
              padding: 14,
            }}
          >
            <div style={{ width: 10, height: 18, borderRadius: 3, background: 'rgba(255,255,255,0.55)' }} />
            <div style={{ width: 10, height: 30, borderRadius: 3, background: 'rgba(255,255,255,0.8)' }} />
            <div style={{ width: 10, height: 44, borderRadius: 3, background: '#a3c9a8' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>EXPRESS</span>
            <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: 8, color: '#a3c9a8' }}>FINANCE</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <span style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 }}>{siteConfig.slogan}</span>
          <span style={{ fontSize: 28, color: 'rgba(217,225,245,0.85)' }}>
            Prêt personnel · Crédit immobilier · Financement professionnel · Simulation en ligne
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: 'rgba(217,225,245,0.7)' }}>
          <span>{siteConfig.url.replace(/^https?:\/\//, '')}</span>
          <span>De 3 000 € à 800 000 €</span>
        </div>
      </div>
    ),
    size,
  );
}
