import { siteConfig, formatAddressOneLine } from '@/lib/config/site';
import { loanLimits } from '@/lib/config/loans';
import type { LocaleContent } from './types';

const company = siteConfig.legalName;
const address = formatAddressOneLine();
const email = siteConfig.contact.email;
const phone = siteConfig.contact.phoneDisplay;
const min = loanLimits.minAmount.toLocaleString('sk-SK');
const max = loanLimits.maxAmount.toLocaleString('sk-SK');
const docs = ['Platný doklad totožnosti (občiansky preukaz alebo cestovný pas)', 'Doklad o adrese nie starší ako 3 mesiace', 'Doklady o príjme (posledné 3 výplatné pásky alebo daňové priznanie)'];
const updated = '26. septembra 2026';

export const sk: LocaleContent = {
  products: {
    'pret-personnel': {
      name: 'Osobná pôžička', shortName: 'Osobná', tagline: 'Financujte svoje plány bez obmedzení.',
      description: 'Flexibilné bezúčelové financovanie na realizáciu osobných plánov: cestovanie, svadba, štúdium, nečakané výdavky alebo finančná rezerva.',
      longDescription: 'Osobná pôžička Express Finance vám umožňuje požičať si stanovenú sumu, ktorú splácate v rovnakých mesačných splátkach počas doby splácania podľa vášho výberu. Prostriedky použijete podľa vlastného uváženia a od podania žiadosti až po vyplatenie máte k dispozícii osobného poradcu.',
      keyConditions: ['Rovnaké mesačné splátky počas celej doby splácania', 'Bez obmedzenia účelu použitia prostriedkov', 'Individuálne posúdenie každej žiadosti', 'Možnosť predčasného splatenia za zmluvných podmienok'],
      useCases: ['Osobná rezerva', 'Rodinná udalosť', 'Štúdium a vzdelávanie', 'Cestovanie'], requiredDocuments: docs,
    },
    'credit-immobilier': {
      name: 'Hypotekárny úver', shortName: 'Hypotéka', tagline: 'Splňte si svoj sen o bývaní.',
      description: 'Kúpa, výstavba, rekonštrukcia alebo investícia do nehnuteľnosti na prenájom: štruktúrované financovanie nehnuteľnosti prispôsobené vašej situácii.',
      longDescription: 'Náš hypotekárny úver je určený na kúpu nehnuteľnosti na trvalé alebo rekreačné bývanie, výstavbu, rekonštrukciu alebo investíciu do nehnuteľnosti na prenájom. Každú žiadosť dôkladne analyzujeme, aby sme navrhli plán financovania zodpovedajúci vašej schopnosti splácať.',
      keyConditions: ['Financovanie kúpy, výstavby alebo rekonštrukcie', 'Dlhá doba splácania podľa charakteru projektu', 'Podrobná analýza plánu financovania', 'Zabezpečenie sa určuje pri posúdení žiadosti'],
      useCases: ['Vlastné bývanie', 'Investícia na prenájom', 'Rekonštrukcia', 'Výstavba'], requiredDocuments: [...docs, 'Zmluva o budúcej kúpnej zmluve, cenová ponuka alebo opis realitného projektu'],
    },
    'credit-consommation': {
      name: 'Spotrebiteľský úver', shortName: 'Spotrebiteľský', tagline: 'Kúpte si, čo potrebujete, bez čakania.',
      description: 'Vozidlo, vybavenie domácnosti, spotrebiče, rekonštrukčné práce: financovanie určené na kúpu konkrétneho tovaru alebo služby.',
      longDescription: 'Spotrebiteľský úver financuje konkrétny nákup — vozidlo, nábytok, vybavenie, rekonštrukčné práce. Výška úveru a doba splácania sa prispôsobujú hodnote tovaru a vášmu mesačnému rozpočtu.',
      keyConditions: ['Financovanie viazané na konkrétny nákup', 'Mesačné splátky prispôsobené vášmu rozpočtu', 'Vyžaduje sa doklad o kúpe (cenová ponuka alebo faktúra)', 'Konečné podmienky sa stanovia po posúdení žiadosti'],
      useCases: ['Vozidlo', 'Rekonštrukčné práce', 'Vybavenie', 'Nábytok'], requiredDocuments: [...docs, 'Cenová ponuka alebo objednávka financovaného tovaru'],
    },
    'financement-professionnel': {
      name: 'Podnikateľské financovanie', shortName: 'Podnikateľské', tagline: 'Podporte rast svojej firmy.',
      description: 'Prevádzkový kapitál, investície, vybavenie, obchodný rozvoj: riešenia financovania pre živnostníkov, mikropodniky, malé a stredné podniky.',
      longDescription: 'Express Finance podporuje podnikateľov, živnostníkov a firmy pri financovaní ich potrieb: posilnenie likvidity, nákup vybavenia, rozvoj činnosti alebo prevzatie firmy. Žiadosť sa posudzuje na základe finančných výkazov firmy.',
      keyConditions: ['Určené pre živnostníkov, mikropodniky a MSP', 'Financovanie likvidity alebo investícií', 'Analýza finančných výkazov firmy', 'Splátkový kalendár prispôsobený cyklu podnikania'],
      useCases: ['Prevádzkový kapitál', 'Stroje a vybavenie', 'Obchodný rozvoj', 'Prevzatie činnosti'],
      requiredDocuments: ['Doklad totožnosti konateľa', 'Výpis z obchodného registra alebo obdobný doklad', 'Posledné účtovné závierky', 'Aktuálne výpisy z firemného bankového účtu'],
    },
    'financement-de-projet': {
      name: 'Projektové financovanie', shortName: 'Projekt', tagline: 'Premeňte nápad na skutočnosť.',
      description: 'Rozbeh podnikania, inovačný, poľnohospodársky, realitný alebo priemyselný projekt: financovanie postavené na vašom podnikateľskom pláne.',
      longDescription: 'Projektové financovanie je určené pre predkladateľov premyslených projektov s jasným plánom: založenie podnikania, vývoj produktu, poľnohospodársky, energetický alebo priemyselný projekt. Posudzujeme životaschopnosť projektu, jeho harmonogram a schopnosť generovať príjmy na splácanie.',
      keyConditions: ['Vyžaduje sa dokumentácia projektu', 'Posúdenie životaschopnosti a harmonogramu', 'Možnosť čerpania financovania po etapách', 'Osobná podpora počas celého posudzovania'],
      useCases: ['Založenie podnikania', 'Poľnohospodársky projekt', 'Energetický projekt', 'Vývoj produktu'],
      requiredDocuments: ['Doklad totožnosti predkladateľa projektu', 'Prezentácia projektu / podnikateľský plán', 'Finančný výhľad', 'Doklady o prípadných vlastných zdrojoch'],
    },
    'autres-solutions': {
      name: 'Ďalšie riešenia financovania', shortName: 'Na mieru', tagline: 'Máte špecifickú potrebu? Porozprávajme sa.',
      description: 'Konsolidácia pôžičiek, financovanie štúdia, netypická situácia: posudzujeme aj žiadosti, ktoré nepatria do bežných kategórií.',
      longDescription: 'Niektoré situácie si vyžadujú prístup na mieru: konsolidácia pôžičiek, financovanie štúdia, jednorazová potreba alebo netypický projekt. Opíšte nám svoju potrebu a náš tím posúdi, či je možné pripraviť vhodné riešenie.',
      keyConditions: ['Individuálne posúdenie každého prípadu', 'Riešenie šité na mieru vašej situácii', 'Úplná transparentnosť navrhovaných podmienok', 'Individuálna odpoveď po analýze'],
      useCases: ['Konsolidácia pôžičiek', 'Financovanie štúdia', 'Jednorazová potreba', 'Netypický projekt'], requiredDocuments: docs,
    },
  },
  faq: [
    { id: 'montants', question: 'O aké sumy môžem požiadať?', answer: `Žiadosti o financovanie sa posudzujú pre sumy od ${min} € do ${max} €, podľa typu financovania a vašej situácie. Schválená suma vždy závisí od analýzy vašej žiadosti.` },
    { id: 'taux', question: 'Aká sadzba sa uplatňuje?', answer: 'Express Finance uplatňuje fixnú nominálnu ročnú úrokovú sadzbu 2 % s rovnakými mesačnými splátkami počas celej doby splácania. Presné podmienky (doba splácania, prípadné poplatky) sú potvrdené v ponuke vydanej po posúdení vašej žiadosti.' },
    { id: 'frais', question: 'Sú okrem úrokov aj poplatky?', answer: 'V závislosti od typu financovania a platného právneho a zmluvného rámca sa môžu uplatniť poplatky za spracovanie. Vždy vám ich písomne oznámime pred podpisom zmluvy: žiadne skryté poplatky, žiadna platba pred vydaním ponuky.' },
    { id: 'delai', question: 'Ako dlho trvá posúdenie žiadosti?', answer: 'Po prijatí kompletnej žiadosti vám poradca do 48 pracovných hodín poskytne predbežnú odpoveď. Termín vyplatenia prostriedkov potom závisí od typu financovania a od podpisu ponuky.' },
    { id: 'documents', question: 'Aké dokumenty musím predložiť?', answer: 'Spravidla: platný doklad totožnosti, aktuálny doklad o adrese a doklady o príjme. V závislosti od projektu si môžeme vyžiadať ďalšie doklady (cenové ponuky, zmluvu o budúcej kúpnej zmluve, účtovné závierky v prípade firiem).' },
    { id: 'garantie', question: 'Je moja žiadosť schválená automaticky?', answer: 'Nie. Každá žiadosť sa posudzuje individuálne. Express Finance si vyhradzuje právo žiadosť prijať alebo zamietnuť po analýze situácie žiadateľa a uskutočniteľnosti projektu.' },
    { id: 'international', question: 'Môžem požiadať z inej krajiny?', answer: 'Áno. Express Finance je medzinárodná finančná spoločnosť, ktorá poskytuje financovanie klientom v Európe aj mimo nej. Vo formulári uveďte krajinu svojho pobytu: upresníme vám podmienky platné pre vašu situáciu.' },
    { id: 'donnees', question: 'Ako sú chránené moje osobné údaje?', answer: 'Vaše údaje sa prenášajú šifrovane, ukladajú na bezpečnej infraštruktúre a sú prístupné len osobám oprávneným spracovať vašu žiadosť. Podrobnosti o vašich právach nájdete v našich zásadách ochrany osobných údajov.' },
  ],
  testimonials: [
    { loanType: 'Podnikateľské financovanie', content: 'Potreboval som rýchlo likviditu na veľkú objednávku. Žiadosť bola posúdená za dva dni a poradca mi vysvetlil každý riadok ponuky. Žiadne prekvapenia.' },
    { loanType: 'Osobná pôžička', content: 'Prehľadná simulácia, jednoduchý formulár a skutočný kontakt s poradcom cez WhatsApp. Ocenil som, že mi od začiatku povedali, čo je možné a čo nie.' },
    { loanType: 'Hypotekárny úver', content: 'Financovali sme rekonštrukciu bytu. Tím bol k dispozícii, v otázke poplatkov úplne jasný a odpovedal rýchlo. Odporúčam.' },
    { loanType: 'Spotrebiteľský úver', content: 'Financovanie auta bez komplikácií. Mesačné splátky presne zodpovedajú simulácii na webovej stránke.' },
    { loanType: 'Projektové financovanie', content: 'Na rozbeh podnikania som potreboval partnera, ktorý rozumie môjmu podnikateľskému plánu. Ochota počúvať, dôslednosť a rýchla odpoveď: presne to, čo som potreboval.' },
    { loanType: 'Osobná pôžička', content: 'Celý proces online, dokumenty nahrané za päť minút a odpoveď do dvoch dní. Vďaka fixnej sadzbe som si mohol pokojne naplánovať rozpočet.' },
  ],
  legal: {
    mentions: {
      title: 'Právne upozornenie', description: 'Právne upozornenie webovej stránky Express Finance: vydavateľ, hosting, duševné vlastníctvo, zodpovednosť.', lastUpdated: updated,
      sections: [
        { heading: '1. Vydavateľ stránky', paragraphs: [`Túto stránku vydáva ${company}, medzinárodná finančná spoločnosť so sídlom na adrese ${address}.`], list: [`E-mail: ${email}`, `Telefón: ${phone}`, 'Osoba zodpovedná za obsah: vedenie Express Finance'] },
        { heading: '2. Hosting', paragraphs: ['Stránka je hostovaná na európskej cloudovej infraštruktúre (Vercel Inc. pre aplikáciu, Supabase Inc. pre databázu a zabezpečené úložisko dokumentov) na serveroch v Európskej únii.'] },
        { heading: '3. Činnosť', paragraphs: [`${company} ponúka riešenia financovania — osobné pôžičky, hypotéky, spotrebiteľské úvery, financovanie podnikov a projektov — pre súkromné osoby, živnostníkov a firmy. Každá žiadosť sa posudzuje individuálne; žiadna ponuka sa nevydáva bez predchádzajúcej analýzy žiadosti.`] },
        { heading: '4. Duševné vlastníctvo', paragraphs: [`Celý obsah stránky (texty, vizuály, logo, štruktúra, kód, simulátor) je chránený autorským právom a zostáva výlučným vlastníctvom spoločnosti ${company} alebo jej partnerov. Akékoľvek rozmnožovanie, zobrazovanie, úprava alebo použitie, vcelku alebo sčasti, bez predchádzajúceho písomného súhlasu je zakázané a predstavuje porušenie práv.`] },
        { heading: '5. Zodpovednosť', paragraphs: [`Informácie zverejnené na tejto stránke majú informatívny charakter. ${company} sa usiluje o ich presnosť a aktuálnosť, nemôže však zaručiť ich úplnosť ani bezchybnosť. Simulácie pôžičiek sú orientačné a nepredstavujú ponuku úveru.`, `${company} nezodpovedá za priame ani nepriame škody vzniknuté prístupom na stránku, jej používaním alebo nemožnosťou prístupu, ani za obsah stránok tretích strán, na ktoré môže odkazovať.`] },
        { heading: '6. Osobné údaje', paragraphs: ['Spracovanie osobných údajov zhromaždených na tejto stránke je opísané v zásadách ochrany osobných údajov, dostupných v päte stránky.'] },
        { heading: '7. Kontakt', paragraphs: [`Pre akékoľvek otázky týkajúce sa stránky alebo jej obsahu: ${email}.`] },
      ],
    },
    privacy: {
      title: 'Zásady ochrany osobných údajov', description: 'Ako Express Finance zhromažďuje, používa a chráni vaše osobné údaje v rámci vašej žiadosti o financovanie.', lastUpdated: updated,
      sections: [
        { heading: '1. Prevádzkovateľ', paragraphs: [`Prevádzkovateľom údajov zhromaždených prostredníctvom tejto stránky je ${company}, ${address} — ${email}.`] },
        { heading: '2. Zhromažďované údaje', paragraphs: ['V rámci žiadosti o financovanie zhromažďujeme:'], list: ['Identifikačné a kontaktné údaje: meno, priezvisko, poštovú adresu, e-mail, telefón;', 'Pracovnú situáciu: povolanie, pracovný status, deklarovaný mesačný príjem;', 'Projekt: typ financovania, sumu, dobu splácania, opis projektu;', 'Dokumenty: doklad totožnosti a prípadne doklady o adrese a príjme;', 'Technické údaje: hashovaný odtlačok IP adresy a použitého prehliadača (bezpečnosť a prevencia podvodov), časové pečiatky súhlasov.'], after: ['Citlivé údaje v zmysle GDPR (zdravotný stav, názory, príslušnosť) sa nevyžadujú.'] },
        { heading: '3. Účely a právne základy', list: ['Posúdenie a spracovanie vašej žiadosti o financovanie (predzmluvné opatrenia na vašu žiadosť);', 'Kontakt a sledovanie žiadosti e-mailom, telefonicky alebo cez WhatsApp;', 'Bezpečnosť stránky, prevencia zneužitia a podvodov (oprávnený záujem);', 'Plnenie našich zákonných a regulačných povinností.'] },
        { heading: '4. Príjemcovia', paragraphs: [`Vaše údaje sú prístupné len oprávneným zamestnancom spoločnosti ${company} a našim technickým sprostredkovateľom (hosting, databáza a bezpečné úložisko). Ak si to vyžaduje štruktúra financovania, môžu byť nevyhnutne potrebné údaje po predchádzajúcom upovedomení poskytnuté partnerskej inštitúcii. Žiadne údaje sa nepredávajú ani neposkytujú na komerčné účely.`] },
        { heading: '5. Doba uchovávania', paragraphs: ['Údaje zo žiadosti sa uchovávajú počas jej posudzovania a následne, ak nedôjde k uzavretiu zmluvy, najviac 12 mesiacov; potom sa vymažú alebo anonymizujú. V prípade schváleného financovania sa uchovávajú počas trvania zmluvy a počas zákonom stanovenej doby uchovávania (10 rokov pri účtovných dokladoch).'] },
        { heading: '6. Bezpečnosť', paragraphs: ['Údaje sa prenášajú šifrovane (HTTPS) a ukladajú v databáze chránenej prísnymi pravidlami prístupu; dokumenty sú uložené v súkromnom úložisku, prístupnom len prostredníctvom dočasných odkazov generovaných pre oprávnené osoby.'] },
        { heading: '7. Vaše práva', paragraphs: [`V súlade s GDPR máte právo na prístup, opravu, vymazanie, obmedzenie, námietku a prenosnosť svojich údajov, ako aj právo kedykoľvek odvolať súhlas. Na uplatnenie týchto práv: ${email}. Sťažnosť môžete podať aj belgickému Úradu na ochranu údajov (www.autoriteprotectiondonnees.be) alebo príslušnému úradu v krajine vášho pobytu.`] },
        { heading: '8. Prenosy mimo Európskej únie', paragraphs: ['Údaje sú uložené v Európskej únii. Ak by bol potrebný prenos mimo EÚ (napr. technickému sprostredkovateľovi), uskutočnil by sa s primeranými zárukami (štandardné zmluvné doložky Európskej komisie).'] },
        { heading: '9. Cookies', paragraphs: ['Používanie cookies je opísané v našich zásadách používania cookies.'] },
      ],
    },
    terms: {
      title: 'Všeobecné podmienky používania', description: 'Všeobecné podmienky používania webovej stránky Express Finance a služby online podania žiadosti o financovanie.', lastUpdated: updated,
      sections: [
        { heading: '1. Predmet', paragraphs: [`Tieto podmienky upravujú používanie stránky ${siteConfig.name} a služby online podania žiadosti o financovanie. Používaním stránky ich bez výhrad prijímate.`] },
        { heading: '2. Povaha služby', paragraphs: [`Stránka umožňuje informovať sa o ponúkaných riešeniach financovania, vykonať orientačnú simuláciu a podať žiadosť o financovanie. Podaním žiadosti nevzniká ponuka ani úverová zmluva: žiadosť otvára fázu posúdenia, po ktorej ju môže ${company} prijať, zamietnuť alebo navrhnúť iné podmienky.`] },
        { heading: '3. Simulátor', paragraphs: ['Simulátor poskytuje odhady vypočítané zo zobrazených parametrov (fixná nominálna ročná sadzba 2 %, doba splácania, prípadné poplatky). Tieto výsledky sú orientačné, nezáväzné a môžu sa líšiť od podmienok, ktoré vám budú napokon navrhnuté.'] },
        { heading: '4. Povinnosti používateľa', list: ['Poskytovať presné, úplné a aktuálne informácie;', 'Predkladať len dokumenty, ktoré vám patria alebo ktoré ste oprávnení poskytnúť;', 'Nepoužívať stránku na podvodné, zneužívajúce alebo nezákonné účely;', 'Nepokúšať sa narušiť bezpečnosť alebo fungovanie stránky.'] },
        { heading: '5. Poplatky', paragraphs: ['Používanie stránky a podanie žiadosti sú bezplatné. Na samotné financovanie sa môžu vzťahovať poplatky za spracovanie, ak sú zákonne a zmluvne stanovené; oznamujeme ich písomne ešte pred každým záväzkom. Pred vydaním ponuky sa nevyžaduje žiadna platba.'] },
        { heading: '6. Zodpovednosť', paragraphs: [`${company} prijíma primerané opatrenia na zabezpečenie dostupnosti a bezpečnosti stránky, bez záruky nepretržitej prevádzky. Nezodpovedá za nepriame škody vzniknuté používaním stránky alebo nemožnosťou prístupu.`] },
        { heading: '7. Duševné vlastníctvo', paragraphs: ['Pozri právne upozornenie.'] },
        { heading: '8. Osobné údaje', paragraphs: ['Spracovanie vašich údajov je opísané v zásadách ochrany osobných údajov.'] },
        { heading: '9. Rozhodné právo a súdna právomoc', paragraphs: ['Tieto podmienky sa riadia belgickým právom. Všetky spory týkajúce sa ich výkladu alebo plnenia patria do právomoci súdov v Bruseli, s výhradou kogentných ustanovení na ochranu spotrebiteľa platných v krajine vášho pobytu.'] },
      ],
    },
    cookies: {
      title: 'Zásady používania cookies', description: 'Informácie o cookies a sledovacích nástrojoch používaných webovou stránkou Express Finance.', lastUpdated: updated,
      sections: [
        { heading: '1. Čo je cookie?', paragraphs: ['Cookie je malý súbor, ktorý sa pri návšteve stránky uloží vo vašom zariadení. Slúži najmä na udržiavanie relácie alebo zapamätanie nastavení.'] },
        { heading: '2. Cookies používané na tejto stránke', paragraphs: ['Verejná stránka nepoužíva žiadne reklamné cookies ani analytické cookies tretích strán. Jediné ukladané cookies sú nevyhnutne potrebné:'], list: ['Cookies administrátorskej relácie: ukladajú sa len pri prihlásení do oblasti vyhradenej pre zamestnancov Express Finance. Netýkajú sa návštevníkov.', 'Overenie proti robotom: počas overovania pri odosielaní formulára žiadosti sa môže použiť technický token.'], after: ['Keďže sú tieto cookies nevyhnutne potrebné na fungovanie služby, nevyžadujú predchádzajúci súhlas.'] },
        { heading: '3. Simulátor', paragraphs: ['Simulátor funguje výlučne vo vašom prehliadači a po zatvorení stránky neuchováva vaše parametre.'] },
        { heading: '4. Správa cookies', paragraphs: ['Prehliadač môžete nastaviť tak, aby cookies odmietal alebo mazal. Blokovanie nevyhnutne potrebných cookies môže zabrániť prístupu do administrátorskej oblasti.'] },
      ],
    },
    disclaimer: {
      title: 'Upozornenie o pôžičkách', description: 'Dôležité informácie pred podaním žiadosti o financovanie: orientačná simulácia, posúdenie žiadosti, záväzok splácania.', lastUpdated: updated,
      sections: [
        { heading: 'Úver vás zaväzuje', paragraphs: ['Požičať si peniaze tiež niečo stojí. Pred prijatím záväzku si overte svoju schopnosť splácať a uistite sa, že mesačné splátky zvládnete v rámci svojho rozpočtu počas celej doby financovania.'] },
        { heading: 'Orientačné simulácie', paragraphs: [`Výsledky simulátora sú odhady vypočítané zo zobrazených parametrov. Nepredstavujú ponuku, prísľub financovania ani záväzok spoločnosti ${company}. Konečné podmienky (sadzba, doba splácania, poplatky, zabezpečenie) sú uvedené v písomnej ponuke vydanej po úplnom posúdení žiadosti.`] },
        { heading: 'Individuálne posúdenie', paragraphs: [`Každá žiadosť sa posudzuje individuálne. ${company} si vyhradzuje právo financovanie zamietnuť alebo po posúdení zmeniť jeho podmienky.`] },
        { heading: 'Poplatky a sankcie', paragraphs: ['Poplatky za spracovanie sa môžu uplatniť, ak sú zákonne a zmluvne stanovené; oznamujeme ich ešte pred každým záväzkom. V prípade omeškania s úhradou splátky sa uplatňujú sankcie podľa zmluvy. Sumy zobrazené simulátorom sankcií sú orientačné a závisia od platných zmluvných podmienok.'] },
        { heading: 'Obozretnosť', paragraphs: [`${company} od vás nikdy nebude žiadať bankové prihlasovacie údaje e-mailom alebo správou, ani úhradu akejkoľvek sumy pred vydaním písomnej ponuky. V prípade pochybností o pravosti komunikácie nás kontaktujte priamo prostredníctvom oficiálnych kontaktných údajov uvedených na tejto stránke.`] },
      ],
    },
  },
};
