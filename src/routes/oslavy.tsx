import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/Layout";
import { kontakt, nabidkaOslav } from "@/data/hostinec";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/oslavy")({
  head: () => seo("Oslavy, rauty, srazy a konference", "Pořádáme třídní srazy, narozeninové oslavy, pohřební hostiny, rauty i firemní konference v Nadějkově. Pohoštění na míru – vše na přání zákazníka."),
  component: Oslavy,
});

function Oslavy() {
  return (
    <>
      <Box title="★ Oslavy, rauty a hostiny ★">
        <p className="font-bold">Nejsme pouze pivnice – umíme profesionálně zajistit i větší společenské akce.</p>
        <table className="frame my-3 w-full text-left">
          <tbody>
            {nabidkaOslav.map((t, i) => (
              <tr key={t} className={i % 2 ? "bg-beer/30" : ""}>
                <td className="w-8 border border-border text-center">✔</td>
                <td className="border border-border p-1 font-bold">{t}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Nabídka občerstvení je široká. Zvládneme jednoduché pohoštění, například řízky s bramborovým salátem,
          ale také bohaté rauty, slavnostní tabule a honosnější hostiny.
        </p>
        <p className="mt-2 border-2 border-dashed border-title p-2">
          <b>Vše děláme na přání zákazníka</b> – rozsah, skladbu i cenu pohoštění řešíme individuálně.
        </p>
        <div className="mt-3 text-center">
          <a href={kontakt.telefonOdkaz} className="retro-btn-big">☎ Poptat oslavu nebo hostinu – {kontakt.telefon}</a>
        </div>
      </Box>
    </>
  );
}
