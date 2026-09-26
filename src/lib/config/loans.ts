/**
 * ============================================================================
 *  CONFIGURATION CENTRALISÉE DES PRODUITS DE FINANCEMENT
 * ============================================================================
 *  Source unique de vérité pour :
 *    - les bornes générales (montant / durée),
 *    - le modèle de taux d'intérêt (valeur + nature + méthode de calcul),
 *    - les frais éventuels,
 *    - le barème des pénalités de retard,
 *    - la liste des produits (textes français ; traductions dans
 *      `src/i18n/products.ts`).
 *
 *  Ces valeurs servent de **valeurs par défaut** : lorsque Supabase est
 *  configuré, les tables `loan_products` et `simulator_settings` prennent le
 *  relais et peuvent être modifiées depuis l'espace d'administration.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*  Modèle de taux                                                            */
/* -------------------------------------------------------------------------- */

/**
 *  - `annual`  : taux nominal annuel (taux mensuel = taux / 12) ;
 *  - `monthly` : taux mensuel appliqué tel quel à chaque échéance ;
 *  - `total`   : taux forfaitaire appliqué une seule fois sur le capital
 *                (méthode `flat` uniquement).
 */
export type RatePeriod = 'annual' | 'monthly' | 'total';

/**
 *  - `amortizing` : amortissement constant (mensualités constantes, intérêts
 *                   calculés sur le capital restant dû — méthode bancaire) ;
 *  - `flat`       : intérêts calculés sur le capital initial (intérêt simple).
 */
export type RateMethod = 'amortizing' | 'flat';

export interface RateModel {
  /** Valeur du taux en pourcentage (ex. 2 pour 2 %). */
  percent: number;
  period: RatePeriod;
  method: RateMethod;
  /** `true` si la nature du taux reste à valider (affiche un avertissement). */
  isPlaceholder: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Frais                                                                     */
/* -------------------------------------------------------------------------- */

export type FeeKind = 'fixed' | 'percent_of_principal';
export type FeeTiming = 'upfront' | 'monthly';

export interface FeeDefinition {
  id: string;
  label: string;
  kind: FeeKind;
  /** Montant en euros (`fixed`) ou pourcentage du capital (`percent_of_principal`). */
  value: number;
  /** `upfront` : payé une fois à la mise en place ; `monthly` : ajouté à chaque échéance. */
  timing: FeeTiming;
  description?: string;
}

/* -------------------------------------------------------------------------- */
/*  Pénalités de retard                                                       */
/* -------------------------------------------------------------------------- */

export interface PenaltyConfig {
  gracePeriodDays: number;
  fixedFee: number;
  percentOfInstallment: number;
  lateInterestAnnualPercent: number;
  isPlaceholder: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Produits                                                                  */
/* -------------------------------------------------------------------------- */

export interface LoanProduct {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: 'User' | 'Home' | 'ShoppingBag' | 'Briefcase' | 'Rocket' | 'Layers';
  tagline: string;
  description: string;
  longDescription: string;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  defaultDuration: number;
  rate: RateModel;
  fees: FeeDefinition[];
  penalty: PenaltyConfig;
  keyConditions: string[];
  useCases: string[];
  requiredDocuments: string[];
  active: boolean;
  sortOrder: number;
}

/* -------------------------------------------------------------------------- */
/*  Valeurs générales                                                         */
/* -------------------------------------------------------------------------- */

export const loanLimits = {
  minAmount: 3_000,
  maxAmount: 800_000,
  amountStep: 500,
  defaultDuration: 12,
  minDuration: 6,
  /** 50 ans : durée maximale pour les financements les plus importants. */
  maxDuration: 600,
  durationStep: 1,
} as const;

/** Taux nominal annuel fixe de 2 %, amortissement constant (mensualités fixes). */
export const defaultRateModel: RateModel = {
  percent: 2,
  period: 'annual',
  method: 'amortizing',
  isPlaceholder: false,
};

/**
 * Frais intégrés au simulateur : aucun par défaut. Les frais de dossier sont
 * précisés dans l'offre et peuvent être ajoutés depuis l'administration.
 */
export const defaultFees: FeeDefinition[] = [];

/** Barème standard de pénalités de retard (modifiable depuis l'administration). */
export const defaultPenaltyConfig: PenaltyConfig = {
  gracePeriodDays: 5,
  fixedFee: 15,
  percentOfInstallment: 2,
  lateInterestAnnualPercent: 5,
  isPlaceholder: false,
};

/* -------------------------------------------------------------------------- */
/*  Catalogue produits par défaut (textes FR — traductions : src/i18n)        */
/* -------------------------------------------------------------------------- */

const baseProduct = {
  minAmount: loanLimits.minAmount,
  maxAmount: loanLimits.maxAmount,
  rate: defaultRateModel,
  fees: defaultFees,
  penalty: defaultPenaltyConfig,
  active: true,
} as const;

const commonDocuments = [
  'Pièce d’identité en cours de validité (carte d’identité ou passeport)',
  'Justificatif de domicile de moins de 3 mois',
  'Justificatifs de revenus (3 derniers bulletins de salaire ou avis d’imposition)',
];

export const defaultLoanProducts: LoanProduct[] = [
  {
    ...baseProduct,
    id: 'pret-personnel', slug: 'pret-personnel', icon: 'User', sortOrder: 1,
    minDuration: 6, maxDuration: 120, defaultDuration: 12,
    name: 'Prêt personnel', shortName: 'Personnel', tagline: 'Financez vos projets de vie en toute liberté.',
    description: 'Un financement souple et sans affectation obligatoire pour concrétiser vos projets personnels : voyage, mariage, études, imprévus ou trésorerie.',
    longDescription: 'Le prêt personnel Express Finance vous permet d’emprunter une somme définie, remboursable par mensualités fixes sur la durée de votre choix. Vous restez libre de l’utilisation des fonds et bénéficiez d’un accompagnement personnalisé de la demande jusqu’au déblocage.',
    keyConditions: ['Mensualités fixes sur toute la durée', 'Aucune affectation obligatoire des fonds', 'Étude personnalisée de chaque dossier', 'Remboursement anticipé possible selon conditions contractuelles'],
    useCases: ['Trésorerie personnelle', 'Événement familial', 'Études et formation', 'Voyage'],
    requiredDocuments: commonDocuments,
  },
  {
    ...baseProduct,
    id: 'credit-immobilier', slug: 'credit-immobilier', icon: 'Home', sortOrder: 2,
    minDuration: 12, maxDuration: 600, defaultDuration: 240,
    name: 'Crédit immobilier', shortName: 'Immobilier', tagline: 'Donnez vie à votre projet immobilier.',
    description: 'Achat, construction, rénovation ou investissement locatif : une solution de financement immobilier structurée et adaptée à votre situation.',
    longDescription: 'Notre offre de crédit immobilier accompagne l’acquisition d’une résidence principale ou secondaire, la construction, la rénovation ou l’investissement locatif. Chaque dossier fait l’objet d’une analyse approfondie afin de proposer un plan de financement cohérent avec votre capacité de remboursement.',
    keyConditions: ['Financement de l’achat, de la construction ou de la rénovation', 'Durées longues possibles selon le projet', 'Analyse détaillée du plan de financement', 'Garanties définies lors de l’étude du dossier'],
    useCases: ['Résidence principale', 'Investissement locatif', 'Rénovation', 'Construction'],
    requiredDocuments: [...commonDocuments, 'Compromis de vente, devis ou descriptif du projet immobilier'],
  },
  {
    ...baseProduct,
    id: 'credit-consommation', slug: 'credit-consommation', icon: 'ShoppingBag', sortOrder: 3,
    minDuration: 6, maxDuration: 84, defaultDuration: 12,
    name: 'Crédit à la consommation', shortName: 'Consommation', tagline: 'Équipez-vous sans attendre.',
    description: 'Véhicule, équipement, électroménager, travaux : un financement dédié à l’achat d’un bien ou d’un service précis.',
    longDescription: 'Le crédit à la consommation finance un achat identifié — véhicule, mobilier, équipement, travaux d’aménagement. Le montant et la durée sont ajustés à la valeur du bien et à votre budget mensuel.',
    keyConditions: ['Financement affecté à un achat identifié', 'Mensualités adaptées à votre budget', 'Justificatif d’achat (devis ou facture) demandé', 'Conditions définitives fixées après étude du dossier'],
    useCases: ['Véhicule', 'Travaux d’aménagement', 'Équipement', 'Mobilier'],
    requiredDocuments: [...commonDocuments, 'Devis ou bon de commande du bien financé'],
  },
  {
    ...baseProduct,
    id: 'financement-professionnel', slug: 'financement-professionnel', icon: 'Briefcase', sortOrder: 4,
    minDuration: 6, maxDuration: 360, defaultDuration: 36,
    name: 'Financement professionnel', shortName: 'Professionnel', tagline: 'Soutenez la croissance de votre entreprise.',
    description: 'Trésorerie, investissement, matériel, développement commercial : des solutions de financement pour les indépendants, TPE et PME.',
    longDescription: 'Express Finance accompagne les entrepreneurs, indépendants et sociétés dans leurs besoins de financement : renforcement de trésorerie, acquisition de matériel, développement de l’activité ou reprise d’entreprise. Le dossier est étudié sur la base des éléments financiers de l’entreprise.',
    keyConditions: ['Ouvert aux indépendants, TPE et PME', 'Financement de trésorerie ou d’investissement', 'Analyse des documents financiers de l’entreprise', 'Plan de remboursement adapté au cycle d’activité'],
    useCases: ['Trésorerie', 'Matériel et équipement', 'Développement commercial', 'Reprise d’activité'],
    requiredDocuments: ['Pièce d’identité du dirigeant', 'Extrait d’immatriculation de l’entreprise (BCE / Kbis ou équivalent)', 'Derniers bilans ou comptes annuels', 'Relevés bancaires professionnels récents'],
  },
  {
    ...baseProduct,
    id: 'financement-de-projet', slug: 'financement-de-projet', icon: 'Rocket', sortOrder: 5,
    minDuration: 12, maxDuration: 600, defaultDuration: 60,
    name: 'Financement de projet', shortName: 'Projet', tagline: 'Transformez une idée en réalisation concrète.',
    description: 'Lancement d’activité, projet innovant, agricole, immobilier ou industriel : un financement structuré autour de votre plan de projet.',
    longDescription: 'Le financement de projet s’adresse aux porteurs de projets structurés disposant d’un plan clair : création d’activité, développement d’un produit, projet agricole, énergétique ou industriel. L’étude porte sur la viabilité du projet, son calendrier et sa capacité à générer les flux de remboursement.',
    keyConditions: ['Dossier de présentation du projet requis', 'Étude de la viabilité et du calendrier', 'Financement pouvant être échelonné selon les phases', 'Accompagnement dédié tout au long de l’instruction'],
    useCases: ['Création d’activité', 'Projet agricole', 'Projet énergétique', 'Développement produit'],
    requiredDocuments: ['Pièce d’identité du porteur de projet', 'Dossier de présentation / business plan', 'Prévisionnel financier', 'Justificatifs d’apport éventuel'],
  },
  {
    ...baseProduct,
    id: 'autres-solutions', slug: 'autres-solutions', icon: 'Layers', sortOrder: 6,
    minDuration: 6, maxDuration: 600, defaultDuration: 24,
    name: 'Autres solutions de financement', shortName: 'Sur mesure', tagline: 'Un besoin particulier ? Parlons-en.',
    description: 'Rachat de crédit, financement d’études, situation atypique : nous étudions les demandes qui ne rentrent pas dans les catégories classiques.',
    longDescription: 'Certaines situations nécessitent une approche sur mesure : regroupement de crédits, financement d’un cursus, besoin ponctuel ou projet atypique. Décrivez-nous votre besoin, notre équipe étudie la faisabilité d’une solution adaptée.',
    keyConditions: ['Étude au cas par cas', 'Solution construite autour de votre situation', 'Transparence totale sur les conditions proposées', 'Réponse personnalisée après analyse'],
    useCases: ['Regroupement de crédits', 'Financement d’études', 'Besoin ponctuel', 'Projet atypique'],
    requiredDocuments: commonDocuments,
  },
];

/* -------------------------------------------------------------------------- */
/*  Statuts de demande                                                        */
/* -------------------------------------------------------------------------- */

export const applicationStatuses = [
  'pending',
  'under_review',
  'additional_information_required',
  'approved',
  'rejected',
  'completed',
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: 'En attente',
  under_review: 'En cours d’étude',
  additional_information_required: 'Informations complémentaires requises',
  approved: 'Approuvée',
  rejected: 'Refusée',
  completed: 'Finalisée',
};

/* -------------------------------------------------------------------------- */
/*  Types de documents acceptés dans le formulaire de demande                 */
/* -------------------------------------------------------------------------- */

export interface DocumentTypeDefinition {
  id: 'identity' | 'proof_of_address' | 'proof_of_income';
  required: boolean;
  maxFiles: number;
}

export const documentTypes: DocumentTypeDefinition[] = [
  { id: 'identity', required: true, maxFiles: 2 },
  { id: 'proof_of_address', required: false, maxFiles: 1 },
  { id: 'proof_of_income', required: false, maxFiles: 3 },
];

/** Libellés français des documents (utilisés côté admin et API). */
export const documentTypeLabelsFr: Record<DocumentTypeDefinition['id'], string> = {
  identity: 'Pièce d’identité',
  proof_of_address: 'Justificatif de domicile',
  proof_of_income: 'Justificatif de revenus',
};

export const uploadPolicy = {
  acceptedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'] as const,
  acceptedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'] as const,
  maxFileSizeBytes: 5 * 1024 * 1024,
  maxTotalSizeBytes: 12 * 1024 * 1024,
  maxFilesPerApplication: 6,
} as const;
