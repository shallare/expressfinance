import type { Locale } from './config';
import { siteConfig, formatAddressOneLine } from '@/lib/config/site';
import { extraContent } from './content';

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Paragraphes affichés après la liste. */
  after?: string[];
}

export interface LegalDocument {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export type LegalPageKey = 'mentions' | 'privacy' | 'terms' | 'cookies' | 'disclaimer';

export const legalPaths: Record<LegalPageKey, string> = {
  mentions: '/mentions-legales',
  privacy: '/politique-de-confidentialite',
  terms: '/conditions-generales',
  cookies: '/politique-cookies',
  disclaimer: '/avertissement-pret',
};

const company = siteConfig.legalName;
const address = formatAddressOneLine();
const email = siteConfig.contact.email;
const phone = siteConfig.contact.phoneDisplay;

const fr: Record<LegalPageKey, LegalDocument> = {
  mentions: {
    title: 'Mentions légales',
    description: 'Mentions légales du site Express Finance : éditeur, hébergement, propriété intellectuelle, responsabilité.',
    lastUpdated: '26 septembre 2026',
    sections: [
      { heading: '1. Éditeur du site', paragraphs: [`Le présent site est édité par ${company}, entreprise internationale de financement dont le siège est situé ${address}.`], list: [`E-mail : ${email}`, `Téléphone : ${phone}`, 'Directeur de la publication : la direction d’Express Finance'] },
      { heading: '2. Hébergement', paragraphs: ['Le site est hébergé sur une infrastructure cloud européenne (Vercel Inc. pour l’application, Supabase Inc. pour la base de données et le stockage sécurisé des documents), sur des serveurs situés dans l’Union européenne.'] },
      { heading: '3. Activité', paragraphs: [`${company} propose des solutions de financement — prêts personnels, crédits immobiliers, crédits à la consommation, financements professionnels et de projet — destinées aux particuliers, indépendants et entreprises. Toute demande fait l’objet d’une étude individuelle ; aucune offre n’est émise sans analyse préalable du dossier.`] },
      { heading: '4. Propriété intellectuelle', paragraphs: [`L’ensemble des contenus du site (textes, visuels, logo, structure, code, simulateur) est protégé par le droit d’auteur et demeure la propriété exclusive de ${company} ou de ses partenaires. Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite et constitue une contrefaçon.`] },
      { heading: '5. Responsabilité', paragraphs: [`Les informations diffusées sur ce site sont fournies à titre informatif. ${company} s’efforce de les maintenir exactes et à jour mais ne saurait garantir leur exhaustivité ni l’absence d’erreur. Les simulations de prêt sont indicatives et ne constituent pas une offre de crédit.`, `${company} ne peut être tenue responsable des dommages directs ou indirects résultant de l’accès au site, de son utilisation ou de l’impossibilité d’y accéder, ni du contenu des sites tiers vers lesquels des liens pourraient renvoyer.`] },
      { heading: '6. Données personnelles', paragraphs: ['Le traitement des données personnelles collectées sur ce site est décrit dans la politique de confidentialité, accessible depuis le pied de page.'] },
      { heading: '7. Contact', paragraphs: [`Pour toute question relative au site ou à son contenu : ${email}.`] },
    ],
  },
  privacy: {
    title: 'Politique de confidentialité',
    description: 'Comment Express Finance collecte, utilise et protège vos données personnelles dans le cadre de votre demande de financement.',
    lastUpdated: '26 septembre 2026',
    sections: [
      { heading: '1. Responsable du traitement', paragraphs: [`Le responsable du traitement des données collectées via ce site est ${company}, ${address} — ${email}.`] },
      { heading: '2. Données collectées', paragraphs: ['Dans le cadre d’une demande de financement, nous collectons :'], list: ['Identité et coordonnées : prénom, nom, adresse postale, e-mail, téléphone ;', 'Situation professionnelle : profession, statut, revenu mensuel déclaré ;', 'Projet : type de financement, montant, durée, description du projet ;', 'Justificatifs : pièce d’identité et, le cas échéant, justificatifs de domicile et de revenus ;', 'Données techniques : empreinte hachée de l’adresse IP et navigateur utilisé (sécurité et prévention de la fraude), horodatage des consentements.'], after: ['Aucune donnée sensible au sens du RGPD (santé, opinions, appartenance) n’est demandée.'] },
      { heading: '3. Finalités et bases légales', list: ['Étude et traitement de votre demande de financement (mesures précontractuelles prises à votre demande) ;', 'Prise de contact et suivi de dossier par e-mail, téléphone ou WhatsApp ;', 'Sécurité du site, prévention des abus et de la fraude (intérêt légitime) ;', 'Respect de nos obligations légales et réglementaires.'] },
      { heading: '4. Destinataires', paragraphs: [`Vos données sont accessibles uniquement au personnel habilité de ${company} et à nos sous-traitants techniques (hébergement, base de données et stockage sécurisé). Lorsque la structuration d’un financement l’exige, les éléments strictement nécessaires peuvent être transmis à un établissement partenaire, avec votre information préalable. Aucune donnée n’est vendue ni cédée à des fins commerciales.`] },
      { heading: '5. Durée de conservation', paragraphs: ['Les données d’une demande sont conservées pendant la durée d’instruction puis, en l’absence de contrat, pendant 12 mois maximum avant suppression ou anonymisation. En cas de financement accordé, elles sont conservées pendant la durée du contrat et la période légale de conservation applicable (10 ans pour les pièces comptables).'] },
      { heading: '6. Sécurité', paragraphs: ['Les données transitent de manière chiffrée (HTTPS), sont stockées dans une base protégée par des règles d’accès strictes et les justificatifs sont conservés dans un espace de stockage privé, accessible uniquement via des liens temporaires générés pour les personnes habilitées.'] },
      { heading: '7. Vos droits', paragraphs: [`Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement à tout moment. Pour exercer ces droits : ${email}. Vous pouvez également introduire une réclamation auprès de l’Autorité de protection des données belge (www.autoriteprotectiondonnees.be) ou de l’autorité compétente de votre pays de résidence.`] },
      { heading: '8. Transferts hors Union européenne', paragraphs: ['Les données sont hébergées dans l’Union européenne. Si un transfert hors UE devait intervenir (par exemple vers un sous-traitant technique), il serait encadré par des garanties appropriées (clauses contractuelles types de la Commission européenne).'] },
      { heading: '9. Cookies', paragraphs: ['L’utilisation des cookies est décrite dans notre politique de cookies.'] },
    ],
  },
  terms: {
    title: 'Conditions générales d’utilisation',
    description: 'Conditions générales d’utilisation du site Express Finance et du service de demande de financement en ligne.',
    lastUpdated: '26 septembre 2026',
    sections: [
      { heading: '1. Objet', paragraphs: [`Les présentes conditions régissent l’utilisation du site ${siteConfig.name} et du service de demande de financement en ligne. En utilisant le site, vous les acceptez sans réserve.`] },
      { heading: '2. Nature du service', paragraphs: [`Le site permet de s’informer sur les solutions de financement proposées, de réaliser une simulation indicative et de soumettre une demande de financement. La soumission d’une demande ne constitue ni une offre ni un contrat de crédit : elle ouvre une phase d’étude à l’issue de laquelle ${company} peut accepter, refuser ou proposer des conditions différentes.`] },
      { heading: '3. Simulateur', paragraphs: ['Le simulateur fournit des estimations calculées à partir des paramètres affichés (taux nominal annuel fixe de 2 %, durée, frais éventuels). Ces résultats sont indicatifs, non contractuels, et peuvent différer des conditions finalement proposées.'] },
      { heading: '4. Obligations de l’utilisateur', list: ['Fournir des informations exactes, complètes et à jour ;', 'Ne transmettre que des documents dont vous êtes titulaire ou autorisé à communiquer ;', 'Ne pas utiliser le site à des fins frauduleuses, abusives ou contraires à la loi ;', 'Ne pas tenter de porter atteinte à la sécurité ou au fonctionnement du site.'] },
      { heading: '5. Frais', paragraphs: ['L’utilisation du site et la soumission d’une demande sont gratuites. Des frais de dossier peuvent s’appliquer au financement lui-même, lorsque cela est légalement et contractuellement prévu ; ils sont communiqués par écrit avant tout engagement. Aucun paiement n’est exigé avant la remise de l’offre.'] },
      { heading: '6. Responsabilité', paragraphs: [`${company} met en œuvre les moyens raisonnables pour assurer la disponibilité et la sécurité du site, sans garantie d’absence d’interruption. Sa responsabilité ne saurait être engagée pour les dommages indirects résultant de l’utilisation du site ou de l’impossibilité d’y accéder.`] },
      { heading: '7. Propriété intellectuelle', paragraphs: ['Voir les mentions légales.'] },
      { heading: '8. Données personnelles', paragraphs: ['Le traitement de vos données est décrit dans la politique de confidentialité.'] },
      { heading: '9. Droit applicable et juridiction', paragraphs: ['Les présentes conditions sont soumises au droit belge. Tout litige relatif à leur interprétation ou à leur exécution relève des tribunaux de Bruxelles, sous réserve des dispositions impératives protectrices du consommateur applicables dans son pays de résidence.'] },
    ],
  },
  cookies: {
    title: 'Politique de cookies',
    description: 'Informations sur les cookies et traceurs utilisés par le site Express Finance.',
    lastUpdated: '26 septembre 2026',
    sections: [
      { heading: '1. Qu’est-ce qu’un cookie ?', paragraphs: ['Un cookie est un petit fichier déposé sur votre appareil lors de la consultation d’un site. Il permet notamment de maintenir une session ou de mémoriser des préférences.'] },
      { heading: '2. Cookies utilisés sur ce site', paragraphs: ['Le site public n’utilise aucun cookie publicitaire ni cookie de mesure d’audience tiers. Les seuls cookies déposés sont strictement nécessaires :'], list: ['Cookies de session d’administration : déposés uniquement lors de la connexion à l’espace réservé au personnel d’Express Finance. Ils ne concernent pas les visiteurs.', 'Vérification anti-robot : un jeton technique peut être utilisé le temps de la vérification lors de l’envoi du formulaire de demande.'], after: ['Ces cookies étant strictement nécessaires au fonctionnement du service, ils ne requièrent pas de consentement préalable.'] },
      { heading: '3. Simulateur', paragraphs: ['Le simulateur fonctionne entièrement dans votre navigateur et ne conserve pas vos paramètres après la fermeture de la page.'] },
      { heading: '4. Gestion des cookies', paragraphs: ['Vous pouvez configurer votre navigateur pour refuser ou supprimer les cookies. Le blocage des cookies strictement nécessaires peut empêcher l’accès à l’espace d’administration.'] },
    ],
  },
  disclaimer: {
    title: 'Avertissement sur les prêts',
    description: 'Informations importantes avant toute demande de financement : simulation indicative, étude du dossier, engagement de remboursement.',
    lastUpdated: '26 septembre 2026',
    sections: [
      { heading: 'Un crédit vous engage', paragraphs: ['Emprunter de l’argent coûte aussi de l’argent. Avant de vous engager, vérifiez votre capacité de remboursement et assurez-vous que les mensualités sont compatibles avec votre budget sur toute la durée du financement.'] },
      { heading: 'Simulations indicatives', paragraphs: [`Les résultats du simulateur sont des estimations calculées à partir des paramètres affichés. Ils ne constituent ni une offre, ni une promesse de financement, ni un engagement de ${company}. Les conditions définitives (taux, durée, frais, garanties) sont précisées dans l’offre écrite remise après étude complète du dossier.`] },
      { heading: 'Étude individuelle', paragraphs: [`Chaque demande est étudiée individuellement. ${company} se réserve le droit de refuser un financement ou d’en modifier les conditions à l’issue de l’étude.`] },
      { heading: 'Frais et pénalités', paragraphs: ['Des frais de dossier peuvent s’appliquer lorsque cela est légalement et contractuellement prévu ; ils sont annoncés avant tout engagement. En cas de retard de paiement, des pénalités sont dues selon le contrat. Les montants affichés par le simulateur de pénalités sont estimatifs et dépendent des conditions contractuelles applicables.'] },
      { heading: 'Vigilance', paragraphs: [`${company} ne vous demandera jamais de communiquer vos identifiants bancaires par e-mail ou message, ni de verser une somme avant la remise d’une offre écrite. En cas de doute sur l’authenticité d’une communication, contactez-nous directement via les coordonnées officielles indiquées sur ce site.`] },
    ],
  },
};

const it: Record<LegalPageKey, LegalDocument> = {
  mentions: {
    title: 'Note legali',
    description: 'Note legali del sito Express Finance: editore, hosting, proprietà intellettuale, responsabilità.',
    lastUpdated: '26 settembre 2026',
    sections: [
      { heading: '1. Editore del sito', paragraphs: [`Il presente sito è pubblicato da ${company}, società internazionale di finanziamento con sede in ${address}.`], list: [`E-mail: ${email}`, `Telefono: ${phone}`, 'Direttore responsabile: la direzione di Express Finance'] },
      { heading: '2. Hosting', paragraphs: ['Il sito è ospitato su un’infrastruttura cloud europea (Vercel Inc. per l’applicazione, Supabase Inc. per il database e l’archiviazione sicura dei documenti), su server situati nell’Unione europea.'] },
      { heading: '3. Attività', paragraphs: [`${company} propone soluzioni di finanziamento — prestiti personali, mutui, credito al consumo, finanziamenti aziendali e di progetto — destinate a privati, autonomi e imprese. Ogni richiesta è oggetto di un esame individuale; nessuna offerta è emessa senza analisi preventiva della pratica.`] },
      { heading: '4. Proprietà intellettuale', paragraphs: [`Tutti i contenuti del sito (testi, immagini, logo, struttura, codice, simulatore) sono protetti dal diritto d’autore e restano di proprietà esclusiva di ${company} o dei suoi partner. Qualsiasi riproduzione, rappresentazione, adattamento o sfruttamento, totale o parziale, senza previa autorizzazione scritta è vietato e costituisce violazione del diritto d’autore.`] },
      { heading: '5. Responsabilità', paragraphs: [`Le informazioni pubblicate su questo sito sono fornite a titolo informativo. ${company} si impegna a mantenerle esatte e aggiornate ma non può garantirne la completezza né l’assenza di errori. Le simulazioni di prestito sono indicative e non costituiscono un’offerta di credito.`, `${company} non può essere ritenuta responsabile dei danni diretti o indiretti derivanti dall’accesso al sito, dal suo utilizzo o dall’impossibilità di accedervi, né del contenuto dei siti terzi eventualmente collegati.`] },
      { heading: '6. Dati personali', paragraphs: ['Il trattamento dei dati personali raccolti su questo sito è descritto nell’informativa sulla privacy, accessibile dal piè di pagina.'] },
      { heading: '7. Contatti', paragraphs: [`Per qualsiasi domanda relativa al sito o ai suoi contenuti: ${email}.`] },
    ],
  },
  privacy: {
    title: 'Informativa sulla privacy',
    description: 'Come Express Finance raccoglie, utilizza e protegge i tuoi dati personali nell’ambito della tua richiesta di finanziamento.',
    lastUpdated: '26 settembre 2026',
    sections: [
      { heading: '1. Titolare del trattamento', paragraphs: [`Il titolare del trattamento dei dati raccolti tramite questo sito è ${company}, ${address} — ${email}.`] },
      { heading: '2. Dati raccolti', paragraphs: ['Nell’ambito di una richiesta di finanziamento raccogliamo:'], list: ['Identità e recapiti: nome, cognome, indirizzo postale, e-mail, telefono;', 'Situazione professionale: professione, stato, reddito mensile dichiarato;', 'Progetto: tipo di finanziamento, importo, durata, descrizione del progetto;', 'Documenti: documento d’identità e, se del caso, prove di residenza e di reddito;', 'Dati tecnici: impronta crittografica (hash) dell’indirizzo IP e browser utilizzato (sicurezza e prevenzione delle frodi), data e ora dei consensi.'], after: ['Non viene richiesto alcun dato sensibile ai sensi del GDPR (salute, opinioni, appartenenza).'] },
      { heading: '3. Finalità e basi giuridiche', list: ['Esame e gestione della tua richiesta di finanziamento (misure precontrattuali adottate su tua richiesta);', 'Contatto e gestione della pratica via e-mail, telefono o WhatsApp;', 'Sicurezza del sito, prevenzione di abusi e frodi (interesse legittimo);', 'Rispetto dei nostri obblighi legali e regolamentari.'] },
      { heading: '4. Destinatari', paragraphs: [`I tuoi dati sono accessibili solo al personale autorizzato di ${company} e ai nostri fornitori tecnici (hosting, database e archiviazione sicura). Quando la strutturazione di un finanziamento lo richiede, gli elementi strettamente necessari possono essere trasmessi a un istituto partner, previa comunicazione all’interessato. Nessun dato viene venduto o ceduto a fini commerciali.`] },
      { heading: '5. Periodo di conservazione', paragraphs: ['I dati di una richiesta vengono conservati per la durata dell’istruttoria e, in assenza di contratto, per un massimo di 12 mesi, trascorsi i quali vengono cancellati o anonimizzati. In caso di finanziamento concesso, vengono conservati per la durata del contratto e per il periodo di conservazione previsto dalla legge (10 anni per i documenti contabili).'] },
      { heading: '6. Sicurezza', paragraphs: ['I dati vengono trasmessi in modo cifrato (HTTPS) e conservati in un database protetto da regole di accesso rigorose; i documenti sono archiviati in uno spazio privato, accessibile solo tramite link temporanei generati per le persone autorizzate.'] },
      { heading: '7. I tuoi diritti', paragraphs: [`Ai sensi del GDPR, hai diritto di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità dei tuoi dati, nonché di revocare il consenso in qualsiasi momento. Per esercitare questi diritti: ${email}. Puoi inoltre presentare reclamo all’Autorità belga per la protezione dei dati (www.autoriteprotectiondonnees.be) o all’autorità competente del tuo paese di residenza.`] },
      { heading: '8. Trasferimenti fuori dall’Unione europea', paragraphs: ['I dati sono ospitati nell’Unione europea. Qualora si rendesse necessario un trasferimento fuori dall’UE (ad esempio verso un fornitore tecnico), sarebbe disciplinato da garanzie adeguate (clausole contrattuali standard della Commissione europea).'] },
      { heading: '9. Cookie', paragraphs: ['L’utilizzo dei cookie è descritto nella nostra politica sui cookie.'] },
    ],
  },
  terms: {
    title: 'Condizioni generali di utilizzo',
    description: 'Condizioni generali di utilizzo del sito Express Finance e del servizio di richiesta di finanziamento online.',
    lastUpdated: '26 settembre 2026',
    sections: [
      { heading: '1. Oggetto', paragraphs: [`Le presenti condizioni regolano l’utilizzo del sito ${siteConfig.name} e del servizio di richiesta di finanziamento online. Utilizzando il sito, le accetti senza riserve.`] },
      { heading: '2. Natura del servizio', paragraphs: [`Il sito consente di informarsi sulle soluzioni di finanziamento proposte, di effettuare una simulazione indicativa e di inviare una richiesta di finanziamento. L’invio di una richiesta non costituisce né un’offerta né un contratto di credito: apre una fase di esame al termine della quale ${company} può accettare, rifiutare o proporre condizioni diverse.`] },
      { heading: '3. Simulatore', paragraphs: ['Il simulatore fornisce stime calcolate in base ai parametri visualizzati (tasso nominale annuo fisso del 2%, durata, eventuali costi). Questi risultati sono indicativi, non vincolanti, e possono differire dalle condizioni effettivamente proposte.'] },
      { heading: '4. Obblighi dell’utente', list: ['Fornire informazioni esatte, complete e aggiornate;', 'Trasmettere solo documenti di cui sei titolare o che sei autorizzato a comunicare;', 'Non utilizzare il sito a fini fraudolenti, abusivi o contrari alla legge;', 'Non tentare di compromettere la sicurezza o il funzionamento del sito.'] },
      { heading: '5. Costi', paragraphs: ['L’utilizzo del sito e l’invio di una richiesta sono gratuiti. Al finanziamento stesso possono applicarsi spese di istruttoria, ove previsto dalla legge e dal contratto; vengono comunicate per iscritto prima di qualsiasi impegno. Nessun pagamento è richiesto prima della consegna dell’offerta.'] },
      { heading: '6. Responsabilità', paragraphs: [`${company} adotta misure ragionevoli per garantire la disponibilità e la sicurezza del sito, senza garanzia di assenza di interruzioni. Non può essere chiamata a rispondere di danni indiretti derivanti dall’utilizzo del sito o dall’impossibilità di accedervi.`] },
      { heading: '7. Proprietà intellettuale', paragraphs: ['Si rimanda alle note legali.'] },
      { heading: '8. Dati personali', paragraphs: ['Il trattamento dei tuoi dati è descritto nell’informativa sulla privacy.'] },
      { heading: '9. Legge applicabile e foro competente', paragraphs: ['Le presenti condizioni sono soggette al diritto belga. Qualsiasi controversia relativa alla loro interpretazione o esecuzione è di competenza dei tribunali di Bruxelles, fatte salve le disposizioni imperative a tutela del consumatore applicabili nel paese di residenza di quest’ultimo.'] },
    ],
  },
  cookies: {
    title: 'Politica sui cookie',
    description: 'Informazioni sui cookie e sui tracker utilizzati dal sito Express Finance.',
    lastUpdated: '26 settembre 2026',
    sections: [
      { heading: '1. Che cos’è un cookie?', paragraphs: ['Un cookie è un piccolo file salvato sul tuo dispositivo durante la navigazione su un sito. Serve, ad esempio, a mantenere attiva una sessione o a memorizzare le preferenze.'] },
      { heading: '2. Cookie utilizzati su questo sito', paragraphs: ['Il sito pubblico non utilizza cookie pubblicitari né cookie di analisi statistica di terze parti. Gli unici cookie utilizzati sono quelli strettamente necessari:'], list: ['Cookie di sessione dell’area di amministrazione: salvati solo all’accesso all’area riservata al personale di Express Finance. Non riguardano i visitatori.', 'Verifica anti-robot: un token tecnico può essere utilizzato durante la verifica all’invio del modulo di richiesta.'], after: ['Essendo strettamente necessari al funzionamento del servizio, questi cookie non richiedono il consenso preventivo dell’utente.'] },
      { heading: '3. Simulatore', paragraphs: ['Il simulatore funziona interamente nel tuo browser e non conserva i tuoi parametri dopo la chiusura della pagina.'] },
      { heading: '4. Gestione dei cookie', paragraphs: ['Puoi configurare il browser per rifiutare o eliminare i cookie. Il blocco dei cookie strettamente necessari può impedire l’accesso all’area di amministrazione.'] },
    ],
  },
  disclaimer: {
    title: 'Avvertenza sui prestiti',
    description: 'Informazioni importanti prima di qualsiasi richiesta di finanziamento: simulazione indicativa, esame della pratica, impegno di rimborso.',
    lastUpdated: '26 settembre 2026',
    sections: [
      { heading: 'Un finanziamento è un impegno', paragraphs: ['Prendere denaro in prestito ha un costo. Prima di sottoscrivere un finanziamento, verifica la tua capacità di rimborso e assicurati che le rate siano sostenibili per il tuo budget per tutta la durata del contratto.'] },
      { heading: 'Simulazioni indicative', paragraphs: [`I risultati del simulatore sono stime calcolate in base ai parametri visualizzati. Non costituiscono né un’offerta, né una promessa di finanziamento, né un impegno di ${company}. Le condizioni definitive (tasso, durata, costi, garanzie) sono precisate nell’offerta scritta consegnata dopo l’esame completo della pratica.`] },
      { heading: 'Esame individuale', paragraphs: [`Ogni richiesta è esaminata individualmente. ${company} si riserva il diritto di rifiutare un finanziamento o di modificarne le condizioni al termine dell’esame.`] },
      { heading: 'Costi e penali', paragraphs: ['Ove previsto dalla legge e dal contratto possono applicarsi spese di istruttoria, comunicate prima di qualsiasi impegno. In caso di ritardo nei pagamenti sono dovute le penali previste dal contratto. Gli importi mostrati dal simulatore di penali sono stime e dipendono dalle condizioni contrattuali applicabili.'] },
      { heading: 'Attenzione alle truffe', paragraphs: [`${company} non ti chiederà mai di comunicare le tue credenziali bancarie via e-mail o messaggio, né di versare alcuna somma prima della consegna di un’offerta scritta. In caso di dubbi sull’autenticità di una comunicazione, contattaci direttamente tramite i recapiti ufficiali indicati su questo sito.`] },
    ],
  },
};

const es: Record<LegalPageKey, LegalDocument> = {
  mentions: {
    title: 'Aviso legal',
    description: 'Aviso legal del sitio Express Finance: editor, alojamiento, propiedad intelectual, responsabilidad.',
    lastUpdated: '26 de septiembre de 2026',
    sections: [
      { heading: '1. Editor del sitio', paragraphs: [`El presente sitio es editado por ${company}, empresa internacional de financiación con sede en ${address}.`], list: [`Correo electrónico: ${email}`, `Teléfono: ${phone}`, 'Responsable de la publicación: la dirección de Express Finance'] },
      { heading: '2. Alojamiento', paragraphs: ['El sitio se aloja en una infraestructura en la nube europea (Vercel Inc. para la aplicación, Supabase Inc. para la base de datos y el almacenamiento seguro de documentos), en servidores situados en la Unión Europea.'] },
      { heading: '3. Actividad', paragraphs: [`${company} ofrece soluciones de financiación — préstamos personales, hipotecarios, crédito al consumo, financiación empresarial y de proyectos — destinadas a particulares, autónomos y empresas. Toda solicitud es objeto de un estudio individual; no se emite ninguna oferta sin análisis previo del expediente.`] },
      { heading: '4. Propiedad intelectual', paragraphs: [`Todos los contenidos del sitio (textos, imágenes, logotipo, estructura, código, simulador) están protegidos por derechos de autor y son propiedad exclusiva de ${company} o de sus colaboradores. Queda prohibida cualquier reproducción, representación, adaptación o explotación, total o parcial, sin autorización previa por escrito; su incumplimiento constituye una infracción de los derechos de propiedad intelectual.`] },
      { heading: '5. Responsabilidad', paragraphs: [`La información publicada en este sitio se facilita a título informativo. ${company} se esfuerza por mantenerla exacta y actualizada, pero no puede garantizar su exhaustividad ni la ausencia de errores. Las simulaciones de préstamo son orientativas y no constituyen una oferta de crédito.`, `${company} no se hace responsable de los daños directos o indirectos derivados del acceso al sitio, de su uso o de la imposibilidad de acceder a él, ni del contenido de sitios de terceros enlazados.`] },
      { heading: '6. Datos personales', paragraphs: ['El tratamiento de los datos personales recogidos en este sitio se describe en la política de privacidad, accesible desde el pie de página.'] },
      { heading: '7. Contacto', paragraphs: [`Para cualquier cuestión relativa al sitio o a su contenido: ${email}.`] },
    ],
  },
  privacy: {
    title: 'Política de privacidad',
    description: 'Cómo Express Finance recoge, utiliza y protege sus datos personales en el marco de su solicitud de financiación.',
    lastUpdated: '26 de septiembre de 2026',
    sections: [
      { heading: '1. Responsable del tratamiento', paragraphs: [`El responsable del tratamiento de los datos recogidos a través de este sitio es ${company}, ${address} — ${email}.`] },
      { heading: '2. Datos recogidos', paragraphs: ['En el marco de una solicitud de financiación recogemos:'], list: ['Identidad y datos de contacto: nombre, apellidos, dirección postal, correo electrónico, teléfono;', 'Situación profesional: profesión, situación laboral, ingresos mensuales declarados;', 'Proyecto: tipo de financiación, importe, plazo, descripción del proyecto;', 'Justificantes: documento de identidad y, en su caso, justificantes de domicilio y de ingresos;', 'Datos técnicos: huella cifrada de la dirección IP y navegador utilizado (seguridad y prevención del fraude), fecha y hora de los consentimientos.'], after: ['No se solicita ninguna categoría especial de datos en el sentido del RGPD (salud, opiniones políticas, afiliación).'] },
      { heading: '3. Finalidades y bases jurídicas', list: ['Estudio y tramitación de su solicitud de financiación (medidas precontractuales adoptadas a petición suya);', 'Contacto y seguimiento del expediente por correo, teléfono o WhatsApp;', 'Seguridad del sitio, prevención de abusos y fraudes (interés legítimo);', 'Cumplimiento de nuestras obligaciones legales y reglamentarias.'] },
      { heading: '4. Destinatarios', paragraphs: [`Sus datos solo son accesibles al personal autorizado de ${company} y a nuestros proveedores técnicos (alojamiento, base de datos y almacenamiento seguro). Cuando la estructuración de una financiación lo requiera, los elementos estrictamente necesarios pueden transmitirse a una entidad colaboradora, previa información al interesado. Ningún dato se vende ni se cede con fines comerciales.`] },
      { heading: '5. Plazo de conservación', paragraphs: ['Los datos de una solicitud se conservan durante la tramitación y, en ausencia de contrato, durante un máximo de 12 meses antes de su supresión o anonimización. En caso de financiación concedida, se conservan durante la vigencia del contrato y el periodo legal de conservación aplicable (10 años para los documentos contables).'] },
      { heading: '6. Seguridad', paragraphs: ['Los datos se transmiten cifrados (HTTPS), se almacenan en una base de datos protegida por reglas de acceso estrictas y los justificantes se conservan en un espacio de almacenamiento privado, accesible únicamente mediante enlaces temporales generados para las personas autorizadas.'] },
      { heading: '7. Sus derechos', paragraphs: [`De conformidad con el RGPD, dispone de derecho de acceso, rectificación, supresión, limitación, oposición y portabilidad de sus datos, así como del derecho a retirar su consentimiento en cualquier momento. Para ejercer estos derechos: ${email}. También puede presentar una reclamación ante la Autoridad belga de protección de datos (www.autoriteprotectiondonnees.be) o ante la autoridad competente de su país de residencia.`] },
      { heading: '8. Transferencias fuera de la Unión Europea', paragraphs: ['Los datos se alojan en la Unión Europea. Si fuera necesaria una transferencia fuera de la UE (por ejemplo, a un proveedor técnico), estaría amparada por garantías adecuadas (cláusulas contractuales tipo de la Comisión Europea).'] },
      { heading: '9. Cookies', paragraphs: ['El uso de cookies se describe en nuestra política de cookies.'] },
    ],
  },
  terms: {
    title: 'Condiciones generales de uso',
    description: 'Condiciones generales de uso del sitio Express Finance y del servicio de solicitud de financiación en línea.',
    lastUpdated: '26 de septiembre de 2026',
    sections: [
      { heading: '1. Objeto', paragraphs: [`Las presentes condiciones regulan el uso del sitio ${siteConfig.name} y del servicio de solicitud de financiación en línea. Al utilizar el sitio, las acepta sin reservas.`] },
      { heading: '2. Naturaleza del servicio', paragraphs: [`El sitio permite informarse sobre las soluciones de financiación ofrecidas, realizar una simulación orientativa y enviar una solicitud de financiación. El envío de una solicitud no constituye ni una oferta ni un contrato de crédito: abre una fase de estudio al término de la cual ${company} puede aceptar, rechazar o proponer condiciones distintas.`] },
      { heading: '3. Simulador', paragraphs: ['El simulador proporciona estimaciones calculadas a partir de los parámetros mostrados (tipo nominal anual fijo del 2 %, plazo, posibles gastos). Estos resultados son orientativos, no contractuales, y pueden diferir de las condiciones finalmente propuestas.'] },
      { heading: '4. Obligaciones del usuario', list: ['Facilitar información exacta, completa y actualizada;', 'Transmitir únicamente documentos de los que sea titular o esté autorizado a comunicar;', 'No utilizar el sitio con fines fraudulentos, abusivos o contrarios a la ley;', 'No intentar vulnerar la seguridad o el funcionamiento del sitio.'] },
      { heading: '5. Gastos', paragraphs: ['El uso del sitio y el envío de una solicitud son gratuitos. Pueden aplicarse gastos de estudio a la propia financiación, cuando esté legal y contractualmente previsto; se comunican por escrito antes de cualquier compromiso. No se exige ningún pago antes de la entrega de la oferta.'] },
      { heading: '6. Responsabilidad', paragraphs: [`${company} adopta medidas razonables para garantizar la disponibilidad y la seguridad del sitio, sin garantía de ausencia de interrupciones. No se le podrá exigir responsabilidad por daños indirectos derivados del uso del sitio o de la imposibilidad de acceder a él.`] },
      { heading: '7. Propiedad intelectual', paragraphs: ['Véase el aviso legal.'] },
      { heading: '8. Datos personales', paragraphs: ['El tratamiento de sus datos se describe en la política de privacidad.'] },
      { heading: '9. Ley aplicable y jurisdicción', paragraphs: ['Las presentes condiciones se rigen por el derecho belga. Cualquier litigio relativo a su interpretación o ejecución será competencia de los tribunales de Bruselas, sin perjuicio de las disposiciones imperativas de protección del consumidor aplicables en su país de residencia.'] },
    ],
  },
  cookies: {
    title: 'Política de cookies',
    description: 'Información sobre las cookies y rastreadores utilizados por el sitio Express Finance.',
    lastUpdated: '26 de septiembre de 2026',
    sections: [
      { heading: '1. ¿Qué es una cookie?', paragraphs: ['Una cookie es un pequeño archivo que se almacena en su dispositivo al consultar un sitio web. Permite, entre otras cosas, mantener una sesión o recordar preferencias.'] },
      { heading: '2. Cookies utilizadas en este sitio', paragraphs: ['El sitio público no utiliza ninguna cookie publicitaria ni cookies de análisis de terceros. Las únicas cookies utilizadas son estrictamente necesarias:'], list: ['Cookies de sesión de administración: se instalan únicamente al iniciar sesión en el área reservada al personal de Express Finance. No afectan a los visitantes.', 'Verificación anti-robot: puede utilizarse un token técnico durante la verificación al enviar el formulario de solicitud.'], after: ['Al ser estrictamente necesarias para el funcionamiento del servicio, estas cookies no requieren consentimiento previo.'] },
      { heading: '3. Simulador', paragraphs: ['El simulador funciona íntegramente en su navegador y no conserva sus parámetros tras cerrar la página.'] },
      { heading: '4. Gestión de cookies', paragraphs: ['Puede configurar su navegador para rechazar o eliminar cookies. El bloqueo de las cookies estrictamente necesarias puede impedir el acceso al área de administración.'] },
    ],
  },
  disclaimer: {
    title: 'Advertencia sobre préstamos',
    description: 'Información importante antes de cualquier solicitud de financiación: simulación orientativa, estudio del expediente, compromiso de reembolso.',
    lastUpdated: '26 de septiembre de 2026',
    sections: [
      { heading: 'Un crédito es un compromiso', paragraphs: ['Pedir dinero prestado también cuesta dinero. Antes de contratar una financiación, compruebe su capacidad de pago y asegúrese de que las cuotas son compatibles con su presupuesto durante toda la vida del préstamo.'] },
      { heading: 'Simulaciones orientativas', paragraphs: [`Los resultados del simulador son estimaciones calculadas a partir de los parámetros mostrados. No constituyen ni una oferta, ni una promesa de financiación, ni un compromiso de ${company}. Las condiciones definitivas (tipo, plazo, gastos, garantías) se detallan en la oferta escrita entregada tras el estudio completo del expediente.`] },
      { heading: 'Estudio individual', paragraphs: [`Cada solicitud se estudia individualmente. ${company} se reserva el derecho de rechazar una financiación o de modificar sus condiciones al término del estudio.`] },
      { heading: 'Gastos y penalizaciones', paragraphs: ['Pueden aplicarse gastos de estudio cuando esté legal y contractualmente previsto; se anuncian antes de cualquier compromiso. En caso de retraso en el pago, se devengan penalizaciones según el contrato. Los importes mostrados por el simulador de penalizaciones son estimaciones y dependen de las condiciones contractuales aplicables.'] },
      { heading: 'Precaución ante el fraude', paragraphs: [`${company} nunca le pedirá que comunique sus claves de acceso bancarias por correo electrónico o mensaje, ni que abone una cantidad antes de la entrega de una oferta escrita. En caso de duda sobre la autenticidad de una comunicación, contáctenos directamente a través de los datos oficiales indicados en este sitio.`] },
    ],
  },
};

const legalByLocale: Record<Locale, Record<LegalPageKey, LegalDocument>> = {
  fr,
  it,
  es,
  ...(Object.fromEntries(Object.entries(extraContent).map(([l, c]) => [l, c.legal])) as Record<Exclude<Locale, 'fr' | 'it' | 'es'>, Record<LegalPageKey, LegalDocument>>),
};

export function getLegalDocument(locale: Locale, key: LegalPageKey): LegalDocument {
  return legalByLocale[locale][key];
}
