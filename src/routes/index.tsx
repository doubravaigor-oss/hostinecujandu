import { createFileRoute, Link } from "@tanstack/react-router";
import { Box } from "@/components/Layout";
import { aktuality } from "@/data/hostinec";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Pivnice, hospodská kuchyně a oslavy", "Hostinec U Jandů v Nadějkově – pivnice a tradiční hospodská kuchyně, otevřeno pátek až neděle. Pořádáme oslavy, svatby, rauty a konference."),
  component: Index,
});

function Index() {
  return (
    <>
      <Box title="Běžný provoz hostince">
        <p>Jsme tradiční venkovská pivnice s běžným hospodským jídlem.</p>
        <ul className="mt-2 list-disc pl-5">
          <li>čepované pivo</li>
          <li>klasická hospodská kuchyně</li>
          <li>víkendové speciality</li>
          <li>společenské posezení</li>
        </ul>
        <p className="mt-2">Pravidelně máme otevřeno v <b>pátek, sobotu a neděli</b>.</p>
      </Box>
      <section className="frame mb-3 bg-wood p-3 text-beer">
        <h2 className="text-2xl" style={{ color: "var(--beer)" }}>★ Oslavy, rauty a hostiny ★</h2>
        <p className="my-2 text-primary-foreground">
          Nejsme pouze pivnice – zajistíme rodinné oslavy, svatební hostiny, rauty i firemní konference.
        </p>
        <Link to="/oslavy" className="retro-btn">Více o oslavách »</Link>
      </section>
      <Box title="Aktuálně z hospody">
        {aktuality.slice(0, 3).map((a) => (
          <p key={a.nadpis} className="mb-1">
            {a.nove && <span className="blink mr-1 font-bold text-title">NOVÉ!</span>}
            <b>{a.nadpis}</b> {a.text}
          </p>
        ))}
        <Link to="/aktualne">Všechny aktuality »</Link>
      </Box>
    </>
  );
}
