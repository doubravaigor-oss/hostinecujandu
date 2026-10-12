import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@/components/Layout";
import { seo } from "@/lib/seo";
import { obsahQuery, fotkyObsah } from "@/lib/obsah.functions";

export const Route = createFileRoute("/galerie")({
  head: () =>
    seo(
      "Fotogalerie",
      "Fotografie Hostince U Jandů v Nadějkově – hostinec, jídla, rauty a akce.",
    ),
  component: Galerie,
});

function Galerie() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const fotky = fotkyObsah(obsah);

  return (
    <Box title="Fotogalerie">
      {fotky.length === 0 ? (
        <p className="italic text-muted-foreground">
          Fotografie hostince, jídel, rautů a akcí brzy přidáme.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {fotky.map((f) => (
            <figure key={f.id} className="frame bg-paper p-1 text-center text-xs">
              <img
                src={f.src}
                alt={f.popis}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
              <figcaption>{f.popis}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </Box>
  );
}
