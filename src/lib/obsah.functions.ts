// Čtení obsahu webu z databáze (Lovable Cloud).
// Veřejná data – čte se bez přihlášení. Když se cokoliv nezdaří, vrátí prázdný
// výsledek a web se pak samořejmě opře o údaje v src/data/hostinec.ts.
import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  aktuality,
  fotky as statickeFotky,
  jidelniListek,
  kuchyneSlib,
  oteviraciDoba,
  pravidelneAkce,
  stavWebu,
} from "@/data/hostinec";

export type ObsahPolozka = { id: string; nazev: string; cena: string; popis: string };
export type ObsahKategorie = { id: string; nazev: string; polozky: ObsahPolozka[] };
export type ObsahFotka = { id: string; src: string; popis: string };
export type ObsahAkce = {
  id: string;
  datum: string;
  nadpis: string;
  text: string;
  nove: boolean;
  foto: string | null;
};
export type ObsahPravidelna = { id: string; nazev: string; text: string };
export type ObsahHodiny = { id: string; den: string; cas: string };
export type ObsahZmena = { id: string; text: string; platnost: string };
export type ObsahTexty = {
  banner: string;
  naposledy: string;
  kuchyne_nadpis: string;
  kuchyne_text: string;
};

export type Obsah = {
  kategorie: ObsahKategorie[];
  fotky: ObsahFotka[];
  aktuality: ObsahAkce[];
  pravidelne: ObsahPravidelna[];
  hodiny: ObsahHodiny[];
  zmeny: ObsahZmena[];
  texty: ObsahTexty;
};

const PRAZDNY: Obsah = {
  kategorie: [],
  fotky: [],
  aktuality: [],
  pravidelne: [],
  hodiny: [],
  zmeny: [],
  texty: { banner: "", naposledy: "", kuchyne_nadpis: "", kuchyne_text: "" },
};

// Klent s veřejným klíčem – smí jen číst to, co je záměrně veřejné.
function verejnyKlient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getObsah = createServerFn({ method: "GET" }).handler(
  async (): Promise<Obsah> => {
    try {
      const db = verejnyKlient();
      const [kat, pol, fo, ac, pr, ho, zm, te] = await Promise.all([
        db.from("menu_kategorie").select("id, nazev").order("poradi"),
        db
          .from("menu_polozky")
          .select("id, kategorie_id, nazev, cena, popis")
          .order("poradi"),
        db.from("fotky").select("id, popis, asset_url, storage_path").order("poradi"),
        db
          .from("akce")
          .select("id, datum, nadpis, text, nove, foto_id")
          .order("poradi"),
        db.from("pravidelne_akce").select("id, nazev, text").order("poradi"),
        db.from("hodiny").select("id, den, cas").order("poradi"),
        db
          .from("hodiny_zmeny")
          .select("id, text, platnost")
          .order("created_at", { ascending: false }),
        db.from("nastaveni").select("klic, hodnota"),
      ]);
      if (
        kat.error ||
        pol.error ||
        fo.error ||
        ac.error ||
        pr.error ||
        ho.error ||
        zm.error ||
        te.error
      ) {
        return PRAZDNY;
      }

      const srcFotek = new Map<string, string>();
      const fotky: ObsahFotka[] = (fo.data ?? []).map((f) => {
        const src = f.asset_url ?? (f.storage_path ? `/api/public/fotka/${f.id}` : "");
        srcFotek.set(f.id, src);
        return { id: f.id, src, popis: f.popis };
      });

      const kategorie: ObsahKategorie[] = (kat.data ?? []).map((k) => ({
        id: k.id,
        nazev: k.nazev,
        polozky: (pol.data ?? [])
          .filter((p) => p.kategorie_id === k.id)
          .map((p) => ({ id: p.id, nazev: p.nazev, cena: p.cena, popis: p.popis })),
      }));

      const texty: Record<string, string> = {};
      for (const t of te.data ?? []) texty[t.klic] = t.hodnota;

      return {
        kategorie,
        fotky,
        aktuality: (ac.data ?? []).map((a) => ({
          id: a.id,
          datum: a.datum,
          nadpis: a.nadpis,
          text: a.text,
          nove: a.nove,
          foto: a.foto_id ? (srcFotek.get(a.foto_id) ?? null) : null,
        })),
        pravidelne: (pr.data ?? []).map((p) => ({ id: p.id, nazev: p.nazev, text: p.text })),
        hodiny: (ho.data ?? []).map((h) => ({ id: h.id, den: h.den, cas: h.cas })),
        zmeny: (zm.data ?? []).map((z) => ({ id: z.id, text: z.text, platnost: z.platnost })),
        texty: {
          banner: texty["banner"] ?? "",
          naposledy: texty["naposledy"] ?? "",
          kuchyne_nadpis: texty["kuchyne_nadpis"] ?? "",
          kuchyne_text: texty["kuchyne_text"] ?? "",
        },
      };
    } catch {
      return PRAZDNY;
    }
  },
);

export const obsahQuery = queryOptions({
  queryKey: ["obsah"],
  queryFn: () => getObsah(),
});

// ===== Spojení s tím, co bylo doposud napsané přímo v src/data/hostinec.ts =====
// Když databáze na daném místě nic nevrátí, použije se hodnota ze souboru.

export function kategorieObsah(o: Obsah): ObsahKategorie[] {
  if (o.kategorie.length) return o.kategorie;
  return jidelniListek.map((k, i) => ({
    id: `k${i}`,
    nazev: k.kategorie,
    polozky: k.polozky.map((p, j) => ({
      id: `p${i}-${j}`,
      nazev: p.nazev,
      cena: p.cena,
      popis: p.popis ?? "",
    })),
  }));
}

export function fotkyObsah(o: Obsah): ObsahFotka[] {
  if (o.fotky.length) return o.fotky;
  return statickeFotky.map((f, i) => ({ id: `f${i}`, src: f.src, popis: f.popis }));
}

export function aktualityObsah(o: Obsah): ObsahAkce[] {
  if (o.aktuality.length) return o.aktuality;
  return aktuality.map((a, i) => ({
    id: `a${i}`,
    datum: a.datum,
    nadpis: a.nadpis,
    text: a.text,
    nove: Boolean(a.nove),
    foto: null,
  }));
}

export function pravidelneObsah(o: Obsah): ObsahPravidelna[] {
  if (o.pravidelne.length) return o.pravidelne;
  return pravidelneAkce.map((a, i) => ({ id: `r${i}`, nazev: a.nazev, text: a.text }));
}

export function hodinyObsah(o: Obsah): ObsahHodiny[] {
  if (o.hodiny.length) return o.hodiny;
  return oteviraciDoba.map((h, i) => ({ id: `h${i}`, den: h.den, cas: h.cas }));
}

export function textyObsah(o: Obsah): ObsahTexty {
  return {
    banner: o.texty.banner || stavWebu.podKonstrukci,
    naposledy: o.texty.naposledy || stavWebu.naposledyDoplneno,
    kuchyne_nadpis: o.texty.kuchyne_nadpis || kuchyneSlib.nadpis,
    kuchyne_text: o.texty.kuchyne_text || kuchyneSlib.text,
  };
}
