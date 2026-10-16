import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@/components/Layout";
import { seo } from "@/lib/seo";
import { kuchyneSlib } from "@/data/hostinec";
import { obsahQuery, kategorieObsah, textyObsah } from "@/lib/obsah.functions";

export const Route = createFileRoute("/jidlo")({
  head: () =>
    seo(
      "Jídlo a pití",
      "Jídelní a nápojový lístek Hostince U Jandů v Nadějkově – utopenec, nakládaný hermelín, tousty, pizza i točené pivo.",
    ),
  component: Jidlo,
});

function Jidlo() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const kategorie = kategorieObsah(obsah);
  const texty = textyObsah(obsah);

  return (
    <Box title="Jídlo a pití">
      <div className="frame bg-beer p-2 mb-3 text-center">
        <div className="font-bold text-base underline">{texty.kuchyne_nadpis}</div>
        <div className="text-xs mt-1">{texty.kuchyne_text}</div>
      </div>
      {kategorie.filter((k) => k.polozky.length > 0).map((k) => (
        <div key={k.id} className="mb-3">
          <h3 className="text-lg underline">{k.nazev}</h3>
          <table className="w-full">
              <tbody>
                {k.polozky.map((p) => (
                  <tr key={p.id} className="border-b border-dotted border-border">
                    <td className="py-0.5">
                      {p.nazev}
                      {p.popis && <div className="text-xs italic opacity-80">{p.popis}</div>}
                    </td>
                    <td className="text-right font-bold whitespace-nowrap">{p.cena}</td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      ))}
    </Box>
  );
}
