import { Lexend, Poppins } from 'next/font/google';

/** Police principale (texte, boutons, formulaires). */
export const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

/** Police secondaire (titres, chiffres clés). */
export const lexend = Lexend({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-lexend',
  display: 'swap',
});

export const fontClassName = `${poppins.variable} ${lexend.variable}`;
