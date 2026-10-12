import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/Layout";
import { fotky } from "@/data/hostinec";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/galerie")({
  head: () => seo("Fotogalerie", "Fotografie Hostince U Jandů v Nadějkově – hostinec, jídla, rauty a akce."),
  component: Galerie,
});

function Galerie() {
  return (
    <Box title="Fotogalerie">
      {fotky.length === 0 ? (
        <p className="italic text-muted-foreground">Fotografie hostince, jídel, rautů a akcí brzy přidáme.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {fotky.map((f) => (
            <figure key={f.src} className="frame bg-paper p-1 text-center text-xs">
              <img src={f.src} alt={f.popis} loading="lazy" className="aspect-[3/4] w-full object-cover" />
              <figcaption>{f.popis}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </Box>
  );
}
