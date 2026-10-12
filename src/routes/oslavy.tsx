import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@/components/Layout";
import { kontakt, nabidkaOslav, proFirmy, usporadaneAkce } from "@/data/hostinec";
import { seo } from "@/lib/seo";
import { obsahQuery, fotkyObsah } from "@/lib/obsah.functions";

export const Route = createFileRoute("/oslavy")({
  head: () =>
    seo(
      "Oslavy, rauty, srazy a konference",
      "Pořádáme třídní srazy, narozeninové oslavy, pohřební hostiny, rauty i firemní konference v Nadějkově. Pohoštění na míru – vše na přání zákazníka.",
    ),
  component: Oslavy,
});

function Oslavy() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const fotky = fotkyObsah(obsah);
  const fotkaSalu = fotky[1] ?? fotky[0];

  return (
    <>
      <Box title="★ Oslavy, rauty a hostiny ★">
        <p className="font-bold">
          Nejsme pouze pivnice – umíme profesionálně zajistit i větší společenské akce.
        </p>
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
          Nabídka občerstvení je široká. Zvládneme jednoduché pohoštění, například řízky s
          bramborovým salátem, ale také bohaté rauty, slavnostní tabule a honosnější hostiny.
        </p>
        <p className="mt-2 border-2 border-dashed border-title p-2">
          <b>Vše děláme na přání zákazníka</b> – rozsah, skladbu i cenu pohoštění řešíme
          individuálně.
        </p>
        <p className="mt-4 font-bold">★ Co už jsme u nás uspořádali (za rok a půl):</p>
        <ul className="mt-2 border-2 border-border bg-beer/20 p-2 pl-6 list-disc">
          {usporadaneAkce.map((t) => (
            <li key={t} className="py-0.5">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-2">A až něco nového vymyslíte, zorganizujeme to taky. :-)</p>
        <div className="mt-3 text-center">
          <a href={kontakt.telefonOdkaz} className="retro-btn-big">
            ☎ Poptat oslavu nebo hostinu – {kontakt.telefon}
          </a>
        </div>
      </Box>
      <Box title="★ Pro firmy a konference ★">
        {fotkaSalu && (
          <img
            src={fotkaSalu.src}
            alt={fotkaSalu.popis}
            className="frame mb-2 w-full max-w-md mx-auto block"
            loading="lazy"
          />
        )}
        <ul className="border-2 border-border bg-beer/20 p-2 pl-6 list-disc">
          {proFirmy.map((t) => (
            <li key={t} className="py-0.5 font-bold">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-3 text-center">
          <a href={kontakt.telefonOdkaz} className="retro-btn-big">
            ☎ Poptat firemní akci – {kontakt.telefon}
          </a>
        </div>
      </Box>
    </>
  );
}
