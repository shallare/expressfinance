'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { buildWhatsappLink } from '@/lib/contact';
import { useLocale } from '@/i18n/provider';

/** Bouton WhatsApp flottant, visible sur tout le site public. */
export function FloatingWhatsapp() {
  const { dict } = useLocale();
  const pathname = usePathname();
  const message = pathname.includes('/demande/confirmation') ? dict.whatsapp.afterApplication : dict.whatsapp.general;

  return (
    <a
      href={buildWhatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.whatsapp.floating}
      style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))', right: 'calc(1.25rem + env(safe-area-inset-right, 0px))' }}
      className="group fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.8)] transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#25D366]/40 motion-safe:animate-pulse-soft motion-reduce:hover:scale-100 lg:h-auto lg:w-auto lg:gap-2 lg:rounded-full lg:px-5 lg:py-3.5"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="hidden text-sm font-semibold lg:inline">WhatsApp</span>
    </a>
  );
}
