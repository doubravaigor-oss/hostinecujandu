import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/Layout";
import { Cihlicky } from "@/components/Cihlicky";
import { Sipky } from "@/components/Sipky";
import { hraText, sipkyText } from "@/data/hostinec";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/hra")({
  head: () => seo("Šipky a Cihličky – herna", "Zahrajte si šipky a retro Cihličky v hostinecké herně Hostince U Jandů v Nadějkově."),
  component: () => <><Box title={sipkyText.nadpis}><Sipky /></Box><Box title={hraText.nadpis}><Cihlicky /></Box></>,
});