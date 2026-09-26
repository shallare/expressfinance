import type { Locale } from '../config';
import type { LocaleContent } from './types';
import { en } from './en';
import { hr } from './hr';
import { sl } from './sl';
import { sk } from './sk';
import { el } from './el';
import { nl } from './nl';
import { pt } from './pt';

/** Contenus éditoriaux des langues additionnelles (FR/IT/ES restent dans leurs fichiers d'origine). */
export const extraContent: Partial<Record<Locale, LocaleContent>> = { en, hr, sl, sk, el, nl, pt };

export type { LocaleContent };
