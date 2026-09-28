import Script from 'next/script';

/** Identifiant de la balise Google (Google Ads). */
export const GOOGLE_TAG_ID = 'AW-18479820048';

/**
 * Balise Google (gtag.js) chargée sur toutes les pages du site public.
 * Insérée via `next/script` : Next.js place le chargeur dans le <head>
 * et l'initialise dès que la page est interactive.
 */
export function GoogleTag() {
  return (
    <>
      <Script
        id="google-tag-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_TAG_ID}');
        `}
      </Script>
    </>
  );
}
