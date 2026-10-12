import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/Layout";
import { kontakt, oteviraciDoba } from "@/data/hostinec";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/kontakt")({
  head: () => seo("Kontakt a mapa", "Kontakt na Hostinec U Jandů v Nadějkově, okres Tábor. Telefon 732 350 877, mapa a navigace."),
  component: Kontakt,
});

function Kontakt() {
  return (
    <Box title="Kontakt">
      <table className="mb-3">
        <tbody>
          <tr><td className="pr-3 font-bold">Název:</td><td>{kontakt.nazev}</td></tr>
          <tr><td className="pr-3 font-bold">Adresa:</td><td>{kontakt.adresa}, {kontakt.obec} ({kontakt.okres})</td></tr>
          <tr><td className="pr-3 font-bold">Telefon:</td><td><a href={kontakt.telefonOdkaz}>{kontakt.telefon}</a></td></tr>
          <tr><td className="pr-3 font-bold">Facebook:</td><td>{kontakt.facebook ? <a href={kontakt.facebook} target="_blank" rel="noreferrer">Hostinec U Jandů na Facebooku</a> : "odkaz brzy doplníme"}</td></tr>
        </tbody>
      </table>
      <div className="frame mb-3 p-2">
        <div className="retro-heading mb-2 text-sm">Otevírací doba</div>
        <table className="w-full">
          <tbody>
            {oteviraciDoba.map((o) => (
              <tr key={o.den} className="border-b border-dotted border-border align-top">
                <td className="pr-2 font-bold">{o.den}</td>
                <td>{o.cas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <a href={kontakt.telefonOdkaz} className="retro-btn-big">☎ Zavolat</a>
        <a href={kontakt.mapaOdkaz} target="_blank" rel="noreferrer" className="retro-btn-big">➜ Navigovat</a>
      </div>
      <iframe title="Mapa Nadějkova" src={kontakt.mapaVlozena} className="frame h-72 w-full" loading="lazy" />
    </Box>
  );
}
