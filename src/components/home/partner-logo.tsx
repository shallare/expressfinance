import Image from 'next/image';
import type { Partner } from '@/data/partners';

/** Monogrammes vectoriels génériques (aucune marque réelle). */
function Mark({ style, color }: { style: NonNullable<Partner['style']>; color: string }) {
  const common = { width: 28, height: 28, viewBox: '0 0 28 28', 'aria-hidden': true as const };
  switch (style) {
    case 'shield':
      return (
        <svg {...common}>
          <path d="M14 2 4 6v7c0 6 4.3 10.4 10 13 5.7-2.6 10-7 10-13V6l-10-4Z" fill={color} />
          <path d="M9.5 14.5 12.5 17.5 18.5 11" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'circle':
      return (
        <svg {...common}>
          <circle cx="14" cy="14" r="12" fill={color} />
          <circle cx="14" cy="14" r="5.5" fill="none" stroke="#fff" strokeWidth="2.4" />
        </svg>
      );
    case 'bars':
      return (
        <svg {...common}>
          <rect x="3" y="14" width="5" height="11" rx="1.5" fill={color} opacity="0.5" />
          <rect x="11.5" y="8" width="5" height="17" rx="1.5" fill={color} opacity="0.75" />
          <rect x="20" y="3" width="5" height="22" rx="1.5" fill={color} />
        </svg>
      );
    case 'wave':
      return (
        <svg {...common}>
          <circle cx="14" cy="14" r="12" fill={color} />
          <path d="M5 16c2.5-3 5-3 7.5 0s5 3 7.5 0 3-2 3-2" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M5 11c2.5-3 5-3 7.5 0s5 3 7.5 0" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case 'hex':
      return (
        <svg {...common}>
          <path d="M14 2 24.4 8v12L14 26 3.6 20V8L14 2Z" fill={color} />
          <path d="M14 8v12M9 11l10 6M19 11 9 17" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="14" cy="14" r="12" fill={color} />
          <ellipse cx="14" cy="14" rx="5" ry="12" fill="none" stroke="#fff" strokeWidth="1.6" />
          <path d="M2 14h24M4.5 8.5h19M4.5 19.5h19" stroke="#fff" strokeWidth="1.6" />
        </svg>
      );
    case 'arc':
      return (
        <svg {...common}>
          <path d="M3 22 14 4l11 18" stroke={color} strokeWidth="3.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M8.5 22 14 13l5.5 9" stroke={color} strokeWidth="3.5" fill="none" strokeLinejoin="round" opacity="0.5" />
        </svg>
      );
    case 'diamond':
    default:
      return (
        <svg {...common}>
          <path d="M14 2 26 14 14 26 2 14 14 2Z" fill={color} />
          <path d="M14 8v12M8 14h12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
}

export function PartnerLogo({ partner }: { partner: Partner }) {
  const box = 'flex h-16 w-48 shrink-0 items-center justify-center rounded-xl border border-line bg-white px-4 shadow-xs';

  const content = partner.logoUrl ? (
    <Image src={partner.logoUrl} alt={partner.name} width={160} height={56} className="h-10 w-auto object-contain" />
  ) : (
    <span className="inline-flex items-center gap-2.5">
      <Mark style={partner.style ?? 'diamond'} color={partner.color ?? '#334155'} />
      <span className="font-display text-[0.95rem] font-semibold tracking-tight text-slate-700">{partner.name}</span>
    </span>
  );

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noopener noreferrer" className={box} aria-label={partner.name}>
        {content}
      </a>
    );
  }
  return <div className={box}>{content}</div>;
}
