import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/Layout";
import { aktuality } from "@/data/hostinec";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/aktualne")({
  head: () => seo("Aktuálně", "Víkendová nabídka, šipkové turnaje, společenské akce a oznámení Hostince U Jandů v Nadějkově."),
  component: Aktualne,
});

function Aktualne() {
  return (
    <Box title="Aktuálně – akce a oznámení">
      {aktuality.map((a) => (
        <div key={a.nadpis} className="mb-2 border-b-2 border-dotted border-border pb-2">
          <div className="text-xs text-muted-foreground">{a.datum}</div>
          <h3 className="text-lg">
            {a.nove && <span className="blink mr-1">NOVÉ!</span>}
            {a.nadpis}
          </h3>
          <p>{a.text}</p>
        </div>
      ))}
    </Box>
  );
}
