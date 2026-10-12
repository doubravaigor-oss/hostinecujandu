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

export type Polozka = { nazev: string; cena: string };
export const jidelniListek: { kategorie: string; polozky: Polozka[] }[] = [
  {
    kategorie: "K jídlu",
    polozky: [
      { nazev: "Utopenec s chlebem", cena: "75 Kč" },
      { nazev: "Vinárníkovy tousty", cena: "85 Kč" },
      { nazev: "Nakládaný hermelín", cena: "90 Kč" },
      { nazev: "Ďábelská topinka", cena: "90 Kč" },
      { nazev: "Pizza della casa", cena: "165 Kč" },
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

export const aktuality: { datum: string; nadpis: string; text: string; nove?: boolean }[] = [
  {
    datum: "",
    nadpis: "Nový web hostince je spuštěn!",
    text: "Vítejte na našich nových stránkách. Brzy zde najdete víkendovou nabídku, šipkové turnaje a další akce.",
    nove: true,
  },
];

// Fotky: přidávají se sem (src = adresa obrázku, popis = text pod fotkou)
export const fotky: { src: string; popis: string }[] = [];
