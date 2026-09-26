import { LogoMark } from '@/components/brand/logo';
import { siteConfig } from '@/lib/config/site';

/**
 * Écran de chargement de marque affiché au premier accès de la session.
 *
 * - Rendu côté serveur : visible immédiatement, sans attendre l'hydratation.
 * - Piloté en CSS pur (animation `splash-out`) : disparaît après ~0,9 s même
 *   si le JavaScript n'est pas encore chargé.
 * - Un script inline minuscule ajoute la classe `splash-seen` sur <html>
 *   quand la session a déjà vu l'écran → il n'est alors jamais affiché.
 */
export function SplashScreen() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('ef-splash')){document.documentElement.classList.add('splash-seen')}else{sessionStorage.setItem('ef-splash','1')}}catch(e){}",
        }}
      />
      <div id="ef-splash" aria-hidden="true" className="ef-splash">
        <div className="ef-splash__inner">
          <div className="ef-splash__mark">
            <LogoMark className="h-16 w-16" />
          </div>
          <p className="ef-splash__name">
            <span className="ef-splash__brand">EXPRESS</span>
            <span className="ef-splash__sub">FINANCE</span>
          </p>
          <p className="ef-splash__slogan">{siteConfig.slogan}</p>
          <div className="ef-splash__bar">
            <span />
          </div>
        </div>
      </div>
    </>
  );
}
