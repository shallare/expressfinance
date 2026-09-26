import type { Locale } from './config';
import type { LoanProduct } from '@/lib/config/loans';
import { extraContent } from './content';

export interface ProductTexts {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  longDescription: string;
  keyConditions: string[];
  useCases: string[];
  requiredDocuments: string[];
}

const commonDocs: Record<'fr' | 'it' | 'es', string[]> = {
  fr: ['Pièce d’identité en cours de validité (carte d’identité ou passeport)', 'Justificatif de domicile de moins de 3 mois', 'Justificatifs de revenus (3 derniers bulletins de salaire ou avis d’imposition)'],
  it: ['Documento d’identità in corso di validità (carta d’identità o passaporto)', 'Prova di residenza risalente a meno di 3 mesi', 'Documentazione reddituale (ultime 3 buste paga o dichiarazione dei redditi)'],
  es: ['Documento de identidad en vigor (DNI o pasaporte)', 'Justificante de domicilio de menos de 3 meses', 'Justificantes de ingresos (3 últimas nóminas o declaración de la renta)'],
};

const baseProductTexts: Record<'fr' | 'it' | 'es', Record<string, ProductTexts>> = {
  fr: {
    'pret-personnel': {
      name: 'Prêt personnel', shortName: 'Personnel', tagline: 'Financez vos projets de vie en toute liberté.',
      description: 'Un financement souple et sans affectation obligatoire pour concrétiser vos projets personnels : voyage, mariage, études, imprévus ou trésorerie.',
      longDescription: 'Le prêt personnel Express Finance vous permet d’emprunter une somme définie, remboursable par mensualités fixes sur la durée de votre choix. Vous restez libre de l’utilisation des fonds et bénéficiez d’un accompagnement personnalisé de la demande jusqu’au déblocage.',
      keyConditions: ['Mensualités fixes sur toute la durée', 'Aucune affectation obligatoire des fonds', 'Étude personnalisée de chaque dossier', 'Remboursement anticipé possible selon conditions contractuelles'],
      useCases: ['Trésorerie personnelle', 'Événement familial', 'Études et formation', 'Voyage'],
      requiredDocuments: commonDocs.fr,
    },
    'credit-immobilier': {
      name: 'Crédit immobilier', shortName: 'Immobilier', tagline: 'Donnez vie à votre projet immobilier.',
      description: 'Achat, construction, rénovation ou investissement locatif : une solution de financement immobilier structurée et adaptée à votre situation.',
      longDescription: 'Notre offre de crédit immobilier accompagne l’acquisition d’une résidence principale ou secondaire, la construction, la rénovation ou l’investissement locatif. Chaque dossier fait l’objet d’une analyse approfondie afin de proposer un plan de financement cohérent avec votre capacité de remboursement.',
      keyConditions: ['Financement de l’achat, de la construction ou de la rénovation', 'Durées longues possibles selon le projet', 'Analyse détaillée du plan de financement', 'Garanties définies lors de l’étude du dossier'],
      useCases: ['Résidence principale', 'Investissement locatif', 'Rénovation', 'Construction'],
      requiredDocuments: [...commonDocs.fr, 'Compromis de vente, devis ou descriptif du projet immobilier'],
    },
    'credit-consommation': {
      name: 'Crédit à la consommation', shortName: 'Consommation', tagline: 'Équipez-vous sans attendre.',
      description: 'Véhicule, équipement, électroménager, travaux : un financement dédié à l’achat d’un bien ou d’un service précis.',
      longDescription: 'Le crédit à la consommation finance un achat identifié — véhicule, mobilier, équipement, travaux d’aménagement. Le montant et la durée sont ajustés à la valeur du bien et à votre budget mensuel.',
      keyConditions: ['Financement affecté à un achat identifié', 'Mensualités adaptées à votre budget', 'Justificatif d’achat (devis ou facture) demandé', 'Conditions définitives fixées après étude du dossier'],
      useCases: ['Véhicule', 'Travaux d’aménagement', 'Équipement', 'Mobilier'],
      requiredDocuments: [...commonDocs.fr, 'Devis ou bon de commande du bien financé'],
    },
    'financement-professionnel': {
      name: 'Financement professionnel', shortName: 'Professionnel', tagline: 'Soutenez la croissance de votre entreprise.',
      description: 'Trésorerie, investissement, matériel, développement commercial : des solutions de financement pour les indépendants, TPE et PME.',
      longDescription: 'Express Finance accompagne les entrepreneurs, indépendants et sociétés dans leurs besoins de financement : renforcement de trésorerie, acquisition de matériel, développement de l’activité ou reprise d’entreprise. Le dossier est étudié sur la base des éléments financiers de l’entreprise.',
      keyConditions: ['Ouvert aux indépendants, TPE et PME', 'Financement de trésorerie ou d’investissement', 'Analyse des documents financiers de l’entreprise', 'Plan de remboursement adapté au cycle d’activité'],
      useCases: ['Trésorerie', 'Matériel et équipement', 'Développement commercial', 'Reprise d’activité'],
      requiredDocuments: ['Pièce d’identité du dirigeant', 'Extrait d’immatriculation de l’entreprise (BCE / Kbis ou équivalent)', 'Derniers bilans ou comptes annuels', 'Relevés bancaires professionnels récents'],
    },
    'financement-de-projet': {
      name: 'Financement de projet', shortName: 'Projet', tagline: 'Transformez une idée en réalisation concrète.',
      description: 'Lancement d’activité, projet innovant, agricole, immobilier ou industriel : un financement structuré autour de votre plan de projet.',
      longDescription: 'Le financement de projet s’adresse aux porteurs de projets structurés disposant d’un plan clair : création d’activité, développement d’un produit, projet agricole, énergétique ou industriel. L’étude porte sur la viabilité du projet, son calendrier et sa capacité à générer les flux de remboursement.',
      keyConditions: ['Dossier de présentation du projet requis', 'Étude de la viabilité et du calendrier', 'Financement pouvant être échelonné selon les phases', 'Accompagnement dédié tout au long de l’instruction'],
      useCases: ['Création d’activité', 'Projet agricole', 'Projet énergétique', 'Développement produit'],
      requiredDocuments: ['Pièce d’identité du porteur de projet', 'Dossier de présentation / business plan', 'Prévisionnel financier', 'Justificatifs d’apport éventuel'],
    },
    'autres-solutions': {
      name: 'Autres solutions de financement', shortName: 'Sur mesure', tagline: 'Un besoin particulier ? Parlons-en.',
      description: 'Rachat de crédit, financement d’études, situation atypique : nous étudions les demandes qui ne rentrent pas dans les catégories classiques.',
      longDescription: 'Certaines situations nécessitent une approche sur mesure : regroupement de crédits, financement d’un cursus, besoin ponctuel ou projet atypique. Décrivez-nous votre besoin, notre équipe étudie la faisabilité d’une solution adaptée.',
      keyConditions: ['Étude au cas par cas', 'Solution construite autour de votre situation', 'Transparence totale sur les conditions proposées', 'Réponse personnalisée après analyse'],
      useCases: ['Regroupement de crédits', 'Financement d’études', 'Besoin ponctuel', 'Projet atypique'],
      requiredDocuments: commonDocs.fr,
    },
  },
  it: {
    'pret-personnel': {
      name: 'Prestito personale', shortName: 'Personale', tagline: 'Realizza i tuoi progetti in piena libertà.',
      description: 'Un finanziamento flessibile e non finalizzato per realizzare i tuoi progetti personali: viaggi, matrimonio, studi, imprevisti o liquidità.',
      longDescription: 'Il prestito personale Express Finance ti permette di ottenere una somma definita, rimborsabile con rate mensili fisse nella durata che preferisci. Sei libero di utilizzare i fondi come desideri e hai un consulente dedicato dalla richiesta all’erogazione.',
      keyConditions: ['Rate fisse per tutta la durata', 'Nessun vincolo di destinazione dei fondi', 'Esame personalizzato di ogni pratica', 'Estinzione anticipata possibile secondo le condizioni contrattuali'],
      useCases: ['Liquidità personale', 'Evento familiare', 'Studi e formazione', 'Viaggi'],
      requiredDocuments: commonDocs.it,
    },
    'credit-immobilier': {
      name: 'Mutuo immobiliare', shortName: 'Immobiliare', tagline: 'Dai vita al tuo progetto immobiliare.',
      description: 'Acquisto, costruzione, ristrutturazione o investimento immobiliare: una soluzione di finanziamento strutturata e adatta alla tua situazione.',
      longDescription: 'Il nostro mutuo immobiliare finanzia l’acquisto di una prima o seconda casa, la costruzione, la ristrutturazione o l’acquisto di un immobile da mettere a reddito. Ogni pratica è oggetto di un’analisi approfondita per proporre un piano di finanziamento coerente con la tua capacità di rimborso.',
      keyConditions: ['Finanziamento di acquisto, costruzione o ristrutturazione', 'Durate lunghe possibili in base al progetto', 'Analisi dettagliata del piano di finanziamento', 'Garanzie definite in fase di esame della pratica'],
      useCases: ['Prima casa', 'Immobile a reddito', 'Ristrutturazione', 'Costruzione'],
      requiredDocuments: [...commonDocs.it, 'Contratto preliminare (compromesso), preventivo o descrizione del progetto immobiliare'],
    },
    'credit-consommation': {
      name: 'Credito al consumo', shortName: 'Consumo', tagline: 'Acquista subito ciò che ti serve.',
      description: 'Veicolo, attrezzature, elettrodomestici, lavori: un finanziamento dedicato all’acquisto di un bene o servizio specifico.',
      longDescription: 'Il credito al consumo finanzia un acquisto specifico: veicolo, arredamento, attrezzature, lavori di ristrutturazione. Importo e durata vengono calibrati sul valore del bene e sul tuo budget mensile.',
      keyConditions: ['Finanziamento finalizzato a un acquisto specifico', 'Rate su misura per il tuo budget', 'Richiesto un giustificativo d’acquisto (preventivo o fattura)', 'Condizioni definitive fissate dopo l’esame della pratica'],
      useCases: ['Veicolo', 'Lavori di ristrutturazione', 'Attrezzature', 'Arredamento'],
      requiredDocuments: [...commonDocs.it, 'Preventivo o ordine d’acquisto del bene finanziato'],
    },
    'financement-professionnel': {
      name: 'Finanziamento aziendale', shortName: 'Aziendale', tagline: 'Sostieni la crescita della tua impresa.',
      description: 'Liquidità, investimenti, attrezzature, sviluppo commerciale: soluzioni di finanziamento per autonomi, microimprese e PMI.',
      longDescription: 'Express Finance affianca imprenditori, autonomi e società nelle loro esigenze di finanziamento: rafforzamento della liquidità, acquisto di attrezzature, sviluppo dell’attività o acquisizione di un’impresa. La pratica viene esaminata sulla base dei dati finanziari dell’azienda.',
      keyConditions: ['Aperto ad autonomi, microimprese e PMI', 'Finanziamento di liquidità o investimenti', 'Analisi dei documenti finanziari dell’impresa', 'Piano di rimborso adattato al ciclo dell’attività'],
      useCases: ['Liquidità', 'Macchinari e attrezzature', 'Sviluppo commerciale', 'Acquisizione di un’attività'],
      requiredDocuments: ['Documento d’identità del legale rappresentante', 'Visura camerale o documento equivalente', 'Ultimi bilanci o conti annuali', 'Estratti conto aziendali recenti'],
    },
    'financement-de-projet': {
      name: 'Finanziamento di progetto', shortName: 'Progetto', tagline: 'Trasforma un’idea in una realizzazione concreta.',
      description: 'Avvio di attività, progetto innovativo, agricolo, immobiliare o industriale: un finanziamento strutturato attorno al tuo piano di progetto.',
      longDescription: 'Il finanziamento di progetto si rivolge a chi porta avanti progetti strutturati con un piano chiaro: avvio di un’attività, sviluppo di un prodotto, progetto agricolo, energetico o industriale. L’esame riguarda la fattibilità del progetto, le sue tempistiche e la capacità di generare i flussi di cassa necessari al rimborso.',
      keyConditions: ['Richiesto un dossier di presentazione del progetto', 'Esame di fattibilità e tempistiche', 'Finanziamento erogabile a tranche in base alle fasi', 'Consulente dedicato durante tutta l’istruttoria'],
      useCases: ['Avvio di un’attività', 'Progetto agricolo', 'Progetto energetico', 'Sviluppo di un prodotto'],
      requiredDocuments: ['Documento d’identità del promotore', 'Dossier di presentazione / business plan', 'Piano finanziario previsionale', 'Documentazione dell’eventuale apporto di capitale proprio'],
    },
    'autres-solutions': {
      name: 'Altre soluzioni di finanziamento', shortName: 'Su misura', tagline: 'Un’esigenza particolare? Parliamone.',
      description: 'Consolidamento debiti, finanziamento studi, situazione atipica: esaminiamo le richieste che non rientrano nelle categorie classiche.',
      longDescription: 'Alcune situazioni richiedono un approccio su misura: consolidamento di prestiti, finanziamento di un percorso di studi, esigenza occasionale o progetto atipico. Descrivici la tua esigenza: il nostro team valuterà la fattibilità di una soluzione adatta.',
      keyConditions: ['Esame caso per caso', 'Soluzione costruita attorno alla tua situazione', 'Trasparenza totale sulle condizioni proposte', 'Risposta personalizzata dopo l’analisi'],
      useCases: ['Consolidamento debiti', 'Finanziamento studi', 'Esigenza occasionale', 'Progetto atipico'],
      requiredDocuments: commonDocs.it,
    },
  },
  es: {
    'pret-personnel': {
      name: 'Préstamo personal', shortName: 'Personal', tagline: 'Financie sus proyectos personales con total libertad.',
      description: 'Una financiación flexible, sin necesidad de justificar el destino de los fondos, para hacer realidad sus proyectos: un viaje, una boda, estudios, imprevistos o liquidez.',
      longDescription: 'El préstamo personal Express Finance le permite obtener un importe determinado que devolverá en cuotas mensuales fijas durante el plazo que elija. Usted decide en qué emplea los fondos y cuenta con un acompañamiento personalizado desde la solicitud hasta el desembolso.',
      keyConditions: ['Cuotas fijas durante todo el plazo', 'Libre disposición de los fondos', 'Estudio personalizado de cada expediente', 'Posibilidad de amortización anticipada según las condiciones del contrato'],
      useCases: ['Liquidez personal', 'Evento familiar', 'Estudios y formación', 'Viajes'],
      requiredDocuments: commonDocs.es,
    },
    'credit-immobilier': {
      name: 'Préstamo hipotecario', shortName: 'Hipotecario', tagline: 'Dé vida a su proyecto inmobiliario.',
      description: 'Compra, construcción, reforma o compra para alquilar: una solución de financiación inmobiliaria estructurada y adaptada a su situación.',
      longDescription: 'Nuestra oferta hipotecaria cubre la compra de una vivienda habitual o de una segunda residencia, la construcción, la reforma o la compra para alquilar. Cada expediente se analiza en profundidad para proponer un plan de financiación coherente con su capacidad de reembolso.',
      keyConditions: ['Financiación de compra, construcción o reforma', 'Plazos largos posibles según el proyecto', 'Análisis detallado del plan de financiación', 'Garantías definidas durante el estudio del expediente'],
      useCases: ['Vivienda habitual', 'Compra para alquilar', 'Reforma', 'Construcción'],
      requiredDocuments: [...commonDocs.es, 'Contrato de arras, presupuesto o descripción del proyecto inmobiliario'],
    },
    'credit-consommation': {
      name: 'Crédito al consumo', shortName: 'Consumo', tagline: 'Equípese sin esperar.',
      description: 'Vehículo, equipamiento, electrodomésticos, obras: una financiación destinada a la compra de un bien o servicio concreto.',
      longDescription: 'El crédito al consumo financia una compra concreta: vehículo, mobiliario, equipamiento u obras de acondicionamiento. El importe y el plazo se ajustan al valor del bien y a su presupuesto mensual.',
      keyConditions: ['Financiación vinculada a una compra concreta', 'Cuotas adaptadas a su presupuesto', 'Se requiere un justificante de la compra (presupuesto o factura)', 'Condiciones definitivas fijadas tras el estudio del expediente'],
      useCases: ['Vehículo', 'Obras de acondicionamiento', 'Equipamiento', 'Mobiliario'],
      requiredDocuments: [...commonDocs.es, 'Presupuesto o pedido del bien financiado'],
    },
    'financement-professionnel': {
      name: 'Financiación empresarial', shortName: 'Empresarial', tagline: 'Impulse el crecimiento de su empresa.',
      description: 'Tesorería, inversión, maquinaria, desarrollo comercial: soluciones de financiación para autónomos, microempresas y pymes.',
      longDescription: 'Express Finance acompaña a emprendedores, autónomos y sociedades en sus necesidades de financiación: refuerzo de tesorería, adquisición de maquinaria, desarrollo de la actividad o traspaso de empresa. El expediente se estudia a partir de la información financiera de la empresa.',
      keyConditions: ['Abierto a autónomos, microempresas y pymes', 'Financiación de tesorería o de inversión', 'Análisis de los documentos financieros de la empresa', 'Plan de reembolso adaptado al ciclo de actividad'],
      useCases: ['Tesorería', 'Maquinaria y equipamiento', 'Desarrollo comercial', 'Traspaso de negocio'],
      requiredDocuments: ['Documento de identidad del administrador', 'Certificado del Registro Mercantil o documento equivalente', 'Últimos balances o cuentas anuales', 'Extractos bancarios recientes de la empresa'],
    },
    'financement-de-projet': {
      name: 'Financiación de proyectos', shortName: 'Proyecto', tagline: 'Convierta una idea en un proyecto real.',
      description: 'Puesta en marcha de una actividad, proyecto innovador, agrícola, inmobiliario o industrial: una financiación estructurada en torno a su plan de negocio.',
      longDescription: 'La financiación de proyectos se dirige a promotores con un proyecto estructurado y un plan claro: creación de una actividad, desarrollo de un producto, proyecto agrícola, energético o industrial. El estudio analiza la viabilidad del proyecto, su calendario y su capacidad para generar los flujos necesarios para el reembolso.',
      keyConditions: ['Se requiere un dosier de presentación del proyecto', 'Estudio de viabilidad y calendario', 'Posibilidad de financiación escalonada por fases', 'Acompañamiento personalizado durante toda la tramitación'],
      useCases: ['Creación de una actividad', 'Proyecto agrícola', 'Proyecto energético', 'Desarrollo de producto'],
      requiredDocuments: ['Documento de identidad del promotor', 'Dosier de presentación o plan de negocio', 'Previsiones financieras', 'Justificantes de la aportación propia, en su caso'],
    },
    'autres-solutions': {
      name: 'Otras soluciones de financiación', shortName: 'A medida', tagline: '¿Una necesidad particular? Hablemos.',
      description: 'Reunificación de deudas, financiación de estudios, situación atípica: estudiamos las solicitudes que no encajan en las categorías habituales.',
      longDescription: 'Algunas situaciones requieren un enfoque a medida: reunificación de préstamos, financiación de estudios, necesidad puntual o proyecto atípico. Cuéntenos qué necesita y nuestro equipo estudiará la viabilidad de una solución adaptada.',
      keyConditions: ['Estudio caso por caso', 'Solución diseñada en función de su situación', 'Transparencia total sobre las condiciones propuestas', 'Respuesta personalizada tras el análisis'],
      useCases: ['Reunificación de deudas', 'Financiación de estudios', 'Necesidad puntual', 'Proyecto atípico'],
      requiredDocuments: commonDocs.es,
    },
  },
};

export const productTexts: Record<Locale, Record<string, ProductTexts>> = {
  ...baseProductTexts,
  ...(Object.fromEntries(Object.entries(extraContent).map(([l, c]) => [l, c.products])) as Record<Exclude<Locale, 'fr' | 'it' | 'es'>, Record<string, ProductTexts>>),
};

/** Applique les textes traduits à un produit (les produits inconnus gardent leurs textes d'origine). */
export function localizeProduct(product: LoanProduct, locale: Locale): LoanProduct {
  const texts = productTexts[locale]?.[product.slug];
  if (!texts || locale === 'fr') return product;
  return { ...product, ...texts };
}

export function localizeProducts(products: LoanProduct[], locale: Locale): LoanProduct[] {
  return products.map((p) => localizeProduct(p, locale));
}
