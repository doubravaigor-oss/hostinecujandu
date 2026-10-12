import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@/components/Layout";
import { kontakt } from "@/data/hostinec";
import { seo } from "@/lib/seo";
import { obsahQuery } from "@/lib/obsah.functions";
import qrHodnoceni from "@/assets/qr-hodnoceni.png";

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

      <div className="frame paper mb-3 p-3">
        <div className="retro-heading -mx-3 -mt-3 mb-3 text-sm">★ Napište nám hodnocení ★</div>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-[130px] pr-3 align-top">
                <img
                  src={qrHodnoceni}
                  alt="QR kód pro napsání hodnocení na Mapách Google"
                  className="frame w-full bg-white p-1"
                />
              </td>
              <td className="align-top text-sm">
                <p className="font-bold">Byli jste u nás? Dejte o nás vědět.</p>
                <p className="mt-1">
                  Namiřte foťák telefonu na tento QR kód – otevře se okno pro hodnocení na Mapách
                  Google. Zabere to půl minuty a nám to pomůže víc než sebelepší reklama.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href={kontakt.hodnoceni}
                    target="_blank"
                    rel="noreferrer"
                    className="retro-btn-big"
                  >
                    ★ Napsat hodnocení
                  </a>
                  <a
                    href={kontakt.hodnoceniMisto}
                    target="_blank"
                    rel="noreferrer"
                    className="retro-btn-big"
                  >
                    ➜ Ukázat na mapě
                  </a>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Hodnocení se odesílá z vašeho účtu Google. Děkujeme a těšíme se na viděnou!
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <iframe
        title="Mapa Nadějkova"
        src={kontakt.mapaVlozena}
        className="frame h-72 w-full"
        loading="lazy"
      />
    </Box>
  );
}
