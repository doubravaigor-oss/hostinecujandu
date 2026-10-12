import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/Layout";
import { kontakt } from "@/data/hostinec";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/oslavy")({
  head: () => seo("Oslavy, rauty, svatby a konference", "Pořádáme rodinné oslavy, svatební hostiny, rauty a firemní akce v Nadějkově. Pohoštění na míru – od řízků po slavnostní tabule."),
  component: Oslavy,
});

function Oslavy() {
  return (
    <>
      <Box title="★ Oslavy, rauty a hostiny ★">
        <p className="font-bold">Nejsme pouze pivnice – umíme profesionálně zajistit i větší společenské akce.</p>
        <table className="frame my-3 w-full text-left">
          <tbody>
            {[
              "Rodinné oslavy, narozeniny a výročí",
              "Svatební a jiné slavnostní hostiny",
              "Rauty a společenská setkání",
              "Firemní akce, konference a pracovní setkání",
              "Další soukromé akce podle dohody",
            ].map((t, i) => (
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
          <b>Rozsah, skladbu i cenu pohoštění řešíme individuálně</b> podle vašich požadavků.
        </p>
        <div className="mt-3 text-center">
          <a href={kontakt.telefonOdkaz} className="retro-btn-big">☎ Poptat oslavu nebo hostinu – {kontakt.telefon}</a>
        </div>
      </Box>
    </>
  );
}
