// Administrace: otevírací doba a mimořádné změny.
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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
import { obsahQuery, type ObsahHodiny, type ObsahZmena } from "@/lib/obsah.functions";
import { posunoutRadek, smazatRadek, ulozitRadek } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/hodiny")({
  head: () => ({
    meta: [
      { title: "Otevírací doba – administrace – Hostinec U Jandů" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HodinyAdmin,
});

function RadekHodin({ hodiny }: { hodiny: ObsahHodiny }) {
  const ulozit = useServerFn(ulozitRadek);
  const smazat = useServerFn(smazatRadek);
  const posunout = useServerFn(posunoutRadek);
  const uloz = useUloziti();
  const [den, setDen] = useState(hodiny.den);
  const [cas, setCas] = useState(hodiny.cas);

  return (
    <div className="frame mb-2 bg-beer/20 p-2">
      <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Polek label="Den" hodnota={den} zmena={setDen} />
        <Polek label="Hodiny" hodnota={cas} zmena={setCas} placeholder="17:00 – 22:00" />
      </div>
      <Pravida>
        <Tlacitko
          onClick={() =>
            uloz(ulozit({ data: { tabulka: "hodiny", id: hodiny.id, data: { den, cas } } }))
          }
        >
          Uložit
        </Tlacitko>
        <Tlacitko
          onClick={() => uloz(posunout({ data: { tabulka: "hodiny", id: hodiny.id, smer: -1 } }))}
        >
          ↑ Nahoru
        </Tlacitko>
        <Tlacitko
          onClick={() => uloz(posunout({ data: { tabulka: "hodiny", id: hodiny.id, smer: 1 } }))}
        >
          ↓ Dolů
        </Tlacitko>
        <Tlacitko
          varhovat={`Opravdu smazat řádek „${den}“?`}
          onClick={() => uloz(smazat({ data: { tabulka: "hodiny", id: hodiny.id } }), "Smazáno.")}
        >
          Smazat
        </Tlacitko>
      </Pravida>
    </div>
  );
}

function RadekZmeny({ zmena }: { zmena: ObsahZmena }) {
  const smazat = useServerFn(smazatRadek);
  const uloz = useUloziti();

  return (
    <div className="frame mb-2 bg-beer/20 p-2">
      <div className="text-xs font-bold">{zmena.platnost}</div>
      <div className="text-sm">{zmena.text}</div>
      <Pravida>
        <Tlacitko
          varhovat="Opravdu tu změnu vyndat z webu?"
          onClick={() => uloz(smazat({ data: { tabulka: "zmeny", id: zmena.id } }), "Vyndáno.")}
        >
          Vyndat z webu
        </Tlacitko>
      </Pravida>
    </div>
  );
}

function HodinyAdmin() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const ulozit = useServerFn(ulozitRadek);
  const uloz = useUloziti();
  const [novy, setNovy] = useState({ den: "", cas: "" });
  const [novaZmena, setNovaZmena] = useState({ text: "", platnost: "" });

  return (
    <AdminShell titulek="Otevírací doba">
      <p className="mb-3 text-xs">
        Hodiny se ukazují vlevo na každé stránce, v patičce a v informacích pro Google.
      </p>

      {obsah.hodiny.map((h) => (
        <RadekHodin key={h.id} hodiny={h} />
      ))}

      <div className="frame mb-4 bg-beer/30 p-2">
        <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Polek
            label="Nový řádek – den"
            hodnota={novy.den}
            zmena={(v) => setNovy((n) => ({ ...n, den: v }))}
            placeholder="Pondělí"
          />
          <Polek
            label="Hodiny"
            hodnota={novy.cas}
            zmena={(v) => setNovy((n) => ({ ...n, cas: v }))}
            placeholder="17:00 – 22:00"
          />
        </div>
        <Tlacitko
          onClick={() => {
            if (!novy.den.trim()) return;
            uloz(
              ulozit({
                data: { tabulka: "hodiny", data: { den: novy.den.trim(), cas: novy.cas.trim() } },
              }),
              "Přidáno.",
            ).then((v) => {
              if (v) setNovy({ den: "", cas: "" });
            });
          }}
        >
          Přidat řádek
        </Tlacitko>
      </div>

      <h3 className="text-base underline">Mimořádná změna (svátek, zavřeno, otevřeno navíc)</h3>
      <p className="mb-2 text-xs">
        Napište jednu větu – objeví se na stránce <b>Kontakt</b> a v <b>Aktuálně</b>.
      </p>
      {obsah.zmeny.map((z) => (
        <RadekZmeny key={z.id} zmena={z} />
      ))}
      {obsah.zmeny.length === 0 && (
        <p className="mb-2 text-xs italic">Zatím žádná mimořádná změna není.</p>
      )}
      <div className="frame bg-beer/30 p-2">
        <Polek
          label="Platí pro (například „pátek 31. 10.“)"
          hodnota={novaZmena.platnost}
          zmena={(v) => setNovaZmena((n) => ({ ...n, platnost: v }))}
        />
        <div className="mt-1">
          <DlouhePole
            label="Co se mění"
            hodnota={novaZmena.text}
            zmena={(v) => setNovaZmena((n) => ({ ...n, text: v }))}
            radku={1}
          />
        </div>
        <Tlacitko
          onClick={() => {
            if (!novaZmena.text.trim()) return;
            uloz(
              ulozit({
                data: {
                  tabulka: "zmeny",
                  data: { text: novaZmena.text.trim(), platnost: novaZmena.platnost.trim() },
                },
              }),
              "Změna je na webu.",
            ).then((v) => {
              if (v) setNovaZmena({ text: "", platnost: "" });
            });
          }}
        >
          Napsat mimořádnou změnu
        </Tlacitko>
      </div>
    </AdminShell>
  );
}
