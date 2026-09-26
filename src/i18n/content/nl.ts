import { siteConfig, formatAddressOneLine } from '@/lib/config/site';
import { loanLimits } from '@/lib/config/loans';
import type { LocaleContent } from './types';

const company = siteConfig.legalName;
const address = formatAddressOneLine();
const email = siteConfig.contact.email;
const phone = siteConfig.contact.phoneDisplay;
const min = loanLimits.minAmount.toLocaleString('nl-BE');
const max = loanLimits.maxAmount.toLocaleString('nl-BE');
const docs = ['Geldig identiteitsbewijs (identiteitskaart of paspoort)', 'Bewijs van woonplaats, maximaal 3 maanden oud', 'Inkomensbewijzen (3 laatste loonfiches of aanslagbiljet)'];
const updated = '26 september 2026';

export const nl: LocaleContent = {
  products: {
    'pret-personnel': {
      name: 'Persoonlijke lening', shortName: 'Persoonlijk', tagline: 'Financier uw persoonlijke projecten in alle vrijheid.',
      description: 'Een flexibele financiering zonder verplichte bestemming, om uw persoonlijke projecten waar te maken: een reis, een huwelijk, studies, onvoorziene uitgaven of extra financiële ruimte.',
      longDescription: 'Met de persoonlijke lening van Express Finance leent u een vast bedrag dat u in vaste maandelijkse aflossingen terugbetaalt over een looptijd naar keuze. U beslist zelf waarvoor u de fondsen gebruikt en geniet persoonlijke begeleiding van de aanvraag tot de uitbetaling.',
      keyConditions: ['Vaste maandelijkse aflossingen over de hele looptijd', 'Geen verplichte bestemming van de fondsen', 'Individueel onderzoek van elk dossier', 'Vervroegde terugbetaling mogelijk volgens de contractuele voorwaarden'],
      useCases: ['Extra financiële ruimte', 'Familiegebeurtenis', 'Studies en opleiding', 'Reis'], requiredDocuments: docs,
    },
    'credit-immobilier': {
      name: 'Hypothecair krediet', shortName: 'Hypothecair', tagline: 'Geef uw vastgoedproject vorm.',
      description: 'Aankoop, nieuwbouw, renovatie of opbrengsteigendom: een gestructureerde vastgoedfinanciering, aangepast aan uw situatie.',
      longDescription: 'Met ons hypothecair krediet financiert u de aankoop van een eigen woning of een tweede verblijf, een nieuwbouw, een renovatie of een opbrengsteigendom. Elk dossier wordt grondig geanalyseerd om u een financieringsplan voor te stellen dat aansluit bij uw terugbetalingscapaciteit.',
      keyConditions: ['Financiering van aankoop, nieuwbouw of renovatie', 'Lange looptijden mogelijk naargelang het project', 'Gedetailleerde analyse van het financieringsplan', 'Waarborgen vastgelegd bij het dossieronderzoek'],
      useCases: ['Eigen woning', 'Opbrengsteigendom', 'Renovatie', 'Nieuwbouw'], requiredDocuments: [...docs, 'Verkoopcompromis, offerte of beschrijving van het vastgoedproject'],
    },
    'credit-consommation': {
      name: 'Consumentenkrediet', shortName: 'Consumenten', tagline: 'Uw aankoop, zonder te wachten.',
      description: 'Wagen, uitrusting, huishoudtoestellen, werken: een financiering voor de aankoop van een specifiek goed of een specifieke dienst.',
      longDescription: 'Het consumentenkrediet financiert een specifieke aankoop — een wagen, meubilair, uitrusting of inrichtingswerken. Bedrag en looptijd worden afgestemd op de waarde van het goed en op uw maandelijkse budget.',
      keyConditions: ['Financiering gekoppeld aan een specifieke aankoop', 'Maandelijkse aflossingen aangepast aan uw budget', 'Aankoopbewijs (offerte of factuur) vereist', 'Definitieve voorwaarden vastgelegd na dossieronderzoek'],
      useCases: ['Wagen', 'Inrichtingswerken', 'Uitrusting', 'Meubilair'], requiredDocuments: [...docs, 'Offerte of bestelbon van het gefinancierde goed'],
    },
    'financement-professionnel': {
      name: 'Bedrijfsfinanciering', shortName: 'Zakelijk', tagline: 'Ondersteun de groei van uw onderneming.',
      description: 'Bedrijfskapitaal, investeringen, materieel, commerciële groei: financieringsoplossingen voor zelfstandigen, kmo’s en kleine ondernemingen.',
      longDescription: 'Express Finance begeleidt ondernemers, zelfstandigen en vennootschappen bij hun financieringsbehoeften: versterking van het bedrijfskapitaal, aankoop van materieel, uitbreiding van de activiteit of overname van een onderneming. Het dossier wordt onderzocht op basis van de financiële gegevens van de onderneming.',
      keyConditions: ['Toegankelijk voor zelfstandigen, kmo’s en kleine ondernemingen', 'Financiering van bedrijfskapitaal of investeringen', 'Analyse van de financiële documenten van de onderneming', 'Aflossingsplan afgestemd op de cyclus van uw activiteit'],
      useCases: ['Bedrijfskapitaal', 'Machines en uitrusting', 'Commerciële groei', 'Overname van een onderneming'],
      requiredDocuments: ['Identiteitsbewijs van de zaakvoerder', 'Uittreksel uit de Kruispuntbank van Ondernemingen of gelijkwaardig document', 'Recentste balansen of jaarrekeningen', 'Recente uittreksels van de professionele bankrekening'],
    },
    'financement-de-projet': {
      name: 'Projectfinanciering', shortName: 'Project', tagline: 'Van idee tot concrete realisatie.',
      description: 'Opstart van een activiteit, innovatief, agrarisch, vastgoed- of industrieel project: een financiering opgebouwd rond uw projectplan.',
      longDescription: 'Projectfinanciering is bedoeld voor initiatiefnemers met een goed onderbouwd project en een duidelijk plan: de opstart van een activiteit, de ontwikkeling van een product, een agrarisch, energie- of industrieel project. Het onderzoek spitst zich toe op de levensvatbaarheid van het project, de timing en het vermogen om voldoende kasstromen voor de terugbetaling te genereren.',
      keyConditions: ['Projectdossier (presentatie) vereist', 'Onderzoek van levensvatbaarheid en timing', 'Financiering kan in fasen worden vrijgegeven', 'Persoonlijke begeleiding tijdens het hele onderzoek'],
      useCases: ['Opstart van een activiteit', 'Agrarisch project', 'Energieproject', 'Productontwikkeling'],
      requiredDocuments: ['Identiteitsbewijs van de initiatiefnemer', 'Projectdossier / businessplan', 'Financieel plan met prognoses', 'Bewijs van eventuele eigen inbreng'],
    },
    'autres-solutions': {
      name: 'Andere financieringsoplossingen', shortName: 'Op maat', tagline: 'Een specifieke behoefte? Laten we praten.',
      description: 'Hergroepering van kredieten, studiefinanciering, atypische situatie: wij onderzoeken aanvragen die niet in de klassieke categorieën passen.',
      longDescription: 'Sommige situaties vragen een aanpak op maat: hergroepering van kredieten, financiering van een studietraject, eenmalige behoefte of atypisch project. Beschrijf ons uw behoefte en ons team onderzoekt of een aangepaste oplossing haalbaar is.',
      keyConditions: ['Onderzoek geval per geval', 'Oplossing opgebouwd rond uw situatie', 'Volledige transparantie over de voorgestelde voorwaarden', 'Persoonlijk antwoord na analyse'],
      useCases: ['Hergroepering van kredieten', 'Studiefinanciering', 'Eenmalige behoefte', 'Atypisch project'], requiredDocuments: docs,
    },
  },
  faq: [
    { id: 'montants', question: 'Welke bedragen kan ik aanvragen?', answer: `Financieringsaanvragen worden onderzocht voor bedragen van € ${min} tot € ${max}, naargelang het type financiering en uw situatie. Het toegekende bedrag hangt altijd af van de analyse van uw dossier.` },
    { id: 'taux', question: 'Welke rentevoet wordt toegepast?', answer: 'Express Finance past een vaste nominale jaarrentevoet van 2 % toe, met constante maandelijkse aflossingen over de hele looptijd van de lening. De precieze modaliteiten (looptijd, eventuele kosten) worden bevestigd in het aanbod dat u na onderzoek van uw dossier ontvangt.' },
    { id: 'frais', question: 'Zijn er kosten bovenop de rente?', answer: 'Dossierkosten kunnen van toepassing zijn naargelang het type financiering en het toepasselijke wettelijke en contractuele kader. Ze worden altijd schriftelijk meegedeeld vóór de ondertekening: geen verborgen kosten en geen enkele betaling vóór u het aanbod hebt ontvangen.' },
    { id: 'delai', question: 'Hoe lang duurt het onderzoek van een aanvraag?', answer: 'Zodra wij uw volledige dossier hebben ontvangen, bezorgt een adviseur u binnen 48 uur op werkdagen een principieel antwoord. De termijn waarbinnen de fondsen ter beschikking worden gesteld, hangt vervolgens af van het type financiering en van de ondertekening van het aanbod.' },
    { id: 'documents', question: 'Welke documenten moet ik bezorgen?', answer: 'Doorgaans: een geldig identiteitsbewijs, een recent bewijs van woonplaats en inkomensbewijzen. Naargelang het project kunnen bijkomende documenten worden gevraagd (offertes, verkoopcompromis, jaarrekeningen voor ondernemingen).' },
    { id: 'garantie', question: 'Wordt mijn aanvraag automatisch aanvaard?', answer: 'Nee. Elke aanvraag wordt individueel onderzocht. Express Finance behoudt zich het recht voor een aanvraag te aanvaarden of te weigeren na analyse van de situatie van de aanvrager en de haalbaarheid van het project.' },
    { id: 'international', question: 'Kan ik een aanvraag indienen vanuit een ander land?', answer: 'Ja. Express Finance is een internationale financieringsmaatschappij die klanten in Europa en daarbuiten begeleidt. Vermeld uw land van verblijf in het formulier: wij lichten toe welke modaliteiten op uw situatie van toepassing zijn.' },
    { id: 'donnees', question: 'Hoe worden mijn persoonsgegevens beschermd?', answer: 'Uw gegevens worden versleuteld verzonden, opgeslagen op een beveiligde infrastructuur en zijn enkel toegankelijk voor de medewerkers die bevoegd zijn om uw aanvraag te behandelen. Raadpleeg ons privacybeleid voor een overzicht van uw rechten.' },
  ],
  testimonials: [
    { loanType: 'Bedrijfsfinanciering', content: 'Ik had snel werkkapitaal nodig om een grote bestelling te kunnen uitvoeren. Mijn dossier werd in twee dagen behandeld en mijn adviseur heeft elke lijn van het aanbod uitgelegd. Geen verrassingen.' },
    { loanType: 'Persoonlijke lening', content: 'Duidelijke simulatie, eenvoudig formulier en een echte opvolging via WhatsApp. Ik waardeerde dat men mij van in het begin duidelijk zei wat mogelijk was en wat niet.' },
    { loanType: 'Hypothecair krediet', content: 'Wij hebben er de renovatie van ons appartement mee gefinancierd. Het team was vlot bereikbaar, duidelijk over de kosten en snel met antwoorden. Een aanrader.' },
    { loanType: 'Consumentenkrediet', content: 'Mijn wagen gefinancierd zonder gedoe. De maandelijkse aflossingen komen exact overeen met de simulatie op de website.' },
    { loanType: 'Projectfinanciering', content: 'Om mijn activiteit op te starten had ik iemand nodig die mijn businessplan begreep. Luisterbereidheid, nauwkeurigheid en een snel antwoord: precies wat ik nodig had.' },
    { loanType: 'Persoonlijke lening', content: 'Volledig online, documenten in vijf minuten geüpload en na twee dagen een antwoord. Dankzij de vaste rentevoet kon ik mijn budget met een gerust hart plannen.' },
  ],
  legal: {
    mentions: {
      title: 'Wettelijke vermeldingen', description: 'Wettelijke vermeldingen van de website van Express Finance: uitgever, hosting, intellectuele eigendom, aansprakelijkheid.', lastUpdated: updated,
      sections: [
        { heading: '1. Uitgever van de site', paragraphs: [`Deze site wordt uitgegeven door ${company}, internationale financieringsmaatschappij met zetel te ${address}.`], list: [`E-mail: ${email}`, `Telefoon: ${phone}`, 'Verantwoordelijke uitgever: de directie van Express Finance'] },
        { heading: '2. Hosting', paragraphs: ['De site wordt gehost op een Europese cloudinfrastructuur (Vercel Inc. voor de toepassing, Supabase Inc. voor de databank en de beveiligde opslag van documenten), op servers in de Europese Unie.'] },
        { heading: '3. Activiteit', paragraphs: [`${company} biedt financieringsoplossingen — persoonlijke leningen, hypothecaire kredieten, consumentenkredieten, bedrijfs- en projectfinanciering — voor particulieren, zelfstandigen en ondernemingen. Elke aanvraag wordt individueel onderzocht; er wordt geen aanbod uitgebracht zonder voorafgaande analyse van het dossier.`] },
        { heading: '4. Intellectuele eigendom', paragraphs: [`Alle inhoud van de site (teksten, beelden, logo, structuur, code, simulator) is beschermd door het auteursrecht en blijft de exclusieve eigendom van ${company} of haar partners. Elke gehele of gedeeltelijke reproductie, weergave, aanpassing of exploitatie zonder voorafgaande schriftelijke toestemming is verboden en vormt een inbreuk op het auteursrecht.`] },
        { heading: '5. Aansprakelijkheid', paragraphs: [`De informatie op deze site is louter informatief. ${company} streeft ernaar ze juist en actueel te houden, maar kan de volledigheid of de afwezigheid van fouten niet garanderen. Kredietsimulaties zijn indicatief en vormen geen kredietaanbod.`, `${company} kan niet aansprakelijk worden gesteld voor directe of indirecte schade die voortvloeit uit de toegang tot, het gebruik van of de onmogelijkheid om toegang te krijgen tot de site, noch voor de inhoud van sites van derden waarnaar wordt gelinkt.`] },
        { heading: '6. Persoonsgegevens', paragraphs: ['De verwerking van de persoonsgegevens die op deze site worden verzameld, wordt beschreven in het privacybeleid, dat u onderaan elke pagina vindt.'] },
        { heading: '7. Contact', paragraphs: [`Voor elke vraag over de site of de inhoud ervan: ${email}.`] },
      ],
    },
    privacy: {
      title: 'Privacybeleid', description: 'Hoe Express Finance uw persoonsgegevens verzamelt, gebruikt en beschermt in het kader van uw financieringsaanvraag.', lastUpdated: updated,
      sections: [
        { heading: '1. Verwerkingsverantwoordelijke', paragraphs: [`De verwerkingsverantwoordelijke voor de gegevens die via deze site worden verzameld, is ${company}, ${address} — ${email}.`] },
        { heading: '2. Verzamelde gegevens', paragraphs: ['In het kader van een financieringsaanvraag verzamelen wij:'], list: ['Identiteit en contactgegevens: voornaam, familienaam, postadres, e-mailadres, telefoonnummer;', 'Professionele situatie: beroep, statuut, aangegeven maandinkomen;', 'Project: type financiering, bedrag, looptijd, projectbeschrijving;', 'Bewijsstukken: identiteitsbewijs en, in voorkomend geval, bewijzen van woonplaats en inkomen;', 'Technische gegevens: gehashte vingerafdruk van het IP-adres en van de gebruikte browser (beveiliging en fraudepreventie), tijdstip van de gegeven toestemmingen.'], after: ['Er worden geen gevoelige gegevens in de zin van de AVG (gezondheid, overtuigingen, lidmaatschappen) gevraagd.'] },
        { heading: '3. Doeleinden en rechtsgronden', list: ['Onderzoek en behandeling van uw financieringsaanvraag (precontractuele maatregelen op uw verzoek);', 'Contactopname en opvolging van uw dossier via e-mail, telefoon of WhatsApp;', 'Beveiliging van de site, preventie van misbruik en fraude (gerechtvaardigd belang);', 'Naleving van onze wettelijke en reglementaire verplichtingen.'] },
        { heading: '4. Ontvangers', paragraphs: [`Uw gegevens zijn enkel toegankelijk voor de bevoegde medewerkers van ${company} en voor onze technische verwerkers (hosting, databank en beveiligde opslag). Wanneer de structurering van een financiering dit vereist, kunnen de strikt noodzakelijke gegevens worden doorgegeven aan een partnerinstelling, nadat u daarvan op de hoogte werd gebracht. Uw gegevens worden nooit verkocht of voor commerciële doeleinden doorgegeven.`] },
        { heading: '5. Bewaartermijn', paragraphs: ['De gegevens van een aanvraag worden bewaard zolang het onderzoek loopt en daarna, als er geen overeenkomst wordt gesloten, maximaal 12 maanden, waarna ze worden gewist of geanonimiseerd. Bij een toegekende financiering worden ze bewaard voor de duur van de overeenkomst en de toepasselijke wettelijke bewaartermijn (10 jaar voor boekhoudkundige stukken).'] },
        { heading: '6. Beveiliging', paragraphs: ['De gegevens worden versleuteld verzonden (HTTPS) en opgeslagen in een databank die door strikte toegangsregels wordt beschermd. De bewijsstukken worden bewaard in een afgeschermde opslagruimte die enkel toegankelijk is via tijdelijke links die voor bevoegde medewerkers worden aangemaakt.'] },
        { heading: '7. Uw rechten', paragraphs: [`Overeenkomstig de AVG hebt u het recht op inzage, verbetering, wissing, beperking van de verwerking, bezwaar en overdraagbaarheid van uw gegevens, alsook het recht om uw toestemming te allen tijde in te trekken. Om deze rechten uit te oefenen, mailt u naar ${email}. U kunt ook een klacht indienen bij de Belgische Gegevensbeschermingsautoriteit (www.gegevensbeschermingsautoriteit.be) of bij de bevoegde autoriteit van uw land van verblijf.`] },
        { heading: '8. Doorgiften buiten de Europese Unie', paragraphs: ['De gegevens worden gehost in de Europese Unie. Mocht een doorgifte buiten de EU nodig zijn (bv. naar een technische verwerker), dan gebeurt die met passende waarborgen (standaardcontractbepalingen van de Europese Commissie).'] },
        { heading: '9. Cookies', paragraphs: ['Het gebruik van cookies wordt beschreven in ons cookiebeleid.'] },
      ],
    },
    terms: {
      title: 'Algemene gebruiksvoorwaarden', description: 'Algemene gebruiksvoorwaarden van de website van Express Finance en van de dienst voor online financieringsaanvragen.', lastUpdated: updated,
      sections: [
        { heading: '1. Voorwerp', paragraphs: [`Deze voorwaarden regelen het gebruik van de site ${siteConfig.name} en van de dienst voor online financieringsaanvragen. Door de site te gebruiken, aanvaardt u ze zonder voorbehoud.`] },
        { heading: '2. Aard van de dienst', paragraphs: [`Via de site kunt u zich informeren over de aangeboden financieringsoplossingen, een indicatieve simulatie uitvoeren en een financieringsaanvraag indienen. Het indienen van een aanvraag vormt noch een aanbod, noch een kredietovereenkomst: het opent een onderzoeksfase, waarna ${company} de aanvraag kan aanvaarden, weigeren of andere voorwaarden kan voorstellen.`] },
        { heading: '3. Simulator', paragraphs: ['De simulator geeft ramingen die worden berekend op basis van de getoonde parameters (vaste nominale jaarrentevoet van 2 %, looptijd, eventuele kosten). Deze resultaten zijn indicatief en niet-contractueel, en kunnen afwijken van de uiteindelijk voorgestelde voorwaarden.'] },
        { heading: '4. Verplichtingen van de gebruiker', list: ['Juiste, volledige en actuele informatie verstrekken;', 'Enkel documenten bezorgen die u toebehoren of die u mag meedelen;', 'De site niet gebruiken voor frauduleuze, onrechtmatige of illegale doeleinden;', 'De beveiliging of de werking van de site niet proberen te verstoren.'] },
        { heading: '5. Kosten', paragraphs: ['Het gebruik van de site en het indienen van een aanvraag zijn gratis. Dossierkosten kunnen van toepassing zijn op de financiering zelf, wanneer dat wettelijk en contractueel voorzien is; ze worden schriftelijk meegedeeld vóór u zich verbindt. Er wordt geen betaling gevraagd vóór u het aanbod hebt ontvangen.'] },
        { heading: '6. Aansprakelijkheid', paragraphs: [`${company} neemt redelijke maatregelen om de beschikbaarheid en de beveiliging van de site te waarborgen, zonder garantie op een ononderbroken werking. Zij kan niet aansprakelijk worden gesteld voor indirecte schade die voortvloeit uit het gebruik van de site of uit de onmogelijkheid om er toegang toe te krijgen.`] },
        { heading: '7. Intellectuele eigendom', paragraphs: ['Zie de wettelijke vermeldingen.'] },
        { heading: '8. Persoonsgegevens', paragraphs: ['De verwerking van uw gegevens wordt beschreven in het privacybeleid.'] },
        { heading: '9. Toepasselijk recht en bevoegde rechtbank', paragraphs: ['Deze voorwaarden zijn onderworpen aan het Belgische recht. Elk geschil over de interpretatie of de uitvoering ervan valt onder de bevoegdheid van de rechtbanken van Brussel, onverminderd de dwingende consumentenbeschermende bepalingen die van toepassing zijn in uw land van verblijf.'] },
      ],
    },
    cookies: {
      title: 'Cookiebeleid', description: 'Informatie over de cookies en trackers die de website van Express Finance gebruikt.', lastUpdated: updated,
      sections: [
        { heading: '1. Wat is een cookie?', paragraphs: ['Een cookie is een klein bestand dat bij het bezoek aan een site op uw toestel wordt geplaatst. Het maakt het onder meer mogelijk een sessie in stand te houden of voorkeuren te onthouden.'] },
        { heading: '2. Cookies op deze site', paragraphs: ['De publieke site gebruikt geen advertentiecookies en geen analysecookies van derden. De enige cookies die worden geplaatst, zijn strikt noodzakelijk:'], list: ['Sessiecookies voor het beheer: worden enkel geplaatst bij het aanmelden op de beheeromgeving die voorbehouden is aan de medewerkers van Express Finance. Ze hebben geen betrekking op bezoekers.', 'Anti-robotcontrole: een technisch token kan worden gebruikt tijdens de verificatie bij het verzenden van het aanvraagformulier.'], after: ['Aangezien deze cookies strikt noodzakelijk zijn voor de werking van de dienst, is er geen voorafgaande toestemming vereist.'] },
        { heading: '3. Simulator', paragraphs: ['De simulator werkt volledig in uw browser en bewaart uw parameters niet nadat u de pagina hebt gesloten.'] },
        { heading: '4. Beheer van cookies', paragraphs: ['U kunt uw browser zo instellen dat cookies worden geweigerd of verwijderd. Het blokkeren van strikt noodzakelijke cookies kan de toegang tot de beheeromgeving verhinderen.'] },
      ],
    },
    disclaimer: {
      title: 'Waarschuwing over leningen', description: 'Belangrijke informatie vóór elke financieringsaanvraag: indicatieve simulatie, dossieronderzoek, terugbetalingsverbintenis.', lastUpdated: updated,
      sections: [
        { heading: 'Een krediet is een verbintenis', paragraphs: ['Let op, geld lenen kost ook geld. Ga vóór u zich verbindt na of u de financiering kunt terugbetalen en of de maandelijkse aflossingen gedurende de hele looptijd binnen uw budget passen.'] },
        { heading: 'Indicatieve simulaties', paragraphs: [`De resultaten van de simulator zijn ramingen die worden berekend op basis van de getoonde parameters. Ze vormen noch een aanbod, noch een financieringsbelofte, noch een verbintenis van ${company}. De definitieve voorwaarden (rentevoet, looptijd, kosten, waarborgen) worden vastgelegd in het schriftelijke aanbod dat u na volledig onderzoek van uw dossier ontvangt.`] },
        { heading: 'Individueel onderzoek', paragraphs: [`Elke aanvraag wordt individueel onderzocht. ${company} behoudt zich het recht voor een financiering te weigeren of de voorwaarden ervan na onderzoek aan te passen.`] },
        { heading: 'Kosten en boetes', paragraphs: ['Dossierkosten kunnen van toepassing zijn wanneer dat wettelijk en contractueel voorzien is; ze worden meegedeeld vóór u zich verbindt. Bij laattijdige betaling zijn boetes verschuldigd overeenkomstig de overeenkomst. De bedragen die de boetesimulator toont, zijn ramingen en hangen af van de toepasselijke contractuele voorwaarden.'] },
        { heading: 'Waakzaamheid', paragraphs: [`${company} zal u nooit vragen om uw bankgegevens via e-mail of bericht mee te delen, noch om een bedrag te betalen vóór u een schriftelijk aanbod hebt ontvangen. Twijfelt u aan de echtheid van een bericht? Neem dan rechtstreeks contact met ons op via de officiële contactgegevens op deze site.`] },
      ],
    },
  },
};
