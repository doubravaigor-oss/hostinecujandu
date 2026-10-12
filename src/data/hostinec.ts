import rizekFoto from "@/assets/rizek.jpg.asset.json";
import f1 from "@/assets/foto1.jpg.asset.json";
import f2 from "@/assets/foto2.jpg.asset.json";
import f3 from "@/assets/foto3.jpg.asset.json";
import f4 from "@/assets/foto4.jpg.asset.json";
import f5 from "@/assets/foto5.jpg.asset.json";
import f6 from "@/assets/foto6.jpg.asset.json";
import f7 from "@/assets/foto7.jpg.asset.json";
import f8 from "@/assets/foto8.jpg.asset.json";
import f9 from "@/assets/foto9.jpg.asset.json";
import f10 from "@/assets/foto10.jpg.asset.json";
// ================================================================
//  VŠECHNY TEXTY WEBU NA JEDNOM MÍSTĚ
//  Změny (jídelníček, akce, otevírací doba…) se dělají jen zde.
// ================================================================

export const kontakt = {
  nazev: "Hostinec U Jandů",
  obec: "Nadějkov",
  okres: "okres Tábor, Jihočeský kraj",
  adresa: "Náměstí Prokopa Chocholouška 18",
  telefon: "732 350 877",
  telefonOdkaz: "tel:+420732350877",
  email: "doubrava.igor@gmail.com",
  facebook: "https://www.facebook.com/p/Hostinec-u-Jand%C5%AF-100083607960708/",
  mapaOdkaz: "https://www.google.com/maps/search/?api=1&query=N%C3%A1m%C4%9Bst%C3%AD+Prokopa+Chocholou%C5%A1ka+18%2C+Nad%C4%9Bjkov",
  mapaVlozena: "https://www.google.com/maps?q=N%C3%A1m%C4%9Bst%C3%AD%20Prokopa%20Chocholou%C5%A1ka%2018%2C%20Nad%C4%9Bjkov&z=17&output=embed",
  // Odkaz na napsání hodnocení na Mapách Google (QR kód v sekci Kontakt)
  hodnoceni: "https://search.google.com/local/writereview?placeid=ChIJ38GQeexhC0cR2YeFSGEPXLo",
  hodnoceniMisto: "https://www.google.com/maps/place/?q=place_id:ChIJ38GQeexhC0cR2YeFSGEPXLo",
};

export const oteviraciDoba: { den: string; cas: string }[] = [
  { den: "Pondělí – Čtvrtek", cas: "zavřeno" },
  { den: "Pátek", cas: "17:00 – 22:00" },
  { den: "Sobota", cas: "17:00 – 22:00" },
  { den: "Neděle", cas: "17:00 – 22:00" },
];

export type Polozka = { nazev: string; cena: string; popis?: string };
export const jidelniListek: { kategorie: string; polozky: Polozka[] }[] = [
  {
    kategorie: "K jídlu",
    polozky: [
      { nazev: "Petrovický utopenec s chlebem", cena: "75 Kč", popis: "★ Legenda k pivu! Pikantní buřt plněný okurkou, paprikou a feferonkou, naložený s cibulí v octovém nálevu. Pro ty, co mají rádi pořádně od plic." },
      { nazev: "Vinárníkovy tousty", cena: "85 Kč", popis: "★ Receptura od vinárníka Mirka až z pražských Kobylis. Toust bohatě naplněný – tři omáčky, beraní rohy a nic se tu nešetří." },
      { nazev: "Nakládaný hermelín", cena: "90 Kč", popis: "★ Česká hospodská klasika. Naložený hermelín – s chlebem a vychlazeným pivem nemá konkurenci." },
      { nazev: "Ďábelská topinka", cena: "90 Kč", popis: "★ Vaříme jen občas, když ji máme. Nálož masa na smaženém chlebu, sypaná goudou, k tomu kyselá zelenina – čirá radost." },
      { nazev: "Pizza della casa", cena: "165 Kč", popis: "★ Pizza od pražské rodinné firmy Pizza Della Casa – tradiční italská receptura a kvalitní suroviny. Rovnou k pivu." },
      { nazev: "Táboráček", cena: "50 Kč" },
    ],
  },
  {
    kategorie: "Drobné pochutiny",
    polozky: [
      { nazev: "Chipsy (Lays, různé příchutě)", cena: "38 Kč" },
      { nazev: "Oříšky", cena: "38 Kč" },
      { nazev: "Tyčinky pekařské solené", cena: "38 Kč" },
      { nazev: "U nás pražené červené arašídy, solené", cena: "45 Kč" },
    ],
  },
  { kategorie: "Čepované pivo", polozky: [
    { nazev: "Radegast 10° – 0,5 l", cena: "41 Kč" },
    { nazev: "Radegast 10° – 0,3 l", cena: "28 Kč" },
    { nazev: "Plzeň 12° – 0,5 l", cena: "54 Kč" },
    { nazev: "Plzeň 12° – 0,3 l", cena: "37 Kč" },
    { nazev: "Nealkoholické pivo (dle nabídky) – 0,5 l", cena: "40 Kč" },
  ] },
  { kategorie: "Nealko nápoje", polozky: [
    { nazev: "Limonáda ZON, různé příchutě – 0,33 l sklo", cena: "29 Kč" },
    { nazev: "Tonic ZON – 0,33 l", cena: "29 Kč" },
    { nazev: "Jemně perlivá voda ZON – 0,33 l", cena: "24 Kč" },
    { nazev: "Malina Johannes Limo – 0,33 l", cena: "54 Kč" },
    { nazev: "Matcha Johannes Limo – 0,33 l", cena: "54 Kč" },
    { nazev: "Coca-Cola – 0,3 l", cena: "35 Kč" },
    { nazev: "Pomerančový džus – 0,3 l", cena: "39 Kč" },
    { nazev: "Jablečný džus – 0,3 l", cena: "39 Kč" },
    { nazev: "Minerální voda Il Sano (citron, pomeranč, speciál) – 0,5 l", cena: "30 Kč" },
  ] },
  { kategorie: "Víno a cidery", polozky: [
    { nazev: "Víno bílé a červené dle aktuální nabídky – 2 dcl", cena: "60 Kč" },
    { nazev: "Prosecco", cena: "60 Kč" },
    { nazev: "Svařené víno", cena: "50 Kč" },
    { nazev: "Johannes Cyder Extra Brut – 0,33 l", cena: "62 Kč" },
    { nazev: "Johannes Cyder Demi Sec – 0,33 l", cena: "62 Kč" },
  ] },
  { kategorie: "Teplé nápoje", polozky: [
    { nazev: "Turek", cena: "26 Kč" },
    { nazev: "Espresso", cena: "40 Kč" },
    { nazev: "Doppio", cena: "50 Kč" },
    { nazev: "Cappuccino", cena: "45 Kč" },
    { nazev: "Latte", cena: "50 Kč" },
    { nazev: "Čaj (různé druhy)", cena: "40 Kč" },
    { nazev: "Grog", cena: "45 Kč" },
    { nazev: "Punč", cena: "55 Kč" },
    { nazev: "Horké mléko – 0,3 l", cena: "30 Kč" },
  ] },
  { kategorie: "Destiláty (4 cl / 2 cl)", polozky: [
    { nazev: "Finlandia", cena: "50 / 26 Kč" },
    { nazev: "Elixír z bezového květu", cena: "40 / 21 Kč" },
    { nazev: "Tuzemák", cena: "35 / 19 Kč" },
    { nazev: "Fernet", cena: "45 / 23 Kč" },
    { nazev: "Becherovka", cena: "45 / 23 Kč" },
    { nazev: "Griotka", cena: "35 / 19 Kč" },
    { nazev: "Moravská švestka bílá", cena: "50 / 26 Kč" },
    { nazev: "Jägermeister", cena: "60 / 32 Kč" },
    { nazev: "Baileys", cena: "75 / 39 Kč" },
    { nazev: "Beefeater", cena: "60 / 31 Kč" },
    { nazev: "Zelená", cena: "35 / 19 Kč" },
    { nazev: "Bezový likér z květu", cena: "39 / 21 Kč" },
    { nazev: "Jack Daniel's Honey", cena: "69 / 37 Kč" },
    { nazev: "Tullamore Dew", cena: "63 / 32 Kč" },
  ] },
  { kategorie: "Míchané nápoje (0,3 l)", polozky: [
    { nazev: "Tuzemák & Cola", cena: "65 Kč" },
    { nazev: "Becherovka & Tonic", cena: "70 Kč" },
    { nazev: "Gin & Tonic", cena: "84 Kč" },
    { nazev: "Finlandia & pomerančový džus", cena: "79 Kč" },
  ] },
];

// Benefit kuchyně (zadáno majitelem – na webu jako hlavní přednost)
export const kuchyneSlib = {
  nadpis: "Vaříme pouze z čerstvých surovin!",
  text: "Když u nás vaříme, snažíme se používat pouze čerstvé suroviny – bez umělých dochucovadel. Zážitek z čerstvě zpracovaných kvalitních surovin. Bez výmluv.",
};

// Stav webu – pásek "ještě se buduje" a údaj o posledním doplnění.
// Až něco doplníte, přepište datum naposledyDoplneno.
export const stavWebu = {
  podKonstrukci: ">>> TENTO WEB JEŠTĚ DOPLŇUJEME – fotky a termíny akcí brzy <<<",
  naposledyDoplneno: "12. 10. 2026",
};

// Malé plakety v patičce (retro tlačítka z starých webů)
export const plakety: string[] = [
  "Nejlépe zobrazíte v jakémkoliv prohlížeči",
  "800×600",
  "Staré HTML",
  "Vyrobeno s láskou ke starým webům",
];

// Pravidelné akce, které se v hospodě opakují
export const pravidelneAkce: { nazev: string; text: string }[] = [
  {
    nazev: "Turnaj v šipkách",
    text: "Pořádáme turnaj v šipkách 301 single out – zhruba jednou za měsíc. Konkrétní termín vždy upřesníme na Facebooku.",
  },
];

// Co všechno umíme zajistit – vše na přání zákazníka
export const nabidkaOslav: string[] = [
  "Třídní srazy a setkání",
  "Narozeninové oslavy a výročí",
  "Pohřební hostiny",
  "Konference a firemní akce",
  "Rauty a společenská setkání",
  "Svatební a jiné slavnostní hostiny",
  "Další akce podle přání zákazníka",
];

// Co už jsme za rok a půl uspořádali (zadáno majitelem – přepisovat doslova)
export const usporadaneAkce: string[] = [
  "Autentická čínská hostina",
  "Snídaně / brunch hotelového typu",
  "Narozeninové oslavy – formou zanášeného jídla i rautu, se zábavou a veselicí",
  "Občerstvení na pochodech",
  "Občerstvení na Svatováclavské Potulce",
  "Smuteční hostiny",
];

export const aktuality: { datum: string; nadpis: string; text: string; nove?: boolean }[] = [
  {
    datum: "",
    nadpis: "Nový web hostince je spuštěn!",
    text: "Vítejte na našich nových stránkách. Brzy zde najdete víkendovou nabídku a termíny dalších akcí.",
    nove: true,
  },
];

// Fotky: přidávají se sem (src = adresa obrázku, popis = text pod fotkou)
export const fotky: { src: string; popis: string }[] = [
  { src: rizekFoto.url, popis: "Řízky s bramborovým salátem" },
  { src: f4.url, popis: "Velký sál připravený na hostinu" },
  { src: f7.url, popis: "Hostinec prostřený pro hosty" },
  { src: f5.url, popis: "Snídaně / brunch hotelového typu" },
  { src: f2.url, popis: "Studené mísy na raut" },
  { src: f8.url, popis: "Řízky a salát na raut" },
  { src: f3.url, popis: "Obložené chlebíčky" },
  { src: f9.url, popis: "Snídaně s proseccem" },
  { src: f1.url, popis: "Uzené, klobása, knedlík a zelí" },
  { src: f10.url, popis: "Ďábelská topinka" },
  { src: f6.url, popis: "Prostřený stůl" },
];

// Firmy a konference (fakta od majitele: sál 100–150, salonek 20, hospoda 70, Parkhotel Mozolov 3 km)
export const proFirmy: string[] = [
  "Sál pro 100–150 osob, salonek pro 20 osob, hospoda pro 70 osob",
  "Ubytování v Parkhotelu Mozolov – jen 3 km od nás",
  "Coffee break, oběd, raut i snídaně / brunch hotelového typu",
  "Klidné venkovské prostředí – ideální na školení, porady a teambuilding",
];

// Pronájem prostor pro soukromé akce (zadáno majitelem – přepisovat doslova)
export const pronajemProstor: string[] = [
  "Prostor na vaši vlastní soukromou akci – oslava, setkání i rodinná slavnost",
  "Hospoda pro 70 osob, sál pro 100–150 osob, salonek pro 20 osob",
  "Pohoštění i rozsah akce řešíme vždy individuálně – nabídku děláme na míru",
  "Parkování přímo před objektem",
];

// Rámeček s QR kódem na hodnocení na Googlu (zobrazuje se na Úvodu i v Kontaktu)
export const hodnoceniText = {
  nadpis: "★ Napište nám hodnocení ★",
  hlavni: "Byli jste u nás? Dejte o nás vědět.",
  napoveda:
    "Namiřte foťák telefonu na tento QR kód – otevře se okno pro hodnocení na Mapách Google. Zabere to půl minuty a nám to pomůže víc než sebelepší reklama.",
  tlacitko: "★ Napsat hodnocení",
  mapa: "➜ Ukázat na mapě",
  poznamka: "Hodnocení se odesílá z vašeho účtu Google. Děkujeme a těšíme se na viděnou!",
};

export const hraText = {
  nadpis: "Cihličky – hostinecká herna",
  pripravena: "CIHLIČKY",
  pauza: "PAUZA",
  vyhra: "Všechny cihličky dole. Na zdraví!",
  konec: "Míček utekl. Odveta?",
};
