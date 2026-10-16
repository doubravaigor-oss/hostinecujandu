import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box } from "@/components/Layout";
import { Hodnoceni } from "@/components/Hodnoceni";
import { StiraciLos } from "@/components/StiraciLos";
import { Stamgast } from "@/components/Stamgast";
import { kuchyneSlib } from "@/data/hostinec";
import { seo } from "@/lib/seo";
import { aktualityObsah, obsahQuery, textyObsah } from "@/lib/obsah.functions";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Pivnice, hospodská kuchyně a oslavy",
      "Hostinec U Jandů v Nadějkově – hospodská kuchyně, čepované pivo a oslavy na míru. Otevřeno pátek až neděle 17:00–22:00. Turnaje v šipkách, srazy i konference.",
    ),
  component: Index,
});

function Index() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const aktuality = aktualityObsah(obsah);
  const texty = textyObsah(obsah);

  return (
    <>
      <Box title="Běžný provoz hostince">
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-[240px] flex-1">
            <p>Jsme tradiční venkovská pivnice s běžným hospodským jídlem.</p>
            <p className="mt-1 font-bold">{texty.kuchyne_nadpis}</p>
            <p className="text-xs">{texty.kuchyne_text}</p>
            <p className="mt-2 text-xs">{kuchyneSlib.maggi}</p>
            <ul className="mt-2 list-disc pl-5">
              <li>čepované pivo</li>
              <li>klasická hospodská kuchyně</li>
              <li>společenské posezení</li>
              <li>turnaj v šipkách 301 single out – zhruba jednou za měsíc</li>
            </ul>
            <p className="mt-2">
              Pravidelně máme otevřeno v <b>pátek, sobotu a neděli</b> vždy od <b>17:00 do 22:00</b>.
            </p>
          </div>
          <StiraciLos />
        </div>
      </Box>
      <Stamgast />
      <Hodnoceni />
      <section className="frame mb-3 bg-wood p-3 text-beer">
        <h2 className="text-2xl" style={{ color: "var(--beer)" }}>
          ★ Oslavy, rauty a hostiny ★
        </h2>
        <p className="my-2 text-primary-foreground">
          Nejsme pouze pivnice – zajistíme třídní srazy, narozeninové oslavy, pohřební hostiny,
          rauty i firemní konference. Vše na přání zákazníka.
        </p>
        <Link to="/oslavy" className="retro-btn">
          Více o oslavách »
        </Link>
      </section>
      <Box title="Aktuálně z hospody">
        {aktuality.slice(0, 3).map((a) => (
          <p key={a.id} className="mb-1">
            {a.nove && <span className="blink mr-1 font-bold text-title">NOVÉ!</span>}
            <b>{a.nadpis}</b> {a.text}
          </p>
        ))}
        <Link to="/aktualne">Všechny aktuality »</Link>
      </Box>
    </>
  );
}
