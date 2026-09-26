import { PageTransition } from '@/components/layout/page-transition';

/** Un template est remonté à chaque navigation : idéal pour l'animation d'entrée. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
