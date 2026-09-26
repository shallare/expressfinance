/**
 * Témoignages de lancement.
 *
 * Express Finance étant une entreprise récente, ces témoignages illustrent
 * l'expérience type proposée aux clients. Ils sont marqués `isDemo: true`
 * dans le code (aucune mention à l'écran) et sont automatiquement remplacés
 * par les témoignages réels publiés depuis l'espace d'administration
 * (table `testimonials`). À remplacer avant la mise en production publique.
 */
import type { Locale } from '@/i18n/config';
import { extraContent } from '@/i18n/content';

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  loanType: string;
  imageUrl: string | null;
  /** Note de 1 à 5. */
  rating: number;
  /** ISO 8601 */
  date: string;
  location?: string;
  isDemo: boolean;
}

const base = [
  { id: 't1', name: 'Marco R.', location: 'Milano', rating: 5, date: '2026-06-12', imageUrl: null },
  { id: 't2', name: 'Camille D.', location: 'Bruxelles', rating: 5, date: '2026-05-28', imageUrl: null },
  { id: 't3', name: 'Lucía F.', location: 'Valencia', rating: 5, date: '2026-07-03', imageUrl: null },
  { id: 't4', name: 'Antoine M.', location: 'Lyon', rating: 4, date: '2026-04-19', imageUrl: null },
  { id: 't5', name: 'Giulia B.', location: 'Torino', rating: 5, date: '2026-08-08', imageUrl: null },
  { id: 't6', name: 'Karim E.', location: 'Bruxelles', rating: 5, date: '2026-08-21', imageUrl: null },
] as const;

const baseTexts: Record<'fr' | 'it' | 'es', { loanType: string; content: string }[]> = {
  fr: [
    { loanType: 'Financement professionnel', content: 'J’avais besoin de trésorerie rapidement pour honorer une commande importante. Le dossier a été étudié en deux jours et mon conseiller m’a expliqué chaque ligne de l’offre. Aucune surprise.' },
    { loanType: 'Prêt personnel', content: 'Simulation claire, formulaire simple et un vrai suivi par WhatsApp. J’ai apprécié qu’on me dise dès le départ ce qui était possible ou non.' },
    { loanType: 'Crédit immobilier', content: 'Nous avons financé la rénovation de notre appartement. L’équipe a été disponible, précise sur les frais et rapide dans les réponses. Je recommande.' },
    { loanType: 'Crédit à la consommation', content: 'Financement de mon véhicule sans complication. Les mensualités correspondent exactement à la simulation faite sur le site.' },
    { loanType: 'Financement de projet', content: 'Pour lancer mon activité, j’ai eu besoin d’un interlocuteur qui comprenne mon business plan. Écoute, rigueur et réponse rapide : exactement ce qu’il me fallait.' },
    { loanType: 'Prêt personnel', content: 'Processus 100 % en ligne, documents déposés en cinq minutes et réponse le surlendemain. Le taux fixe m’a permis de planifier mon budget sereinement.' },
  ],
  it: [
    { loanType: 'Finanziamento aziendale', content: 'Avevo bisogno di liquidità in tempi rapidi per evadere un ordine importante. La pratica è stata esaminata in due giorni e il mio consulente mi ha spiegato ogni riga dell’offerta. Nessuna sorpresa.' },
    { loanType: 'Prestito personale', content: 'Simulazione chiara, modulo semplice e un’assistenza reale via WhatsApp. Ho apprezzato che mi dicessero fin dall’inizio cosa era possibile e cosa no.' },
    { loanType: 'Mutuo immobiliare', content: 'Abbiamo finanziato la ristrutturazione del nostro appartamento. Il team è stato disponibile, preciso sui costi e rapido nelle risposte. Lo consiglio.' },
    { loanType: 'Credito al consumo', content: 'Ho finanziato la mia auto senza complicazioni. Le rate corrispondono esattamente alla simulazione fatta sul sito.' },
    { loanType: 'Finanziamento di progetto', content: 'Per avviare la mia attività avevo bisogno di un interlocutore che capisse il mio business plan. Ascolto, rigore e risposta rapida: esattamente ciò che mi serviva.' },
    { loanType: 'Prestito personale', content: 'Procedura 100% online, documenti caricati in cinque minuti e risposta dopo due giorni. Il tasso fisso mi ha permesso di pianificare il budget con serenità.' },
  ],
  es: [
    { loanType: 'Financiación empresarial', content: 'Necesitaba liquidez con urgencia para atender un pedido importante. El expediente se estudió en dos días y mi asesor me explicó cada línea de la oferta. Sin sorpresas.' },
    { loanType: 'Préstamo personal', content: 'Simulación clara, formulario sencillo y un seguimiento real por WhatsApp. Agradecí que me dijeran desde el principio qué era posible y qué no.' },
    { loanType: 'Préstamo hipotecario', content: 'Financiamos la reforma de nuestro piso. El equipo estuvo disponible, fue preciso con los gastos y rápido en las respuestas. Lo recomiendo.' },
    { loanType: 'Crédito al consumo', content: 'Financié mi coche sin complicaciones. Las cuotas coinciden exactamente con la simulación que hice en la web.' },
    { loanType: 'Financiación de proyectos', content: 'Para lanzar mi actividad necesitaba un interlocutor que entendiera mi plan de negocio. Escucha, rigor y respuesta rápida: justo lo que necesitaba.' },
    { loanType: 'Préstamo personal', content: 'Proceso 100 % en línea, documentos subidos en cinco minutos y respuesta a los dos días. El tipo fijo me permitió planificar mi presupuesto con tranquilidad.' },
  ],
};

const texts: Record<Locale, { loanType: string; content: string }[]> = {
  ...baseTexts,
  ...(Object.fromEntries(Object.entries(extraContent).map(([l, c]) => [l, c.testimonials])) as Record<Exclude<Locale, 'fr' | 'it' | 'es'>, { loanType: string; content: string }[]>),
};

export function getDemoTestimonials(locale: Locale): Testimonial[] {
  return base.map((b, i) => ({ ...b, ...texts[locale][i], isDemo: true }));
}

/** Compatibilité : liste FR par défaut. */
export const demoTestimonials: Testimonial[] = getDemoTestimonials('fr');
