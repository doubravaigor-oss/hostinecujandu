import { hodnoceniText, kontakt } from "@/data/hostinec";
import qrHodnoceni from "@/assets/qr-hodnoceni.png";

// Rámeček s QR kódem na hodnocení na Googlu – používá se na Úvodu i v Kontaktu.
export function Hodnoceni({ sirkaQR = 130 }: { sirkaQR?: number }) {
  return (
    <section className="frame paper mb-3 p-3">
      <div className="retro-heading -mx-3 -mt-3 mb-3 text-sm">{hodnoceniText.nadpis}</div>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="pr-3 align-top" style={{ width: sirkaQR }}>
              <img
                src={qrHodnoceni}
                alt="QR kód pro napsání hodnocení na Mapách Google"
                className="frame w-full bg-white p-1"
              />
            </td>
            <td className="align-top text-sm">
              <p className="font-bold">{hodnoceniText.hlavni}</p>
              <p className="mt-1">{hodnoceniText.napoveda}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={kontakt.hodnoceni}
                  target="_blank"
                  rel="noreferrer"
                  className="retro-btn-big"
                >
                  {hodnoceniText.tlacitko}
                </a>
                <a
                  href={kontakt.hodnoceniMisto}
                  target="_blank"
                  rel="noreferrer"
                  className="retro-btn-big"
                >
                  {hodnoceniText.mapa}
                </a>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{hodnoceniText.poznamka}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
