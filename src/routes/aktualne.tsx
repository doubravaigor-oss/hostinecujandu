import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@/components/Layout";
import { seo } from "@/lib/seo";
import {
  aktualityObsah,
  obsahQuery,
  pravidelneObsah,
} from "@/lib/obsah.functions";

export const Route = createFileRoute("/aktualne")({
  head: () =>
    seo(
      "Aktuálně",
      "Šipkové turnaje 301 single out, třídní srazy, společenské akce a oznámení Hostince U Jandů v Nadějkově.",
    ),
  component: Aktualne,
});

function Aktualne() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const pravidelne = pravidelneObsah(obsah);
  const aktuality = aktualityObsah(obsah);

  return (
    <>
      <Box title="Pravidelné akce">
        {pravidelne.map((a) => (
          <div key={a.id} className="mb-2 border-b-2 border-dotted border-border pb-2">
            <h3 className="text-lg font-bold">{a.nazev}</h3>
            <p>{a.text}</p>
          </div>
        ))}
      </Box>
      <Box title="Aktuálně – akce a oznámení">
        {aktuality.map((a) => (
          <div key={a.id} className="mb-2 border-b-2 border-dotted border-border pb-2">
            <div className="text-xs text-muted-foreground">{a.datum}</div>
            <h3 className="text-lg">
              {a.nove && <span className="blink mr-1">NOVÉ!</span>}
              {a.nadpis}
            </h3>
            <p>{a.text}</p>
            {a.foto && (
              <img
                src={a.foto}
                alt={a.nadpis}
                loading="lazy"
                className="frame mt-1 max-h-56 object-contain"
              />
            )}
          </div>
        ))}
        {obsah.zmeny.map((z) => (
          <div key={z.id} className="mb-2 border-2 border-dashed border-title bg-beer/40 p-2">
            <b>{z.platnost}</b>
            <div>{z.text}</div>
          </div>
        ))}
      </Box>
    </>
  );
}
