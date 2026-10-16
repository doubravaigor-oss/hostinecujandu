// Administrace: texty, které se nehodí do jídelního lístku ani do akcí.
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell, DlouhePole, Polek, Tlacitko, useUloziti } from "@/components/Admin";
import { obsahQuery, textyObsah } from "@/lib/obsah.functions";
import { ulozitText } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/texty")({
  head: () => ({
    meta: [
      { title: "Texty – administrace – Hostinec U Jandů" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TextyAdmin,
});

function RadekTextu({
  klic,
  label,
  hodnota,
  napoveda,
  radku,
}: {
  klic: "banner" | "kuchyne_nadpis" | "kuchyne_text";
  label: string;
  hodnota: string;
  napoveda: string;
  radku?: number;
}) {
  const ulozit = useServerFn(ulozitText);
  const uloz = useUloziti();
  const [text, setText] = useState(hodnota);

  return (
    <div className="frame mb-2 bg-beer/20 p-2">
      {radku ? (
        <DlouhePole label={label} hodnota={text} zmena={setText} radku={radku} />
      ) : (
        <Polek label={label} hodnota={text} zmena={setText} />
      )}
      <p className="mt-1 text-xs text-muted-foreground">{napoveda}</p>
      <Tlacitko onClick={() => uloz(ulozit({ data: { klic, hodnota: text } }))}>Uložit</Tlacitko>
    </div>
  );
}

function TextyAdmin() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const texty = textyObsah(obsah);

  return (
    <AdminShell titulek="Texty">
      <RadekTextu
        klic="banner"
        label="Žlutý pásek nahoře"
        hodnota={obsah.texty.banner}
        napoveda="Ten pruh se šikmými pruhy pod hlavním nápisem. Když už není co doplňovat, napište sem třeba „Tento web je hotový. Na zdraví!“"
      />
      <RadekTextu
        klic="kuchyne_nadpis"
        label="Nadpis o vaření (žlutý rámeček na stránce Jídlo a pití)"
        hodnota={obsah.texty.kuchyne_nadpis}
        napoveda="Například „Hospodská kuchyně, bez velkých řečí“"
      />
      <RadekTextu
        klic="kuchyne_text"
        label="Text o vaření"
        hodnota={obsah.texty.kuchyne_text}
        napoveda="Krátká věta, co je pro nás důležité. Ukazuje se i na Úvodu."
        radku={3}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Datum „Web naposledy doplněn“ se přepíše samo, kdykoli něco uložíte.
      </p>
    </AdminShell>
  );
}
