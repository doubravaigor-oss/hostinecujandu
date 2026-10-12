// Administrace: fotogalerie – nahrání z telefonu, popisky, pořadí, mazání.
import { createFileRoute, useServerFn } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  AdminShell,
  Polek,
  Pravida,
  Tlacitko,
  useUloziti,
} from "@/components/Admin";
import { obsahQuery, type ObsahFotka } from "@/lib/obsah.functions";
import { posunoutRadek, smazatRadek, ulozitRadek } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/fotky")({
  head: () => ({
    meta: [
      { title: "Fotogalerie – administrace – Hostinec U Jandů" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FotkyAdmin,
});

function prilona(typ: string): string {
  if (typ.includes("png")) return "png";
  if (typ.includes("webp")) return "webp";
  if (typ.includes("gif")) return "gif";
  return "jpg";
}

function NahratFotku() {
  const ulozit = useServerFn(ulozitRadek);
  const uloz = useUloziti();
  const [popis, setPopis] = useState("");
  const [pracuje, setPracuje] = useState(false);
  const vstupu = useRef<HTMLInputElement>(null);

  async function nahrat(soubor: File) {
    setPracuje(true);
    const cesta = `${crypto.randomUUID()}.${prilona(soubor.type)}`;
    const { error } = await supabase.storage
      .from("fotky")
      .upload(cesta, soubor, { contentType: soubor.type });
    if (error) {
      setPracuje(false);
      toast.error("Nahrání se nezdařilo: " + error.message);
      return;
    }
    const uspesne = await uloz(
      ulozit({ data: { tabulka: "fotky", data: { storage_path: cesta, popis: popis.trim() } } }),
      "Fotka je přidaná do galerie.",
    );
    if (uspesne) setPopis("");
    setPracuje(false);
    if (vstupu.current) vstupu.current.value = "";
  }

  return (
    <div className="frame mb-3 bg-beer/30 p-2">
      <Polek label="Popisek fotky" hodnota={popis} zmena={setPopis} placeholder="co na fotce je" />
      <label className="mt-2 block text-xs font-bold">
        Vyberte fotku z telefonu (nebo z počítače)
        <input
          ref={vstupu}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const soubor = e.target.files?.[0];
            if (soubor) nahrat(soubor);
          }}
          className="retro-input mt-0.5 block w-full"
        />
      </label>
      {pracuje && <p className="mt-1 text-xs italic">Nahrávám fotku…</p>}
      <p className="mt-1 text-xs text-muted-foreground">
        Nejvýš 10 MB na fotku. Fotka se uloží do úložiště webu a hned se ukáže v galerii.
      </p>
    </div>
  );
}

function RadekFotky({ fotka }: { fotka: ObsahFotka }) {
  const ulozit = useServerFn(ulozitRadek);
  const smazat = useServerFn(smazatRadek);
  const posunout = useServerFn(posunoutRadek);
  const uloz = useUloziti();
  const [popis, setPopis] = useState(fotka.popis);

  return (
    <div className="frame mb-2 bg-beer/20 p-2">
      <div className="flex flex-wrap items-start gap-2">
        <img
          src={fotka.src}
          alt={fotka.popis}
          loading="lazy"
          className="frame h-28 w-28 shrink-0 object-cover"
        />
        <div className="min-w-[180px] flex-1">
          <Polek label="Popisek" hodnota={popis} zmena={setPopis} />
          <Pravida>
            <Tlacitko
              onClick={() =>
                uloz(ulozit({ data: { tabulka: "fotky", id: fotka.id, data: { popis } } }))
              }
            >
              Uložit
            </Tlacitko>
            <Tlacitko
              onClick={() => uloz(posunout({ data: { tabulka: "fotky", id: fotka.id, smer: -1 } }))}
            >
              ↑ Nahoru
            </Tlacitko>
            <Tlacitko
              onClick={() => uloz(posunout({ data: { tabulka: "fotky", id: fotka.id, smer: 1 } }))}
            >
              ↓ Dolů
            </Tlacitko>
            <Tlacitko
              varhovat="Opravdu tu fotku vyndat z galerie?"
              onClick={() => uloz(smazat({ data: { tabulka: "fotky", id: fotka.id } }), "Fotka pryč.")}
            >
              Smazat
            </Tlacitko>
          </Pravida>
        </div>
      </div>
    </div>
  );
}

function FotkyAdmin() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);

  return (
    <AdminShell titulek="Fotogalerie">
      <p className="mb-3 text-xs">
        Fotky se řadí podle toho, jak je tu přeskládáte. První tři vidíte i na stránce
        <b> Oslavy a rauty</b>.
      </p>
      <NahratFotku />
      {obsah.fotky.map((f) => (
        <RadekFotky key={f.id} fotka={f} />
      ))}
      <p className="mt-2 text-xs text-muted-foreground">
        Poznámka: fotografie, které jste poslal do chatu, zůstávají uložené v projektu – tady je
        vyndáte jen z galerie.
      </p>
    </AdminShell>
  );
}
