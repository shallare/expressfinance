import { fr, type Dictionary } from './dictionaries/fr';
import { it } from './dictionaries/it';
import { es } from './dictionaries/es';
import { en } from './dictionaries/en';
import { hr } from './dictionaries/hr';
import { sl } from './dictionaries/sl';
import { sk } from './dictionaries/sk';
import { el } from './dictionaries/el';
import { nl } from './dictionaries/nl';
import { pt } from './dictionaries/pt';
import type { Locale } from './config';

const dictionaries: Record<Locale, Dictionary> = { fr, it, es, en, hr, sl, sk, el, nl, pt };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? fr;
}

export { t } from './format';

export type { Dictionary };
