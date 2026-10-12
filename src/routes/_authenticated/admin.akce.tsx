// Administrace: akce, pozvánky a oznámení.
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
import { obsahQuery, type ObsahAkce, type ObsahPravidelna } from "@/lib/obsah.functions";
import { posunoutRadek, smazatRadek, ulozitRadek } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/akce")({
  head: () => ({
    meta: [
      { title: "Akce a oznámení – administrace – Hostinec U Jandů" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AkceAdmin,
});

function RadekAkce({ akce }: { akce: ObsahAkce }) {
  const ulozit = useServerFn(ulozitRadek);
  const smazat = useServerFn(smazatRadek);
  const posunout = useServerFn(posunoutRadek);
  const uloz = useUloziti();
  const [datum, setDatum] = useState(akce.datum);
  const [nadpis, setNadpis] = useState(akce.nadpis);
  const [text, setText] = useState(akce.text);
  const [nove, setNove] = useState(akce.nove);

  return (
    <div className="frame mb-2 bg-beer/20 p-2">
      <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Polek label="Datum (volitelné)" hodnota={datum} zmena={setDatum} placeholder="pátek 24. 10." />
        <Polek label="Nadpis" hodnota={nadpis} zmena={setNadpis} />
      </div>
      <div className="mt-1">
        <DlouhePole label="Text" hodnota={text} zmena={setText} />
      </div>
      <label className="mt-1 block text-xs font-bold">
        <input
          type="checkbox"
          checked={nove}
          onChange={(e) => setNove(e.target.checked)}
          className="mr-1 align-middle"
        />
        Zobrazit s výkřičkem „NOVÉ!“
      </label>
      <Pravida>
        <Tlacitko
          onClick={() =>
            uloz(ulozit({ data: { tabulka: "akce", id: akce.id, data: { datum, nadpis, text, nove } } }))
          }
        >
          Uložit
        </Tlacitko>
        <Tlacitko
          onClick={() => uloz(posunout({ data: { tabulka: "akce", id: akce.id, smer: -1 } }))}
        >
          ↑ Nahoru
        </Tlacitko>
        <Tlacitko
          onClick={() => uloz(posunout({ data: { tabulka: "akce", id: akce.id, smer: 1 } }))}
        >
          ↓ Dolů
        </Tlacitko>
        <Tlacitko
          varhovat={`Opravdu smazat „${nadpis}“?`}
          onClick={() => uloz(smazat({ data: { tabulka: "akce", id: akce.id } }), "Smazáno.")}
        >
          Smazat
        </Tlacitko>
      </Pravida>
    </div>
  );
}

function RadekPravidelne({ polozka }: { polozka: ObsahPravidelna }) {
  const ulozit = useServerFn(ulozitRadek);
  const smazat = useServerFn(smazatRadek);
  const posunout = useServerFn(posunoutRadek);
  const uloz = useUloziti();
  const [nazev, setNazev] = useState(polozka.nazev);
  const [text, setText] = useState(polozka.text);

  return (
    <div className="frame mb-2 bg-beer/20 p-2">
      <Polek label="Název" hodnota={nazev} zmena={setNazev} />
      <div className="mt-1">
        <DlouhePole label="Text" hodnota={text} zmena={setText} />
      </div>
      <Pravida>
        <Tlacitko
          onClick={() =>
            uloz(ulozit({ data: { tabulka: "pravidelne", id: polozka.id, data: { nazev, text } } }))
          }
        >
          Uložit
        </Tlacitko>
        <Tlacitko
          onClick={() =>
            uloz(posunout({ data: { tabulka: "pravidelne", id: polozka.id, smer: -1 } }))
          }
        >
          ↑ Nahoru
        </Tlacitko>
        <Tlacitko
          onClick={() =>
            uloz(posunout({ data: { tabulka: "pravidelne", id: polozka.id, smer: 1 } }))
          }
        >
          ↓ Dolů
        </Tlacitko>
        <Tlacitko
          varhovat={`Opravdu smazat „${nazev}“?`}
          onClick={() => uloz(smazat({ data: { tabulka: "pravidelne", id: polozka.id } }), "Smazáno.")}
        >
          Smazat
        </Tlacitko>
      </Pravida>
    </div>
  );
}

function AkceAdmin() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const ulozit = useServerFn(ulozitRadek);
  const uloz = useUloziti();
  const [nova, setNova] = useState({ datum: "", nadpis: "", text: "" });
  const [novaPravidelna, setNovaPravidelna] = useState({ nazev: "", text: "" });

  return (
    <AdminShell titulek="Akce a oznámení">
      <h3 className="text-base underline">Oznámení (stránka Aktuálně a Úvod)</h3>
      <p className="mb-2 text-xs">
        Tady se objevuje termín nejbližších šipek, pozvánka na sraz nebo cokoliv nového.
      </p>
      {obsah.aktuality.map((a) => (
        <RadekAkce key={a.id} akce={a} />
      ))}
      <div className="frame mb-4 bg-beer/30 p-2">
        <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Polek
            label="Datum (volitelné)"
            hodnota={nova.datum}
            zmena={(v) => setNova((n) => ({ ...n, datum: v }))}
          />
          <Polek
            label="Nadpis"
            hodnota={nova.nadpis}
            zmena={(v) => setNova((n) => ({ ...n, nadpis: v }))}
          />
        </div>
        <div className="mt-1">
          <DlouhePole
            label="Text"
            hodnota={nova.text}
            zmena={(v) => setNova((n) => ({ ...n, text: v }))}
          />
        </div>
        <Tlacitko
          onClick={() => {
            if (!nova.nadpis.trim()) return;
            uloz(
              ulozit({
                data: {
                  tabulka: "akce",
                  data: {
                    datum: nova.datum.trim(),
                    nadpis: nova.nadpis.trim(),
                    text: nova.text.trim(),
                    nove: true,
                  },
                },
              }),
              "Oznámení přidáno.",
            ).then((v) => {
              if (v) setNova({ datum: "", nadpis: "", text: "" });
            });
          }}
        >
          Přidat oznámení
        </Tlacitko>
      </div>

      <h3 className="text-base underline">To, co se pravidelně opakuje</h3>
      <p className="mb-2 text-xs">
        Například „Turnaj v šipkách 301 single out – zhruba jednou za měsíc“.
      </p>
      {obsah.pravidelne.map((p) => (
        <RadekPravidelne key={p.id} polozka={p} />
      ))}
      <div className="frame bg-beer/30 p-2">
        <Polek
          label="Název"
          hodnota={novaPravidelna.nazev}
          zmena={(v) => setNovaPravidelna((n) => ({ ...n, nazev: v }))}
        />
        <div className="mt-1">
          <DlouhePole
            label="Text"
            hodnota={novaPravidelna.text}
            zmena={(v) => setNovaPravidelna((n) => ({ ...n, text: v }))}
          />
        </div>
        <Tlacitko
          onClick={() => {
            if (!novaPravidelna.nazev.trim()) return;
            uloz(
              ulozit({
                data: {
                  tabulka: "pravidelne",
                  data: {
                    nazev: novaPravidelna.nazev.trim(),
                    text: novaPravidelna.text.trim(),
                  },
                },
              }),
              "Přidáno.",
            ).then((v) => {
              if (v) setNovaPravidelna({ nazev: "", text: "" });
            });
          }}
        >
          Přidat pravidelnou akci
        </Tlacitko>
      </div>
    </AdminShell>
  );
}
