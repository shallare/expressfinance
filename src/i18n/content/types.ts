import type { ProductTexts } from '../products';
import type { FaqItem } from '../faq';
import type { LegalDocument, LegalPageKey } from '../legal';

/** Contenu éditorial d'une langue (produits, FAQ, témoignages, textes légaux). */
export interface LocaleContent {
  products: Record<string, ProductTexts>;
  faq: FaqItem[];
  testimonials: { loanType: string; content: string }[];
  legal: Record<LegalPageKey, LegalDocument>;
}
