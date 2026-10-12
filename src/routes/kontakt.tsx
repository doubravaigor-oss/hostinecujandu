import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@/components/Layout";
import { Hodnoceni } from "@/components/Hodnoceni";
import { kontakt } from "@/data/hostinec";
import { seo } from "@/lib/seo";
import { obsahQuery } from "@/lib/obsah.functions";

export const Route = createFileRoute("/kontakt")({
  head: () =>
    seo(
      "Kontakt a mapa",
      "Kontakt na Hostinec U Jandů v Nadějkově, okres Tábor. Telefon 732 350 877, mapa a navigace.",
    ),
  component: Kontakt,
});

function Kontakt() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);

  return (
    <Box title="Kontakt">
      <table className="mb-3">
        <tbody>
          <tr>
            <td className="pr-3 font-bold">Název:</td>
            <td>{kontakt.nazev}</td>
          </tr>
          <tr>
            <td className="pr-3 font-bold">Adresa:</td>
            <td>
              {kontakt.adresa}, {kontakt.obec} ({kontakt.okres})
            </td>
          </tr>
          <tr>
            <td className="pr-3 font-bold">Telefon:</td>
            <td>
              <a href={kontakt.telefonOdkaz}>{kontakt.telefon}</a>
            </td>
          </tr>
          <tr>
            <td className="pr-3 font-bold">E-mail:</td>
            <td>
              <a href={`mailto:${kontakt.email}`}>{kontakt.email}</a>
            </td>
          </tr>
          <tr>
            <td className="pr-3 font-bold">Facebook:</td>
            <td>
              {kontakt.facebook ? (
                <a href={kontakt.facebook} target="_blank" rel="noreferrer">
                  Hostinec U Jandů na Facebooku
                </a>
              ) : (
                "odkaz brzy doplníme"
              )}
            </td>
          </tr>
        </tbody>
      </table>
      {obsah.zmeny.length > 0 && (
        <div className="mb-3 border-2 border-dashed border-title bg-beer/40 p-2 text-sm">
          <b>Mimořádná změna otevírací doby:</b>
          {obsah.zmeny.map((z) => (
            <div key={z.id}>
              <b>{z.platnost}</b> {z.text}
            </div>
          ))}
        </div>
      )}
      <div className="mb-3 flex flex-wrap gap-2">
        <a href={kontakt.telefonOdkaz} className="retro-btn-big">
          ☎ Zavolat
        </a>
        <a href={kontakt.mapaOdkaz} target="_blank" rel="noreferrer" className="retro-btn-big">
          ➜ Navigovat
        </a>
      </div>

      <Hodnoceni />

      <iframe
        title="Mapa Nadějkova"
        src={kontakt.mapaVlozena}
        className="frame h-72 w-full"
        loading="lazy"
      />
    </Box>
  );
}
