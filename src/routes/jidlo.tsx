import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/Layout";
import { jidelniListek, kuchyneSlib } from "@/data/hostinec";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/jidlo")({
  head: () => seo("Jídlo a pití", "Vaříme pouze z čerstvých surovin, bez umělých dochucovadel. Jídelní a nápojový lístek Hostince U Jandů v Nadějkově."),
  component: Jidlo,
});

function Jidlo() {
  return (
    <Box title="Jídlo a pití">
      <div className="frame bg-beer p-2 mb-3 text-center">
        <div className="font-bold text-base underline">{kuchyneSlib.nadpis}</div>
        <div className="text-xs mt-1">{kuchyneSlib.text}</div>
      </div>
      {jidelniListek.map((k) => (
        <div key={k.kategorie} className="mb-3">
          <h3 className="text-lg underline">{k.kategorie}</h3>
          {k.polozky.length === 0 ? (
            <p className="text-muted-foreground italic">Nabídku brzy doplníme.</p>
          ) : (
            <table className="w-full">
              <tbody>
                {k.polozky.map((p) => (
                  <tr key={p.nazev} className="border-b border-dotted border-border">
                    <td className="py-0.5">{p.nazev}{p.popis && <div className="text-xs italic opacity-80">{p.popis}</div>}</td>
                    <td className="text-right font-bold whitespace-nowrap">{p.cena}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </Box>
  );
}
