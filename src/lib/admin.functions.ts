// Ukládání změn z administrace. Každý zápis nejdřív server ověří –
// právo má jen účet, který má v tabulce user_roles roli „admin“.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

type Tabelka =
  | "kategorie"
  | "polozky"
  | "fotky"
  | "akce"
  | "pravidelne"
  | "hodiny"
  | "zmeny";

const Tabelky: Record<Tabelka, { tabela: string; sloupce: string[] }> = {
  kategorie: { tabela: "menu_kategorie", sloupce: ["nazev", "poradi"] },
  polozky: {
    tabela: "menu_polozky",
    sloupce: ["kategorie_id", "nazev", "cena", "popis", "poradi"],
  },
  fotky: { tabela: "fotky", sloupce: ["asset_url", "storage_path", "popis", "poradi"] },
  akce: { tabela: "akce", sloupce: ["datum", "nadpis", "text", "nove", "foto_id", "poradi"] },
  pravidelne: { tabela: "pravidelne_akce", sloupce: ["nazev", "text", "poradi"] },
  hodiny: { tabela: "hodiny", sloupce: ["den", "cas", "poradi"] },
  zmeny: { tabela: "hodiny_zmeny", sloupce: ["text", "platnost"] },
};

const JmenoTabelky = z.enum([
  "kategorie",
  "polozky",
  "fotky",
  "akce",
  "pravidelne",
  "hodiny",
  "zmeny",
]);

// Údaje o dnešním dni v pražském čase, ve formátu „12. 10. 2026“.
function dnesniDatum(): string {
  try {
    return new Intl.DateTimeFormat("cs-CZ", {
      timeZone: "Europe/Prague",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date());
  } catch {
    const d = new Date();
    return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
  }
}

async function prepisDb(context: { supabase: unknown }) {
  return context.supabase as {
    from(tabela: string): any;
    rpc(fn: string, args: Record<string, unknown>): Promise<{
      data?: unknown;
      error?: { message: string } | null;
    }>;
  };
}

async function musiBytAdmin(
  db: { rpc(fn: string, args: Record<string, unknown>): Promise<{ data?: unknown }> },
  userId: string,
) {
  const { data } = await db.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) {
    throw new Error("Sem nemáte přístup. Přihlaste se účtem, který má právo editovat web.");
  }
}

async function zaznamenatZmenu(db: { from(t: string): any }) {
  await db.from("nastaveni").upsert({ klic: "naposledy", hodnota: dnesniDatum() });
}

const VstupUlozit = z.object({
  tabulka: JmenoTabelky,
  id: z.string().uuid().optional(),
  data: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

export const ulozitRadek = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => VstupUlozit.parse(v))
  .handler(async ({ data, context }) => {
    const db = await prepisDb(context);
    await musiBytAdmin(db, context.userId);
    const definice = Tabelky[data.tabulka];

    const udaje: Record<string, unknown> = { ...data.data };
    for (const klic of Object.keys(udaje)) {
      if (!definice.sloupce.includes(klic)) {
        throw new Error("Tenhle údaj se nedá upravit: " + klic);
      }
    }

    if (!data.id && definice.sloupce.includes("poradi") && udaje["poradi"] === undefined) {
      const { data: posledni } = await db
        .from(definice.tabela)
        .select("poradi")
        .order("poradi", { ascending: false })
        .limit(1)
        .maybeSingle();
      udaje["poradi"] = Number(posledni?.["poradi"] ?? 0) + 10;
    }

    let vysledek;
    if (data.id) {
      vysledek = await db.from(definice.tabela).update(udaje).eq("id", data.id);
    } else {
      vysledek = await db.from(definice.tabela).insert(udaje);
    }
    if (vysledek.error) {
      throw new Error("Nepodařilo se uložit: " + vysledek.error.message);
    }
    await zaznamenatZmenu(db);
    return { ok: true as const };
  });

const VstupSmazat = z.object({ tabulka: JmenoTabelky, id: z.string().uuid() });

export const smazatRadek = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => VstupSmazat.parse(v))
  .handler(async ({ data, context }) => {
    const db = await prepisDb(context);
    await musiBytAdmin(db, context.userId);
    const definice = Tabelky[data.tabulka];
    const { error } = await db.from(definice.tabela).delete().eq("id", data.id);
    if (error) throw new Error("Nepodařilo se smazat: " + error.message);
    await zaznamenatZmenu(db);
    return { ok: true as const };
  });

const VstupPosun = z.object({
  tabulka: JmenoTabelky,
  id: z.string().uuid(),
  smer: z.union([z.literal(-1), z.literal(1)]),
  kategorieId: z.string().uuid().optional(),
});

export const posunoutRadek = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => VstupPosun.parse(v))
  .handler(async ({ data, context }) => {
    const db = await prepisDb(context);
    await musiBytAdmin(db, context.userId);
    const definice = Tabelky[data.tabulka];
    if (!definice.sloupce.includes("poradi")) {
      throw new Error("Tuhle část webu nelze přeskládat.");
    }

    const { data: radek, error: chybaRadku } = await db
      .from(definice.tabela)
      .select("poradi")
      .eq("id", data.id)
      .maybeSingle();
    if (chybaRadku || !radek) {
      throw new Error("Položku jsem nenašel – zkuste stránku obnovit.");
    }

    let hledat = db.from(definice.tabela).select("id, poradi");
    if (data.smer === 1) {
      hledat = hledat.gt("poradi", radek.poradi).order("poradi", { ascending: true });
    } else {
      hledat = hledat.lt("poradi", radek.poradi).order("poradi", { ascending: false });
    }
    if (data.kategorieId && definice.sloupce.includes("kategorie_id")) {
      hledat = hledat.eq("kategorie_id", data.kategorieId);
    }
    const { data: druhy } = await hledat.limit(1).maybeSingle();
    if (!druhy) return { ok: true as const };

    const { error: e1 } = await db
      .from(definice.tabela)
      .update({ poradi: druhy.poradi })
      .eq("id", data.id);
    const { error: e2 } = await db
      .from(definice.tabela)
      .update({ poradi: radek.poradi })
      .eq("id", druhy.id);
    if (e1 || e2) throw new Error("Přeskupení se nezdařilo.");
    await zaznamenatZmenu(db);
    return { ok: true as const };
  });

const VstupText = z.object({
  klic: z.enum(["banner", "kuchyne_nadpis", "kuchyne_text"]),
  hodnota: z.string().max(600),
});

export const ulozitText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => VstupText.parse(v))
  .handler(async ({ data, context }) => {
    const db = await prepisDb(context);
    await musiBytAdmin(db, context.userId);
    const { error } = await db
      .from("nastaveni")
      .upsert({ klic: data.klic, hodnota: data.hodnota });
    if (error) throw new Error("Nepodařilo se uložit: " + error.message);
    await zaznamenatZmenu(db);
    return { ok: true as const };
  });

export const jestAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await prepisDb(context);
    const { data } = await db.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { admin: Boolean(data) };
  });
