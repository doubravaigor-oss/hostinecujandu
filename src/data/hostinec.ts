import rizekFoto from "@/assets/rizek.jpg.asset.json";
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
      { nazev: "Chipsy", cena: "38 Kč" },
      { nazev: "Oříšky", cena: "38 Kč" },
    ],
  },
  { kategorie: "Víkendové speciality", polozky: [] },
  { kategorie: "Čepované pivo", polozky: [] },
  { kategorie: "Nealko a ostatní nápoje", polozky: [] },
];

// Benefit kuchyně (zadáno majitelem – na webu jako hlavní přednost)
export const kuchyneSlib = {
  nadpis: "Vaříme pouze z čerstvých surovin!",
  text: "Když u nás vaříme, snažíme se používat pouze čerstvé suroviny – bez umělých dochucovadel. Zážitek z čerstvě zpracovaných kvalitních surovin. Chceme, abyste na venkově získali to, kvůli čemu tam žijete.",
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
    text: "Pořádáme turnaj v šipkách 301 single out – zhruba jednou za měsíc. Konkrétní termín vždy upřesníme po telefonu.",
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
];
