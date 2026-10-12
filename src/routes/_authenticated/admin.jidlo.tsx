// Administrace: jídelní a nápojový lístek.
import { createFileRoute, useServerFn } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  AdminShell,
  DlouhePole,
  Polek,
  Pravida,
  Tlacitko,
  useUloziti,
} from "@/components/Admin";
import { obsahQuery, type ObsahKategorie, type ObsahPolozka } from "@/lib/obsah.functions";
import { posunoutRadek, smazatRadek, ulozitRadek } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/jidlo")({
  head: () => ({
    meta: [
      { title: "Jídelní lístek – administrace – Hostinec U Jandů" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: JidloAdmin,
});

function RadekPolozky({ polozka, kategorieId }: { polozka: ObsahPolozka; kategorieId: string }) {
  const ulozit = useServerFn(ulozitRadek);
  const smazat = useServerFn(smazatRadek);
  const posunout = useServerFn(posunoutRadek);
  const uloz = useUloziti();
  const [nazev, setNazev] = useState(polozka.nazev);
  const [cena, setCena] = useState(polozka.cena);
  const [popis, setPopis] = useState(polozka.popis);

  return (
    <div className="frame mb-2 bg-beer/20 p-2">
      <div className="grid gap-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Polek label="Název" hodnota={nazev} zmena={setNazev} />
        <Polek label="Cena" hodnota={cena} zmena={setCena} />
      </div>
      <div className="mt-1">
        <DlouhePole label="Popisek (není povinný)" hodnota={popis} zmena={setPopis} />
      </div>
      <Pravida>
        <Tlacitko
          onClick={() =>
            uloz(ulozit({ data: { tabulka: "polozky", id: polozka.id, data: { nazev, cena, popis } } }))
          }
        >
          Uložit
        </Tlacitko>
        <Tlacitko
          onClick={() =>
            uloz(posunout({ data: { tabulka: "polozky", id: polozka.id, smer: -1, kategorieId } }))
          }
        >
          ↑ Nahoru
        </Tlacitko>
        <Tlacitko
          onClick={() =>
            uloz(posunout({ data: { tabulka: "polozky", id: polozka.id, smer: 1, kategorieId } }))
          }
        >
          ↓ Dolů
        </Tlacitko>
        <Tlacitko
          varhovat={`Opravdu smazat „${nazev}“ z lístku?`}
          onClick={() => uloz(smazat({ data: { tabulka: "polozky", id: polozka.id } }), "Smazáno.")}
        >
          Smazat
        </Tlacitko>
      </Pravida>
    </div>
  );
}

function SekceKategorie({ kategorie }: { kategorie: ObsahKategorie }) {
  const ulozit = useServerFn(ulozitRadek);
  const smazat = useServerFn(smazatRadek);
  const posunout = useServerFn(posunoutRadek);
  const uloz = useUloziti();
  const [nazev, setNazev] = useState(kategorie.nazev);
  const [nova, setNova] = useState({ nazev: "", cena: "" });

  function pridat() {
    if (!nova.nazev.trim()) return;
    uloz(
      ulozit({
        data: {
          tabulka: "polozky",
          data: { kategorie_id: kategorie.id, nazev: nova.nazev.trim(), cena: nova.cena.trim() },
        },
      }),
      "Přidáno.",
    ).then((vysledek) => {
      if (vysledek) setNova({ nazev: "", cena: "" });
    });
  }

  return (
    <div className="frame mb-3 p-2">
      <div className="grid gap-1 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <Polek label="Název kategorie" hodnota={nazev} zmena={setNazev} />
        <div className="text-xs text-muted-foreground">
          {kategorie.polozky.length} položek
        </div>
      </div>
      <Pravida>
        <Tlacitko
          onClick={() =>
            uloz(ulozit({ data: { tabulka: "kategorie", id: kategorie.id, data: { nazev } } }))
          }
        >
          Uložit název
        </Tlacitko>
        <Tlacitko
          onClick={() => uloz(posunout({ data: { tabulka: "kategorie", id: kategorie.id, smer: -1 } }))}
        >
          ↑ Nahoru
        </Tlacitko>
        <Tlacitko
          onClick={() => uloz(posunout({ data: { tabulka: "kategorie", id: kategorie.id, smer: 1 } }))}
        >
          ↓ Dolů
        </Tlacitko>
        <Tlacitko
          varhovat={`Opravdu smazat kategorii „${nazev}“? Smažou se i všechny položky v ní.`}
          onClick={() => uloz(smazat({ data: { tabulka: "kategorie", id: kategorie.id } }), "Smazáno.")}
        >
          Smazat kategorii
        </Tlacitko>
      </Pravida>

      <div className="mt-2">
        {kategorie.polozky.map((p) => (
          <RadekPolozky key={p.id} polozka={p} kategorieId={kategorie.id} />
        ))}
        {kategorie.polozky.length === 0 && (
          <p className="text-xs italic">Zatím tu nic není – přidejte první položku níže.</p>
        )}
      </div>

      <div className="frame mt-2 bg-beer/30 p-2">
        <div className="grid gap-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Polek
            label="Nová položka – název"
            hodnota={nova.nazev}
            zmena={(v) => setNova((n) => ({ ...n, nazev: v }))}
          />
          <Polek
            label="Cena"
            hodnota={nova.cena}
            zmena={(v) => setNova((n) => ({ ...n, cena: v }))}
            placeholder="např. 75 Kč"
          />
        </div>
        <Tlacitko onClick={pridat}>Přidat do této kategorie</Tlacitko>
      </div>
    </div>
  );
}

function JidloAdmin() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const ulozit = useServerFn(ulozitRadek);
  const uloz = useUloziti();
  const [novaKategorie, setNovaKategorie] = useState("");

  return (
    <AdminShell titulek="Jídelní a nápojový lístek">
      <p className="mb-3 text-xs">
        U každé položky upravte <b>název</b>, <b>cenu</b> a případně <b>popisek</b>. Až budete hotoví,
        klikněte na <b>Uložit</b>. Šipkami položku přesunete výš nebo níž.
      </p>

      {obsah.kategorie.map((k) => (
        <SekceKategorie key={k.id} kategorie={k} />
      ))}

      <div className="frame bg-beer/30 p-2">
        <Polek
          label="Nová kategorie (například „Domácí limonády“)"
          hodnota={novaKategorie}
          zmena={setNovaKategorie}
        />
        <Tlacitko
          onClick={() => {
            if (!novaKategorie.trim()) return;
            uloz(
              ulozit({ data: { tabulka: "kategorie", data: { nazev: novaKategorie.trim() } } }),
              "Kategorie přidána.",
            ).then((vysledek) => {
              if (vysledek) setNovaKategorie("");
            });
          }}
        >
          Přidat kategorii
        </Tlacitko>
      </div>
    </AdminShell>
  );
}
