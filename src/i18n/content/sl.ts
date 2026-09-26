import { siteConfig, formatAddressOneLine } from '@/lib/config/site';
import { loanLimits } from '@/lib/config/loans';
import type { LocaleContent } from './types';

const company = siteConfig.legalName;
const address = formatAddressOneLine();
const email = siteConfig.contact.email;
const phone = siteConfig.contact.phoneDisplay;
const min = loanLimits.minAmount.toLocaleString('sl-SI');
const max = loanLimits.maxAmount.toLocaleString('sl-SI');
const docs = ['Veljaven osebni dokument (osebna izkaznica ali potni list)', 'Dokazilo o naslovu, ne starejše od 3 mesecev', 'Dokazila o dohodku (zadnje 3 plačilne liste ali odločba o odmeri dohodnine)'];
const updated = '26. september 2026';

export const sl: LocaleContent = {
  products: {
    'pret-personnel': {
      name: 'Osebno posojilo', shortName: 'Osebno', tagline: 'Svobodno financirajte svoje osebne projekte.',
      description: 'Prilagodljivo, nenamensko financiranje za uresničitev osebnih projektov: potovanje, poroka, študij, nepričakovani stroški ali potreba po likvidnosti.',
      longDescription: 'Z osebnim posojilom Express Finance si izposodite določen znesek, ki ga odplačujete v enakih mesečnih obrokih v ročnosti po lastni izbiri. Sredstva porabite po svojih željah, osebni svetovalec pa vas spremlja od oddaje vloge do izplačila.',
      keyConditions: ['Enaki mesečni obroki ves čas odplačevanja', 'Brez omejitev glede namena porabe sredstev', 'Posamična obravnava vsake vloge', 'Predčasno odplačilo mogoče pod pogoji iz pogodbe'],
      useCases: ['Osebna likvidnost', 'Družinski dogodek', 'Študij in izobraževanje', 'Potovanje'], requiredDocuments: docs,
    },
    'credit-immobilier': {
      name: 'Stanovanjsko posojilo', shortName: 'Stanovanjsko', tagline: 'Uresničite svoj nepremičninski projekt.',
      description: 'Nakup, gradnja, prenova ali nakup nepremičnine za oddajo: strukturirano nepremičninsko financiranje, prilagojeno vašemu položaju.',
      longDescription: 'S stanovanjskim posojilom financiramo nakup primarnega ali sekundarnega prebivališča, gradnjo, prenovo ali nakup nepremičnine za oddajo. Vsako vlogo temeljito preučimo in predlagamo načrt financiranja, skladen z vašo sposobnostjo odplačevanja.',
      keyConditions: ['Financiranje nakupa, gradnje ali prenove', 'Daljše ročnosti glede na projekt', 'Podrobna analiza načrta financiranja', 'Zavarovanja se določijo ob pregledu vloge'],
      useCases: ['Primarno prebivališče', 'Nepremičnina za oddajo', 'Prenova', 'Gradnja'], requiredDocuments: [...docs, 'Predpogodba, ponudba ali opis nepremičninskega projekta'],
    },
    'credit-consommation': {
      name: 'Potrošniški kredit', shortName: 'Potrošniški', tagline: 'Kupite, kar potrebujete, brez čakanja.',
      description: 'Vozilo, oprema, gospodinjski aparati, obnovitvena dela: financiranje, namenjeno nakupu določenega blaga ali storitve.',
      longDescription: 'S potrošniškim kreditom financirate določen nakup — vozilo, pohištvo, opremo ali obnovitvena dela. Znesek in ročnost prilagodimo vrednosti blaga in vašemu mesečnemu proračunu.',
      keyConditions: ['Financiranje, vezano na določen nakup', 'Mesečni obroki, prilagojeni vašemu proračunu', 'Potrebno dokazilo o nakupu (predračun ali račun)', 'Končni pogoji določeni po pregledu vloge'],
      useCases: ['Vozilo', 'Obnovitvena dela', 'Oprema', 'Pohištvo'], requiredDocuments: [...docs, 'Predračun ali naročilnica za financirano blago'],
    },
    'financement-professionnel': {
      name: 'Poslovno financiranje', shortName: 'Poslovno', tagline: 'Podprite rast svojega podjetja.',
      description: 'Likvidnost, naložbe, oprema, širitev poslovanja: rešitve financiranja za samozaposlene, mikro ter mala in srednja podjetja.',
      longDescription: 'Express Finance podpira podjetnike, samozaposlene in gospodarske družbe pri njihovih potrebah po financiranju: krepitvi likvidnosti, nakupu opreme, širitvi dejavnosti ali prevzemu podjetja. Vlogo obravnavamo na podlagi finančnih podatkov podjetja.',
      keyConditions: ['Za samozaposlene, mikro, mala in srednja podjetja', 'Financiranje likvidnosti ali naložb', 'Analiza finančnih dokumentov podjetja', 'Načrt odplačevanja, prilagojen poslovnemu ciklu'],
      useCases: ['Likvidnost', 'Stroji in oprema', 'Širitev poslovanja', 'Prevzem podjetja'],
      requiredDocuments: ['Osebni dokument zakonitega zastopnika', 'Izpis iz poslovnega registra ali enakovreden dokument', 'Zadnji računovodski izkazi ali letna poročila', 'Izpiski poslovnega računa za zadnje mesece'],
    },
    'financement-de-projet': {
      name: 'Projektno financiranje', shortName: 'Projekt', tagline: 'Spremenite idejo v resničnost.',
      description: 'Zagon dejavnosti, inovativni, kmetijski, nepremičninski ali industrijski projekt: financiranje, zasnovano na podlagi vašega poslovnega načrta.',
      longDescription: 'Projektno financiranje je namenjeno nosilcem strukturiranih projektov z jasnim načrtom: ustanovitev dejavnosti, razvoj izdelka, kmetijski, energetski ali industrijski projekt. Pregled zajema izvedljivost projekta, njegov časovni načrt in sposobnost ustvarjanja denarnih tokov za odplačilo.',
      keyConditions: ['Potrebna je predstavitev projekta', 'Pregled izvedljivosti in časovnega načrta', 'Financiranje se lahko izplača po fazah', 'Osebna podpora ves čas obravnave'],
      useCases: ['Ustanovitev dejavnosti', 'Kmetijski projekt', 'Energetski projekt', 'Razvoj izdelka'],
      requiredDocuments: ['Osebni dokument nosilca projekta', 'Predstavitev projekta / poslovni načrt', 'Finančne projekcije', 'Dokazila o morebitnih lastnih sredstvih'],
    },
    'autres-solutions': {
      name: 'Druge rešitve financiranja', shortName: 'Po meri', tagline: 'Posebna potreba? Pogovorimo se.',
      description: 'Združevanje posojil, financiranje študija, neobičajen položaj: obravnavamo tudi vloge, ki ne sodijo v običajne kategorije.',
      longDescription: 'Nekateri položaji zahtevajo pristop po meri: združevanje posojil, financiranje študija, enkratna potreba ali neobičajen projekt. Opišite nam svoje potrebe in naša ekipa bo ocenila, katera rešitev je izvedljiva.',
      keyConditions: ['Obravnava vsakega primera posebej', 'Rešitev, prilagojena vašemu položaju', 'Popolna preglednost predlaganih pogojev', 'Osebni odgovor po opravljeni analizi'],
      useCases: ['Združevanje posojil', 'Financiranje študija', 'Enkratna potreba', 'Neobičajen projekt'], requiredDocuments: docs,
    },
  },
  faq: [
    { id: 'montants', question: 'Za katere zneske lahko zaprosim?', answer: `Vloge za financiranje obravnavamo za zneske med ${min} € in ${max} €, odvisno od vrste financiranja in vašega položaja. Odobreni znesek je vedno odvisen od analize vaše vloge.` },
    { id: 'taux', question: 'Katera obrestna mera velja?', answer: 'Express Finance uporablja fiksno nominalno letno obrestno mero 2 % z enakimi mesečnimi obroki ves čas trajanja posojila. Natančni pogoji (ročnost, morebitni stroški) so potrjeni v ponudbi, izdani po pregledu vaše vloge.' },
    { id: 'frais', question: 'Ali so poleg obresti še kakšni stroški?', answer: 'Glede na vrsto financiranja ter veljavni pravni in pogodbeni okvir se lahko zaračunajo stroški odobritve. O njih vas vedno pisno obvestimo pred podpisom pogodbe: brez skritih stroškov in brez plačila pred izdajo ponudbe.' },
    { id: 'delai', question: 'Koliko časa traja obravnava vloge?', answer: 'Po prejemu popolne vloge vam svetovalec v dveh delovnih dneh posreduje načelni odgovor. Rok izplačila sredstev je nato odvisen od vrste financiranja in podpisa ponudbe.' },
    { id: 'documents', question: 'Katere dokumente moram predložiti?', answer: 'Praviloma veljaven osebni dokument, novejše dokazilo o naslovu in dokazila o dohodku. Glede na projekt lahko zahtevamo dodatne dokumente (predračune, predpogodbo, računovodske izkaze za podjetja).' },
    { id: 'garantie', question: 'Ali je moja vloga samodejno odobrena?', answer: 'Ne. Vsaka vloga se obravnava posamično. Express Finance si pridržuje pravico, da vlogo po analizi položaja vlagatelja in izvedljivosti projekta sprejme ali zavrne.' },
    { id: 'international', question: 'Ali lahko zaprosim iz tujine?', answer: 'Da. Express Finance je mednarodno podjetje za financiranje, ki podpira stranke v Evropi in zunaj nje. V obrazcu navedite državo prebivališča in pojasnili vam bomo pogoje, ki veljajo za vaš položaj.' },
    { id: 'donnees', question: 'Kako so zaščiteni moji osebni podatki?', answer: 'Vaši podatki se prenašajo šifrirano, shranjujejo na varni infrastrukturi in so dostopni samo osebam, pooblaščenim za obdelavo vaše vloge. Za podrobnosti o vaših pravicah glejte našo politiko zasebnosti.' },
  ],
  testimonials: [
    { loanType: 'Poslovno financiranje', content: 'Nujno sem potreboval likvidna sredstva za veliko naročilo. Vloga je bila obravnavana v dveh dneh, svetovalec pa mi je razložil vsako postavko ponudbe. Brez presenečenj.' },
    { loanType: 'Osebno posojilo', content: 'Jasna simulacija, preprost obrazec in resnična podpora prek WhatsAppa. Cenim, da so mi že na začetku povedali, kaj je mogoče in kaj ne.' },
    { loanType: 'Stanovanjsko posojilo', content: 'Financirali smo prenovo stanovanja. Ekipa je bila dosegljiva, natančna glede stroškov in hitra pri odgovorih. Priporočam.' },
    { loanType: 'Potrošniški kredit', content: 'Financiranje avtomobila brez zapletov. Mesečni obroki se natančno ujemajo s simulacijo na spletni strani.' },
    { loanType: 'Projektno financiranje', content: 'Za zagon dejavnosti sem potreboval sogovornika, ki razume moj poslovni načrt. Posluh, natančnost in hiter odgovor: prav to, kar sem potreboval.' },
    { loanType: 'Osebno posojilo', content: 'Postopek v celoti na spletu, dokumenti naloženi v petih minutah in odgovor v dveh dneh. Zaradi fiksne obrestne mere sem lahko mirno načrtoval svoj proračun.' },
  ],
  legal: {
    mentions: {
      title: 'Pravno obvestilo', description: 'Pravno obvestilo spletne strani Express Finance: izdajatelj, gostovanje, intelektualna lastnina, odgovornost.', lastUpdated: updated,
      sections: [
        { heading: '1. Izdajatelj strani', paragraphs: [`Izdajatelj te spletne strani je ${company}, mednarodno podjetje za financiranje s sedežem na naslovu ${address}.`], list: [`E-pošta: ${email}`, `Telefon: ${phone}`, 'Odgovorni urednik: vodstvo Express Finance'] },
        { heading: '2. Gostovanje', paragraphs: ['Stran gostuje na evropski oblačni infrastrukturi (Vercel Inc. za aplikacijo, Supabase Inc. za podatkovno bazo in varno shranjevanje dokumentov) s strežniki v Evropski uniji.'] },
        { heading: '3. Dejavnost', paragraphs: [`${company} ponuja rešitve financiranja — osebna posojila, stanovanjska posojila, potrošniške kredite, financiranje podjetij in projektov — za posameznike, samozaposlene in podjetja. Vsaka vloga se obravnava posamično; nobena ponudba ni izdana brez predhodne analize vloge.`] },
        { heading: '4. Intelektualna lastnina', paragraphs: [`Celotna vsebina strani (besedila, slike, logotip, struktura, koda, simulator) je zaščitena z avtorsko pravico in ostaja izključna last podjetja ${company} ali njegovih partnerjev. Brez predhodnega pisnega dovoljenja je prepovedano vsakršno razmnoževanje, prikazovanje, prilagajanje ali uporaba vsebine, v celoti ali delno; to pomeni kršitev avtorskih pravic.`] },
        { heading: '5. Odgovornost', paragraphs: [`Informacije, objavljene na tej strani, so zgolj informativne narave. ${company} si prizadeva, da so točne in ažurne, vendar ne more jamčiti za njihovo popolnost ali odsotnost napak. Simulacije posojil so informativne in ne pomenijo kreditne ponudbe.`, `${company} ne odgovarja za neposredno ali posredno škodo, nastalo zaradi dostopa do strani, njene uporabe ali nezmožnosti dostopa, niti za vsebino spletnih strani tretjih oseb, na katere vodijo povezave.`] },
        { heading: '6. Osebni podatki', paragraphs: ['Obdelava osebnih podatkov, zbranih na tej strani, je opisana v politiki zasebnosti, dostopni v nogi strani.'] },
        { heading: '7. Kontakt', paragraphs: [`Za vsa vprašanja o strani ali njeni vsebini: ${email}.`] },
      ],
    },
    privacy: {
      title: 'Politika zasebnosti', description: 'Kako Express Finance zbira, uporablja in varuje vaše osebne podatke v okviru vaše vloge za financiranje.', lastUpdated: updated,
      sections: [
        { heading: '1. Upravljavec', paragraphs: [`Upravljavec osebnih podatkov, zbranih prek te strani, je ${company}, ${address} — ${email}.`] },
        { heading: '2. Zbrani podatki', paragraphs: ['V okviru vloge za financiranje zbiramo:'], list: ['Identifikacijske in kontaktne podatke: ime, priimek, poštni naslov, e-poštni naslov, telefonsko številko;', 'Poklicni položaj: poklic, zaposlitveni status, navedeni mesečni dohodek;', 'Projekt: vrsto financiranja, znesek, ročnost, opis projekta;', 'Dokumente: osebni dokument in po potrebi dokazila o naslovu in dohodku;', 'Tehnične podatke: zgoščeno vrednost (hash) IP-naslova in podatke o uporabljenem brskalniku (varnost in preprečevanje goljufij) ter časovne žige soglasij.'], after: ['Občutljivih podatkov v smislu GDPR (zdravje, prepričanja, pripadnost) ne zahtevamo.'] },
        { heading: '3. Nameni in pravne podlage', list: ['Obravnava in obdelava vaše vloge za financiranje (predpogodbeni ukrepi na vašo zahtevo);', 'Komunikacija z vami in spremljanje vloge po e-pošti, telefonu ali WhatsAppu;', 'Varnost strani, preprečevanje zlorab in goljufij (zakoniti interes);', 'Izpolnjevanje naših zakonskih in regulativnih obveznosti.'] },
        { heading: '4. Prejemniki', paragraphs: [`Vaši podatki so dostopni samo pooblaščenemu osebju podjetja ${company} in našim tehničnim obdelovalcem (gostovanje, podatkovna baza in varno shranjevanje). Kadar to zahteva strukturiranje financiranja, se lahko nujno potrebni podatki posredujejo partnerski instituciji, o čemer vas predhodno obvestimo. Podatkov ne prodajamo in jih ne posredujemo v komercialne namene.`] },
        { heading: '5. Obdobje hrambe', paragraphs: ['Podatke iz vloge hranimo ves čas obravnave, nato pa, če pogodba ni sklenjena, še največ 12 mesecev, potem jih izbrišemo ali anonimiziramo. Če je financiranje odobreno, jih hranimo ves čas trajanja pogodbe in v zakonsko predpisanem roku hrambe (10 let za računovodske listine).'] },
        { heading: '6. Varnost', paragraphs: ['Podatki se prenašajo šifrirano (HTTPS) in shranjujejo v podatkovni bazi, zaščiteni s strogimi pravili dostopa; dokumenti so shranjeni v zasebnem prostoru, dostopnem samo prek začasnih povezav, ustvarjenih za pooblaščene osebe.'] },
        { heading: '7. Vaše pravice', paragraphs: [`V skladu z GDPR imate pravico do dostopa do svojih podatkov, njihovega popravka, izbrisa, omejitve obdelave, ugovora in prenosljivosti ter pravico, da kadar koli prekličete soglasje. Za uveljavljanje teh pravic nam pišite na: ${email}. Pritožbo lahko vložite tudi pri belgijskem organu za varstvo podatkov (www.autoriteprotectiondonnees.be) ali pri pristojnem organu v državi vašega prebivališča.`] },
        { heading: '8. Prenosi zunaj Evropske unije', paragraphs: ['Podatki so shranjeni v Evropski uniji. Če bi bil potreben prenos zunaj EU (npr. tehničnemu obdelovalcu), bi ga uredili z ustreznimi zaščitnimi ukrepi (standardnimi pogodbenimi klavzulami Evropske komisije).'] },
        { heading: '9. Piškotki', paragraphs: ['Uporaba piškotkov je opisana v naši politiki piškotkov.'] },
      ],
    },
    terms: {
      title: 'Splošni pogoji uporabe', description: 'Splošni pogoji uporabe spletne strani Express Finance in storitve spletne oddaje vloge za financiranje.', lastUpdated: updated,
      sections: [
        { heading: '1. Predmet', paragraphs: [`Ti pogoji urejajo uporabo strani ${siteConfig.name} in storitve spletne oddaje vloge za financiranje. Z uporabo strani jih brez pridržkov sprejemate.`] },
        { heading: '2. Narava storitve', paragraphs: [`Stran omogoča seznanitev s ponujenimi rešitvami financiranja, izvedbo informativne simulacije in oddajo vloge za financiranje. Oddaja vloge ne pomeni niti ponudbe niti kreditne pogodbe: z njo se začne faza obravnave, po kateri lahko ${company} vlogo sprejme, zavrne ali predlaga drugačne pogoje.`] },
        { heading: '3. Simulator', paragraphs: ['Simulator podaja ocene, izračunane na podlagi prikazanih parametrov (fiksna nominalna letna obrestna mera 2 %, ročnost, morebitni stroški). Rezultati so informativni in nezavezujoči ter se lahko razlikujejo od končno predlaganih pogojev.'] },
        { heading: '4. Obveznosti uporabnika', list: ['Posredovati točne, popolne in ažurne podatke;', 'Posredovati samo dokumente, ki so vaši ali za katerih posredovanje ste pooblaščeni;', 'Strani ne uporabljati za goljufive, zlonamerne ali nezakonite namene;', 'Ne poskušati ogroziti varnosti ali delovanja strani.'] },
        { heading: '5. Stroški', paragraphs: ['Uporaba strani in oddaja vloge sta brezplačni. Za samo financiranje se lahko zaračunajo stroški odobritve, kadar so zakonsko in pogodbeno predvideni; o njih vas pisno obvestimo, preden se zavežete. Pred izdajo ponudbe ne zahtevamo nobenega plačila.'] },
        { heading: '6. Odgovornost', paragraphs: [`${company} sprejema razumne ukrepe za zagotovitev razpoložljivosti in varnosti strani, vendar ne jamči za neprekinjeno delovanje. Ne odgovarja za posredno škodo, nastalo zaradi uporabe strani ali nezmožnosti dostopa.`] },
        { heading: '7. Intelektualna lastnina', paragraphs: ['Glejte pravno obvestilo.'] },
        { heading: '8. Osebni podatki', paragraphs: ['Obdelava vaših podatkov je opisana v politiki zasebnosti.'] },
        { heading: '9. Veljavno pravo in pristojnost', paragraphs: ['Za te pogoje velja belgijsko pravo. Za vse spore v zvezi z njihovo razlago ali izvajanjem so pristojna sodišča v Bruslju, ob upoštevanju prisilnih predpisov o varstvu potrošnikov, ki veljajo v državi vašega prebivališča.'] },
      ],
    },
    cookies: {
      title: 'Politika piškotkov', description: 'Informacije o piškotkih in sledilnikih, ki jih uporablja spletna stran Express Finance.', lastUpdated: updated,
      sections: [
        { heading: '1. Kaj je piškotek?', paragraphs: ['Piškotek je majhna datoteka, ki se ob obisku strani shrani na vašo napravo. Omogoča na primer ohranjanje seje ali shranjevanje nastavitev.'] },
        { heading: '2. Piškotki na tej strani', paragraphs: ['Javni del strani ne uporablja oglaševalskih piškotkov niti analitičnih piškotkov tretjih oseb. Nameščeni so samo nujno potrebni piškotki:'], list: ['Sejni piškotki administracije: namestijo se samo ob prijavi v območje, namenjeno osebju Express Finance, in ne zadevajo obiskovalcev.', 'Preverjanje, da niste robot: ob oddaji obrazca vloge se lahko uporabi tehnični žeton.'], after: ['Ker so ti piškotki nujno potrebni za delovanje storitve, zanje ni potrebno predhodno soglasje.'] },
        { heading: '3. Simulator', paragraphs: ['Simulator v celoti deluje v vašem brskalniku in po zaprtju strani ne shrani vaših parametrov.'] },
        { heading: '4. Upravljanje piškotkov', paragraphs: ['Brskalnik lahko nastavite tako, da piškotke zavrne ali izbriše. Blokiranje nujno potrebnih piškotkov lahko onemogoči dostop do administrativnega območja.'] },
      ],
    },
    disclaimer: {
      title: 'Opozorilo o posojilih', description: 'Pomembne informacije pred oddajo vloge za financiranje: informativna simulacija, pregled vloge, obveznost odplačila.', lastUpdated: updated,
      sections: [
        { heading: 'Posojilo je obveznost', paragraphs: ['Izposojanje denarja ima svojo ceno. Preden se zavežete, preverite svojo sposobnost odplačevanja in se prepričajte, da bodo mesečni obroki ves čas trajanja financiranja skladni z vašim proračunom.'] },
        { heading: 'Informativne simulacije', paragraphs: [`Rezultati simulatorja so ocene, izračunane na podlagi prikazanih parametrov. Ne pomenijo niti ponudbe niti obljube financiranja niti zaveze podjetja ${company}. Končni pogoji (obrestna mera, ročnost, stroški, zavarovanja) so navedeni v pisni ponudbi, izdani po celovitem pregledu vloge.`] },
        { heading: 'Posamična obravnava', paragraphs: [`Vsaka vloga se obravnava posamično. ${company} si pridržuje pravico, da po pregledu financiranje zavrne ali spremeni njegove pogoje.`] },
        { heading: 'Stroški in kazni', paragraphs: ['Stroški odobritve se lahko zaračunajo, kadar so zakonsko in pogodbeno predvideni; o njih vas obvestimo, preden se zavežete. V primeru zamude pri plačilu se v skladu s pogodbo zaračunajo kazni. Zneski, ki jih prikazuje simulator kazni, so ocene in so odvisni od veljavnih pogodbenih pogojev.'] },
        { heading: 'Previdnost', paragraphs: [`${company} od vas nikoli ne bo zahteval podatkov za dostop do spletne banke po e-pošti ali sporočilu niti plačila kakršnega koli zneska pred izdajo pisne ponudbe. Če dvomite v pristnost sporočila, nas kontaktirajte neposredno prek uradnih kontaktnih podatkov na tej strani.`] },
      ],
    },
  },
};
