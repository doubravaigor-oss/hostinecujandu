// ================================================================
//  VŠECHNY TEXTY WEBU NA JEDNOM MÍSTĚ
//  Změny (jídelníček, akce, otevírací doba…) se dělají jen zde.
// ================================================================

export const kontakt = {
  nazev: "Hostinec U Jandů",
  obec: "Nadějkov",
  okres: "okres Tábor, Jihočeský kraj",
  adresa: "Nadějkov (přesná adresa bude doplněna)",
  telefon: "732 350 877",
  telefonOdkaz: "tel:+420732350877",
  facebook: "", // doplnit přesný odkaz na Facebook, až bude známý
  mapaOdkaz: "https://www.google.com/maps/search/?api=1&query=Hostinec+U+Jand%C5%AF+Nad%C4%9Bjkov",
  mapaVlozena: "https://www.google.com/maps?q=Nad%C4%9Bjkov&z=14&output=embed",
};

export const oteviraciDoba: { den: string; cas: string }[] = [
  { den: "Pondělí – Čtvrtek", cas: "zavřeno" },
  { den: "Pátek", cas: "otevřeno – hodiny doplníme" },
  { den: "Sobota", cas: "otevřeno – hodiny doplníme" },
  { den: "Neděle", cas: "otevřeno – hodiny doplníme" },
];

export type Polozka = { nazev: string; cena: string };
export const jidelniListek: { kategorie: string; polozky: Polozka[] }[] = [
  {
    kategorie: "Hospodská kuchyně",
    polozky: [
      { nazev: "Řízek s bramborovým salátem", cena: "cenu doplníme" },
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
