import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/Layout";
import { Cihlicky } from "@/components/Cihlicky";
import { hraText } from "@/data/hostinec";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/hra")({
  head: () => seo("Cihličky – herna", "Retro hra s míčkem, plošinkou a cihličkami v hostinecké herně Hostince U Jandů v Nadějkově."),
  component: () => <Box title={hraText.nadpis}><Cihlicky /></Box>,
});