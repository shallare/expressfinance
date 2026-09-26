import { siteConfig, formatAddressOneLine } from '@/lib/config/site';
import { loanLimits } from '@/lib/config/loans';
import type { LocaleContent } from './types';

const company = siteConfig.legalName;
const address = formatAddressOneLine();
const email = siteConfig.contact.email;
const phone = siteConfig.contact.phoneDisplay;
const min = loanLimits.minAmount.toLocaleString('hr-HR');
const max = loanLimits.maxAmount.toLocaleString('hr-HR');
const docs = ['Važeći osobni dokument (osobna iskaznica ili putovnica)', 'Dokaz o prebivalištu ne stariji od 3 mjeseca', 'Dokaz o primanjima (zadnje 3 platne liste ili porezno rješenje)'];
const updated = '26. rujna 2026.';

export const hr: LocaleContent = {
  products: {
    'pret-personnel': {
      name: 'Osobni kredit', shortName: 'Osobni', tagline: 'Slobodno financirajte svoje životne planove.',
      description: 'Fleksibilno nenamjensko financiranje za ostvarenje osobnih planova: putovanje, vjenčanje, školovanje, nepredviđeni troškovi ili potreba za likvidnošću.',
      longDescription: 'Osobni kredit Express Finance omogućuje vam posudbu određenog iznosa koji otplaćujete u jednakim mjesečnim ratama tijekom roka po vašem izboru. Sredstva koristite slobodno, a osobnu podršku imate od podnošenja zahtjeva do isplate.',
      keyConditions: ['Jednake mjesečne rate tijekom cijelog roka otplate', 'Bez ograničenja namjene sredstava', 'Pojedinačno razmatranje svakog zahtjeva', 'Prijevremena otplata moguća prema ugovornim uvjetima'],
      useCases: ['Osobna likvidnost', 'Obiteljski događaj', 'Studij i obrazovanje', 'Putovanje'], requiredDocuments: docs,
    },
    'credit-immobilier': {
      name: 'Stambeni kredit', shortName: 'Stambeni', tagline: 'Ostvarite svoj stambeni projekt.',
      description: 'Kupnja, gradnja, obnova ili ulaganje u nekretninu za najam: strukturirano stambeno financiranje prilagođeno vašoj situaciji.',
      longDescription: 'Našim stambenim kreditom financiramo kupnju nekretnine za stanovanje ili odmor, gradnju, obnovu ili ulaganje u nekretninu za najam. Svaki zahtjev detaljno analiziramo kako bismo predložili plan financiranja usklađen s vašom sposobnošću otplate.',
      keyConditions: ['Financiranje kupnje, gradnje ili obnove', 'Mogući dugi rokovi otplate, ovisno o projektu', 'Detaljna analiza plana financiranja', 'Instrumenti osiguranja utvrđuju se tijekom razmatranja zahtjeva'],
      useCases: ['Nekretnina za stanovanje', 'Ulaganje u najam', 'Obnova', 'Gradnja'], requiredDocuments: [...docs, 'Predugovor, ponuda ili opis nekretninskog projekta'],
    },
    'credit-consommation': {
      name: 'Potrošački kredit', shortName: 'Potrošački', tagline: 'Nabavite što vam treba bez čekanja.',
      description: 'Vozilo, oprema, kućanski aparati, radovi: financiranje namijenjeno kupnji određene robe ili usluge.',
      longDescription: 'Potrošačkim kreditom financira se konkretna kupnja — vozilo, namještaj, oprema ili radovi uređenja. Iznos i rok otplate prilagođavaju se vrijednosti kupljenog i vašem mjesečnom proračunu.',
      keyConditions: ['Financiranje vezano uz konkretnu kupnju', 'Mjesečne rate prilagođene vašem proračunu', 'Potreban dokaz o kupnji (ponuda ili račun)', 'Konačni uvjeti utvrđuju se nakon razmatranja zahtjeva'],
      useCases: ['Vozilo', 'Radovi uređenja', 'Oprema', 'Namještaj'], requiredDocuments: [...docs, 'Ponuda ili narudžbenica za robu koja se financira'],
    },
    'financement-professionnel': {
      name: 'Poslovno financiranje', shortName: 'Poslovno', tagline: 'Podržite rast svojeg poduzeća.',
      description: 'Likvidnost, ulaganja, oprema, širenje poslovanja: rješenja financiranja za samostalne djelatnike, mikropoduzeća te mala i srednja poduzeća.',
      longDescription: 'Express Finance podržava poduzetnike, samostalne djelatnike i trgovačka društva u njihovim potrebama za financiranjem: jačanje likvidnosti, nabava opreme, širenje poslovanja ili preuzimanje poduzeća. Zahtjev se razmatra na temelju financijskih pokazatelja poduzeća.',
      keyConditions: ['Dostupno samostalnim djelatnicima, mikropoduzećima te malim i srednjim poduzećima', 'Financiranje likvidnosti ili ulaganja', 'Analiza financijskih izvještaja poduzeća', 'Otplatni plan prilagođen poslovnom ciklusu'],
      useCases: ['Likvidnost', 'Strojevi i oprema', 'Širenje poslovanja', 'Preuzimanje poduzeća'],
      requiredDocuments: ['Osobni dokument odgovorne osobe', 'Izvadak iz sudskog ili obrtnog registra', 'Zadnje bilance ili godišnji financijski izvještaji', 'Noviji izvodi poslovnog računa'],
    },
    'financement-de-projet': {
      name: 'Projektno financiranje', shortName: 'Projekt', tagline: 'Pretvorite ideju u stvarnost.',
      description: 'Pokretanje poslovanja, inovativni, poljoprivredni, nekretninski ili industrijski projekt: financiranje strukturirano oko vašeg poslovnog plana.',
      longDescription: 'Projektno financiranje namijenjeno je nositeljima strukturiranih projekata s jasnim planom: osnivanje poduzeća, razvoj proizvoda, poljoprivredni, energetski ili industrijski projekt. Razmatramo održivost projekta, njegov vremenski plan i sposobnost stvaranja novčanih tokova za otplatu.',
      keyConditions: ['Potrebna je projektna dokumentacija s prikazom projekta', 'Ocjena održivosti i vremenskog plana', 'Financiranje se može isplaćivati u fazama', 'Osobna podrška tijekom cijelog postupka'],
      useCases: ['Osnivanje poduzeća', 'Poljoprivredni projekt', 'Energetski projekt', 'Razvoj proizvoda'],
      requiredDocuments: ['Osobni dokument nositelja projekta', 'Prikaz projekta / poslovni plan', 'Financijske projekcije', 'Dokaz o eventualnom vlastitom učešću'],
    },
    'autres-solutions': {
      name: 'Ostala rješenja financiranja', shortName: 'Po mjeri', tagline: 'Imate posebnu potrebu? Razgovarajmo.',
      description: 'Objedinjavanje kredita, financiranje školovanja, netipična situacija: razmatramo i zahtjeve koji ne pripadaju klasičnim kategorijama.',
      longDescription: 'Neke situacije zahtijevaju pristup po mjeri: objedinjavanje kredita, financiranje školovanja, jednokratna potreba ili netipičan projekt. Opišite nam svoju potrebu, a naš će tim procijeniti izvedivost odgovarajućeg rješenja.',
      keyConditions: ['Razmatranje od slučaja do slučaja', 'Rješenje oblikovano prema vašoj situaciji', 'Potpuna transparentnost predloženih uvjeta', 'Osobni odgovor nakon analize'],
      useCases: ['Objedinjavanje kredita', 'Financiranje školovanja', 'Jednokratna potreba', 'Netipičan projekt'], requiredDocuments: docs,
    },
  },
  faq: [
    { id: 'montants', question: 'Koje iznose mogu zatražiti?', answer: `Zahtjevi za financiranje razmatraju se za iznose od ${min} € do ${max} €, ovisno o vrsti financiranja i vašoj situaciji. Odobreni iznos uvijek ovisi o analizi vašeg zahtjeva.` },
    { id: 'taux', question: 'Koja se kamatna stopa primjenjuje?', answer: 'Express Finance primjenjuje fiksnu nominalnu godišnju kamatnu stopu od 2 %, uz jednake mjesečne rate tijekom cijelog trajanja kredita. Točni uvjeti (rok otplate, eventualne naknade) potvrđuju se u ponudi izdanoj nakon razmatranja vašeg zahtjeva.' },
    { id: 'frais', question: 'Naplaćuju li se uz kamate i naknade?', answer: 'Ovisno o vrsti financiranja te primjenjivom pravnom i ugovornom okviru mogu se primijeniti naknade za obradu. One se uvijek priopćavaju pisanim putem prije potpisa ugovora: bez skrivenih naknada i bez ikakvog plaćanja prije izdavanja ponude.' },
    { id: 'delai', question: 'Koliko traje razmatranje zahtjeva?', answer: 'Po primitku potpune dokumentacije savjetnik vam u roku od 48 sati (radnim danima) daje načelni odgovor. Rok isplate sredstava zatim ovisi o vrsti financiranja i potpisu ponude.' },
    { id: 'documents', question: 'Koje dokumente moram dostaviti?', answer: 'U pravilu: važeći osobni dokument, noviji dokaz o prebivalištu i dokaz o primanjima. Ovisno o projektu mogu se zatražiti dodatni dokumenti (ponude, predugovor, bilance za poduzeća).' },
    { id: 'garantie', question: 'Odobrava li se moj zahtjev automatski?', answer: 'Ne. Svaki se zahtjev razmatra pojedinačno. Express Finance zadržava pravo prihvatiti ili odbiti zahtjev nakon analize situacije podnositelja i izvedivosti projekta.' },
    { id: 'international', question: 'Mogu li podnijeti zahtjev iz druge zemlje?', answer: 'Da. Express Finance je međunarodna financijska kuća koja podržava klijente u Europi i šire. U obrascu navedite zemlju boravišta i objasnit ćemo vam uvjete koji se primjenjuju na vašu situaciju.' },
    { id: 'donnees', question: 'Kako su zaštićeni moji osobni podaci?', answer: 'Vaši se podaci prenose šifrirano, pohranjuju na sigurnoj infrastrukturi i dostupni su samo osobama ovlaštenima za obradu vašeg zahtjeva. Pojedinosti o vašim pravima potražite u našoj politici privatnosti.' },
  ],
  testimonials: [
    { loanType: 'Poslovno financiranje', content: 'Trebala mi je brza likvidnost za veliku narudžbu. Zahtjev je obrađen u dva dana, a savjetnik mi je objasnio svaku stavku ponude. Bez iznenađenja.' },
    { loanType: 'Osobni kredit', content: 'Jasna simulacija, jednostavan obrazac i pravo praćenje putem WhatsAppa. Cijenim što su mi od početka rekli što je moguće, a što nije.' },
    { loanType: 'Stambeni kredit', content: 'Financirali smo obnovu stana. Tim je bio dostupan, precizan u pogledu naknada i brz u odgovorima. Preporučujem.' },
    { loanType: 'Potrošački kredit', content: 'Financiranje automobila bez komplikacija. Mjesečne rate točno odgovaraju simulaciji na web-stranici.' },
    { loanType: 'Projektno financiranje', content: 'Za pokretanje poslovanja trebao mi je sugovornik koji razumije moj poslovni plan. Spremnost da saslušaju, temeljitost i brz odgovor: upravo ono što mi je trebalo.' },
    { loanType: 'Osobni kredit', content: 'Postupak u potpunosti online, dokumenti učitani u pet minuta i odgovor za dva dana. Fiksna kamatna stopa omogućila mi je da mirno isplaniram proračun.' },
  ],
  legal: {
    mentions: {
      title: 'Pravne napomene', description: 'Pravne napomene web-stranice Express Finance: izdavač, hosting, intelektualno vlasništvo, odgovornost.', lastUpdated: updated,
      sections: [
        { heading: '1. Izdavač web-stranice', paragraphs: [`Ovu web-stranicu objavljuje ${company}, međunarodno društvo za financiranje sa sjedištem na adresi ${address}.`], list: [`E-pošta: ${email}`, `Telefon: ${phone}`, 'Odgovorna osoba za objavu: uprava tvrtke Express Finance'] },
        { heading: '2. Hosting', paragraphs: ['Web-stranica je smještena na europskoj infrastrukturi u oblaku (Vercel Inc. za aplikaciju, Supabase Inc. za bazu podataka i sigurnu pohranu dokumenata), na poslužiteljima u Europskoj uniji.'] },
        { heading: '3. Djelatnost', paragraphs: [`${company} nudi rješenja financiranja — osobne kredite, stambene kredite, potrošačke kredite, financiranje poduzeća i projekata — privatnim osobama, samostalnim djelatnicima i poduzećima. Svaki se zahtjev razmatra pojedinačno; nijedna se ponuda ne izdaje bez prethodne analize zahtjeva.`] },
        { heading: '4. Intelektualno vlasništvo', paragraphs: [`Sav sadržaj web-stranice (tekstovi, vizualni elementi, logotip, struktura, kod, simulator) zaštićen je autorskim pravom i isključivo je vlasništvo tvrtke ${company} ili njezinih partnera. Svako umnožavanje, prikazivanje, prilagodba ili iskorištavanje, u cijelosti ili djelomično, bez prethodnog pisanog odobrenja zabranjeno je i predstavlja povredu prava.`] },
        { heading: '5. Odgovornost', paragraphs: [`Informacije objavljene na ovoj web-stranici služe u informativne svrhe. ${company} nastoji ih održavati točnima i ažurnima, ali ne može jamčiti njihovu potpunost ni odsutnost pogrešaka. Simulacije kredita okvirne su i ne predstavljaju ponudu kredita.`, `${company} ne odgovara za izravnu ili neizravnu štetu nastalu pristupom web-stranici, njezinim korištenjem ili nemogućnošću pristupa, kao ni za sadržaj web-stranica trećih strana na koje se može upućivati.`] },
        { heading: '6. Osobni podaci', paragraphs: ['Obrada osobnih podataka prikupljenih na ovoj web-stranici opisana je u politici privatnosti, dostupnoj u podnožju stranice.'] },
        { heading: '7. Kontakt', paragraphs: [`Za sva pitanja o web-stranici ili njezinu sadržaju: ${email}.`] },
      ],
    },
    privacy: {
      title: 'Politika privatnosti', description: 'Kako Express Finance prikuplja, koristi i štiti vaše osobne podatke u okviru vašeg zahtjeva za financiranje.', lastUpdated: updated,
      sections: [
        { heading: '1. Voditelj obrade', paragraphs: [`Voditelj obrade podataka prikupljenih putem ove web-stranice je ${company}, ${address} — ${email}.`] },
        { heading: '2. Prikupljeni podaci', paragraphs: ['U okviru zahtjeva za financiranje prikupljamo:'], list: ['Identifikacijske i kontaktne podatke: ime, prezime, poštansku adresu, adresu e-pošte, telefon;', 'Profesionalni status: zanimanje, radni status, prijavljena mjesečna primanja;', 'Projekt: vrstu financiranja, iznos, rok otplate, opis projekta;', 'Dokumente: osobni dokument te, po potrebi, dokaz o prebivalištu i primanjima;', 'Tehničke podatke: raspršenu (hash) vrijednost IP adrese i podatke o korištenom pregledniku (sigurnost i sprječavanje prijevara), vremenske oznake danih privola.'], after: ['Ne prikupljamo osjetljive podatke u smislu Opće uredbe o zaštiti podataka (zdravlje, uvjerenja, pripadnost).'] },
        { heading: '3. Svrhe i pravne osnove', list: ['Razmatranje i obrada vašeg zahtjeva za financiranje (predugovorne mjere poduzete na vaš zahtjev);', 'Kontaktiranje i praćenje zahtjeva e-poštom, telefonom ili WhatsAppom;', 'Sigurnost web-stranice, sprječavanje zlouporabe i prijevara (legitimni interes);', 'Ispunjavanje naših zakonskih i regulatornih obveza.'] },
        { heading: '4. Primatelji', paragraphs: [`Vaši su podaci dostupni samo ovlaštenim zaposlenicima tvrtke ${company} i našim tehničkim izvršiteljima obrade (hosting, baza podataka i sigurna pohrana). Kada to zahtijeva strukturiranje financiranja, samo nužni podaci mogu se proslijediti partnerskoj instituciji, uz prethodnu obavijest. Podaci se ne prodaju niti ustupaju u komercijalne svrhe.`] },
        { heading: '5. Razdoblje čuvanja', paragraphs: ['Podaci o zahtjevu čuvaju se tijekom njegova razmatranja, a zatim, ako ugovor nije sklopljen, najviše 12 mjeseci, nakon čega se brišu ili anonimiziraju. Ako je financiranje odobreno, čuvaju se tijekom trajanja ugovora i primjenjivog zakonskog roka čuvanja (10 godina za računovodstvenu dokumentaciju).'] },
        { heading: '6. Sigurnost', paragraphs: ['Podaci se prenose šifrirano (HTTPS) i pohranjuju u bazi zaštićenoj strogim pravilima pristupa, a dokumenti se čuvaju u privatnom prostoru dostupnom isključivo putem privremenih poveznica koje se generiraju za ovlaštene osobe.'] },
        { heading: '7. Vaša prava', paragraphs: [`U skladu s Općom uredbom o zaštiti podataka (GDPR) imate pravo na pristup, ispravak, brisanje, ograničenje obrade, prigovor i prenosivost svojih podataka, kao i pravo u bilo kojem trenutku povući privolu. Za ostvarivanje tih prava obratite nam se na: ${email}. Pritužbu možete podnijeti i belgijskom Tijelu za zaštitu podataka (www.autoriteprotectiondonnees.be) ili nadležnom tijelu u zemlji svojeg boravišta.`] },
        { heading: '8. Prijenosi izvan Europske unije', paragraphs: ['Podaci se čuvaju u Europskoj uniji. Ako bi prijenos izvan EU-a postao nužan (npr. tehničkom izvršitelju obrade), bio bi zaštićen odgovarajućim zaštitnim mjerama (standardne ugovorne klauzule Europske komisije).'] },
        { heading: '9. Kolačići', paragraphs: ['Korištenje kolačića opisano je u našoj politici kolačića.'] },
      ],
    },
    terms: {
      title: 'Opći uvjeti korištenja', description: 'Opći uvjeti korištenja web-stranice Express Finance i usluge online podnošenja zahtjeva za financiranje.', lastUpdated: updated,
      sections: [
        { heading: '1. Predmet', paragraphs: [`Ovi uvjeti uređuju korištenje web-stranice ${siteConfig.name} i usluge online podnošenja zahtjeva za financiranje. Korištenjem web-stranice prihvaćate ih bez ograničenja.`] },
        { heading: '2. Priroda usluge', paragraphs: [`Web-stranica omogućuje informiranje o ponuđenim rješenjima financiranja, izradu okvirne simulacije i podnošenje zahtjeva za financiranje. Podnošenje zahtjeva ne predstavlja ni ponudu ni ugovor o kreditu: njime započinje faza razmatranja nakon koje ${company} može prihvatiti ili odbiti zahtjev ili predložiti drugačije uvjete.`] },
        { heading: '3. Simulator', paragraphs: ['Simulator daje procjene izračunate na temelju prikazanih parametara (fiksna nominalna godišnja kamatna stopa od 2 %, rok otplate, eventualne naknade). Ti su rezultati okvirni i neobvezujući te se mogu razlikovati od konačno predloženih uvjeta.'] },
        { heading: '4. Obveze korisnika', list: ['Dostaviti točne, potpune i ažurne podatke;', 'Učitavati samo dokumente koji se odnose na vas ili koje ste ovlašteni dostaviti;', 'Ne koristiti web-stranicu u prijevarne, zlonamjerne ili nezakonite svrhe;', 'Ne pokušavati ugroziti sigurnost ili rad web-stranice.'] },
        { heading: '5. Naknade', paragraphs: ['Korištenje web-stranice i podnošenje zahtjeva besplatni su. Na samo financiranje mogu se primijeniti naknade za obradu ako su zakonski i ugovorno predviđene; one se priopćavaju pisanim putem prije preuzimanja bilo kakve obveze. Nikakvo se plaćanje ne traži prije izdavanja ponude.'] },
        { heading: '6. Odgovornost', paragraphs: [`${company} poduzima razumne mjere kako bi osigurao dostupnost i sigurnost web-stranice, ali ne jamči neprekinut rad. Ne odgovara za neizravnu štetu nastalu korištenjem web-stranice ili nemogućnošću pristupa.`] },
        { heading: '7. Intelektualno vlasništvo', paragraphs: ['Vidi pravne napomene.'] },
        { heading: '8. Osobni podaci', paragraphs: ['Obrada vaših podataka opisana je u politici privatnosti.'] },
        { heading: '9. Mjerodavno pravo i nadležnost', paragraphs: ['Na ove se uvjete primjenjuje belgijsko pravo. Za sve sporove u vezi s njihovim tumačenjem ili izvršenjem nadležni su sudovi u Bruxellesu, uz poštovanje prisilnih propisa o zaštiti potrošača koji vrijede u zemlji vašeg boravišta.'] },
      ],
    },
    cookies: {
      title: 'Politika kolačića', description: 'Informacije o kolačićima i alatima za praćenje koje koristi web-stranica Express Finance.', lastUpdated: updated,
      sections: [
        { heading: '1. Što je kolačić?', paragraphs: ['Kolačić je mala datoteka koja se pohranjuje na vaš uređaj prilikom posjeta web-stranici. Služi, među ostalim, za održavanje sesije ili pamćenje postavki.'] },
        { heading: '2. Kolačići na ovoj web-stranici', paragraphs: ['Javni dio web-stranice ne koristi oglašivačke kolačiće ni analitičke kolačiće trećih strana. Postavljaju se isključivo strogo nužni kolačići:'], list: ['Kolačići administratorske sesije: postavljaju se samo pri prijavi u područje namijenjeno osoblju tvrtke Express Finance. Ne odnose se na posjetitelje.', 'Provjera da niste robot: tijekom provjere pri slanju obrasca zahtjeva može se koristiti tehnički token.'], after: ['Budući da su ti kolačići strogo nužni za rad usluge, za njih nije potrebna prethodna privola.'] },
        { heading: '3. Simulator', paragraphs: ['Simulator u cijelosti radi u vašem pregledniku i ne pamti vaše parametre nakon zatvaranja stranice.'] },
        { heading: '4. Upravljanje kolačićima', paragraphs: ['Preglednik možete postaviti tako da odbija ili briše kolačiće. Blokiranje strogo nužnih kolačića može onemogućiti pristup administratorskom području.'] },
      ],
    },
    disclaimer: {
      title: 'Upozorenje o kreditima', description: 'Važne informacije prije podnošenja zahtjeva za financiranje: okvirna simulacija, razmatranje zahtjeva, obveza otplate.', lastUpdated: updated,
      sections: [
        { heading: 'Kredit je obveza', paragraphs: ['Posuđeni novac ima svoju cijenu. Prije preuzimanja obveze provjerite svoju sposobnost otplate i uvjerite se da su mjesečne rate usklađene s vašim proračunom tijekom cijelog trajanja financiranja.'] },
        { heading: 'Okvirne simulacije', paragraphs: [`Rezultati simulatora procjene su izračunate na temelju prikazanih parametara. Ne predstavljaju ni ponudu, ni obećanje financiranja, ni obvezu tvrtke ${company}. Konačni uvjeti (kamatna stopa, rok otplate, naknade, instrumenti osiguranja) navode se u pisanoj ponudi izdanoj nakon potpunog razmatranja zahtjeva.`] },
        { heading: 'Pojedinačno razmatranje', paragraphs: [`Svaki se zahtjev razmatra pojedinačno. ${company} zadržava pravo odbiti financiranje ili izmijeniti njegove uvjete nakon razmatranja.`] },
        { heading: 'Naknade i troškovi kašnjenja u plaćanju', paragraphs: ['Naknade za obradu mogu se primijeniti kada su zakonski i ugovorno predviđene; priopćavaju se prije preuzimanja bilo kakve obveze. U slučaju kašnjenja s plaćanjem naplaćuju se naknade predviđene ugovorom. Iznosi koje prikazuje simulator naknada procjene su i ovise o primjenjivim ugovornim uvjetima.'] },
        { heading: 'Oprez', paragraphs: [`${company} nikada od vas neće tražiti podatke za prijavu u internetsko bankarstvo e-poštom ili porukom, niti uplatu bilo kakvog iznosa prije izdavanja pisane ponude. Posumnjate li u vjerodostojnost neke komunikacije, obratite nam se izravno putem službenih kontakata navedenih na ovoj web-stranici.`] },
      ],
    },
  },
};
