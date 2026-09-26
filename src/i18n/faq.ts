import type { Locale } from './config';
import { loanLimits } from '@/lib/config/loans';
import { extraContent } from './content';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const min = loanLimits.minAmount;
const max = loanLimits.maxAmount;

const baseFaq: Record<'fr' | 'it' | 'es', FaqItem[]> = {
  fr: [
    { id: 'montants', question: 'Quels montants puis-je demander ?', answer: `Les demandes de financement sont étudiées pour des montants compris entre ${min.toLocaleString('fr-BE')} € et ${max.toLocaleString('fr-BE')} €, selon le type de financement et votre situation. Le montant accordé dépend toujours de l’analyse de votre dossier.` },
    { id: 'taux', question: 'Quel est le taux appliqué ?', answer: 'Express Finance applique un taux d’intérêt nominal annuel fixe de 2 %, avec des mensualités constantes sur toute la durée du prêt. Les modalités exactes (durée, frais éventuels) vous sont confirmées dans l’offre remise après étude de votre dossier.' },
    { id: 'frais', question: 'Y a-t-il des frais en plus des intérêts ?', answer: 'Des frais de dossier peuvent s’appliquer selon le type de financement et le cadre légal et contractuel applicable. Ils vous sont systématiquement communiqués par écrit avant toute signature : aucun frais caché, aucun paiement exigé avant la remise de l’offre.' },
    { id: 'delai', question: 'Combien de temps prend l’étude d’une demande ?', answer: 'Dès réception de votre dossier complet, un conseiller vous apporte une réponse de principe sous 48 heures ouvrées. Le délai de mise à disposition des fonds dépend ensuite du type de financement et de la signature de l’offre.' },
    { id: 'documents', question: 'Quels documents dois-je fournir ?', answer: 'En général : une pièce d’identité en cours de validité, un justificatif de domicile récent et des justificatifs de revenus. Des documents complémentaires peuvent être demandés selon le projet (devis, compromis, bilans pour les entreprises).' },
    { id: 'garantie', question: 'Ma demande est-elle automatiquement acceptée ?', answer: 'Non. Chaque demande fait l’objet d’une étude individuelle. Express Finance se réserve le droit d’accepter ou de refuser une demande après analyse de la situation du demandeur et de la faisabilité du projet.' },
    { id: 'international', question: 'Puis-je faire une demande depuis un autre pays ?', answer: 'Oui. Express Finance est une entreprise de financement à vocation internationale et accompagne des clients en Europe et au-delà. Indiquez votre pays de résidence dans le formulaire : nous vous précisons les modalités applicables à votre situation.' },
    { id: 'donnees', question: 'Comment mes données personnelles sont-elles protégées ?', answer: 'Vos données sont transmises de manière chiffrée, stockées sur une infrastructure sécurisée et accessibles uniquement aux personnes habilitées au traitement de votre demande. Consultez notre politique de confidentialité pour le détail de vos droits.' },
  ],
  it: [
    { id: 'montants', question: 'Quali importi posso richiedere?', answer: `Le richieste di finanziamento sono esaminate per importi compresi tra ${min.toLocaleString('it-IT')} € e ${max.toLocaleString('it-IT')} €, in base al tipo di finanziamento e alla tua situazione. L’importo concesso dipende sempre dall’analisi della tua pratica.` },
    { id: 'taux', question: 'Qual è il tasso applicato?', answer: 'Express Finance applica un tasso di interesse nominale annuo fisso del 2%, con rate costanti per tutta la durata del prestito. Le modalità esatte (durata, eventuali costi) ti sono confermate nell’offerta consegnata dopo l’esame della pratica.' },
    { id: 'frais', question: 'Ci sono costi oltre agli interessi?', answer: 'In base al tipo di finanziamento e al quadro legale e contrattuale applicabile possono essere previste spese di istruttoria. Ti vengono sempre comunicate per iscritto prima di qualsiasi firma: nessun costo nascosto, nessun pagamento richiesto prima della consegna dell’offerta.' },
    { id: 'delai', question: 'Quanto tempo richiede l’esame di una richiesta?', answer: 'Una volta ricevuta la pratica completa, un consulente ti dà una prima risposta entro 48 ore lavorative. I tempi di erogazione dei fondi dipendono poi dal tipo di finanziamento e dalla firma dell’offerta.' },
    { id: 'documents', question: 'Quali documenti devo fornire?', answer: 'In generale: un documento d’identità in corso di validità, una prova di residenza recente e la documentazione reddituale. In base al progetto potrebbero essere richiesti documenti aggiuntivi (preventivi, contratto preliminare, bilanci per le imprese).' },
    { id: 'garantie', question: 'La mia richiesta viene accettata automaticamente?', answer: 'No. Ogni richiesta è oggetto di un esame individuale. Express Finance si riserva il diritto di accettare o rifiutare una richiesta dopo l’analisi della situazione del richiedente e della fattibilità del progetto.' },
    { id: 'international', question: 'Posso fare richiesta da un altro paese?', answer: 'Sì. Express Finance è una società di finanziamento a vocazione internazionale e segue clienti in Europa e non solo. Indica il tuo paese di residenza nel modulo: ti indicheremo le modalità applicabili alla tua situazione.' },
    { id: 'donnees', question: 'Come sono protetti i miei dati personali?', answer: 'I tuoi dati vengono trasmessi in modo cifrato, conservati su un’infrastruttura sicura e resi accessibili solo alle persone autorizzate a trattare la tua richiesta. Consulta la nostra informativa sulla privacy per il dettaglio dei tuoi diritti.' },
  ],
  es: [
    { id: 'montants', question: '¿Qué importes puedo solicitar?', answer: `Las solicitudes de financiación se estudian para importes entre ${min.toLocaleString('es-ES')} € y ${max.toLocaleString('es-ES')} €, según el tipo de financiación y su situación. El importe concedido depende siempre del análisis de su expediente.` },
    { id: 'taux', question: '¿Cuál es el tipo de interés aplicado?', answer: 'Express Finance aplica un tipo de interés nominal anual fijo del 2 %, con cuotas constantes durante toda la vida del préstamo. Las condiciones exactas (plazo, posibles gastos) se le confirman en la oferta entregada tras el estudio de su expediente.' },
    { id: 'frais', question: '¿Hay gastos además de los intereses?', answer: 'Pueden aplicarse gastos de estudio según el tipo de financiación y el marco legal y contractual aplicable. Se le comunican siempre por escrito antes de firmar: sin gastos ocultos y sin ningún pago exigido antes de la entrega de la oferta.' },
    { id: 'delai', question: '¿Cuánto tarda el estudio de una solicitud?', answer: 'Una vez recibido su expediente completo, un asesor le ofrece una primera respuesta en un plazo de 48 horas hábiles. El plazo para la puesta a disposición de los fondos dependerá después del tipo de financiación y de la firma de la oferta.' },
    { id: 'documents', question: '¿Qué documentos debo aportar?', answer: 'En general: un documento de identidad en vigor, un justificante de domicilio reciente y justificantes de ingresos. Pueden solicitarse documentos adicionales según el proyecto (presupuestos, contrato de arras, cuentas anuales en el caso de empresas).' },
    { id: 'garantie', question: '¿Mi solicitud se acepta automáticamente?', answer: 'No. Cada solicitud es objeto de un estudio individual. Express Finance se reserva el derecho de aceptar o rechazar una solicitud tras analizar la situación del solicitante y la viabilidad del proyecto.' },
    { id: 'international', question: '¿Puedo solicitar desde otro país?', answer: 'Sí. Express Finance es una empresa de financiación con vocación internacional que acompaña a clientes tanto en Europa como fuera de ella. Indique su país de residencia en el formulario: le detallaremos las condiciones aplicables a su situación.' },
    { id: 'donnees', question: '¿Cómo se protegen mis datos personales?', answer: 'Sus datos se transmiten cifrados, se almacenan en una infraestructura segura y solo son accesibles a las personas autorizadas para tratar su solicitud. Consulte nuestra política de privacidad para conocer sus derechos.' },
  ],
};

export const faqByLocale: Record<Locale, FaqItem[]> = {
  ...baseFaq,
  ...(Object.fromEntries(Object.entries(extraContent).map(([l, c]) => [l, c.faq])) as Record<Exclude<Locale, 'fr' | 'it' | 'es'>, FaqItem[]>),
};
