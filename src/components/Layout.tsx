import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { kontakt, oteviraciDoba } from "@/data/hostinec";

const menu = [
  { to: "/", label: "Úvod" },
  { to: "/oslavy", label: "Oslavy a rauty" },
  { to: "/jidlo", label: "Jídlo a pití" },
  { to: "/aktualne", label: "Aktuálně" },
  { to: "/galerie", label: "Fotogalerie" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

export function Box({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="frame paper mb-3">
      <h2 className="retro-heading text-base">{title}</h2>
      <div className="p-3">{children}</div>
    </section>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[900px] p-1 sm:p-3">
      <header className="frame paper p-2 text-center">
        <div className="text-xs text-muted-foreground">★ vítejte na oficiálních stránkách ★</div>
        <h1 className="text-2xl sm:text-4xl" style={{ textShadow: "2px 2px 0 var(--beer)" }}>
          HOSTINEC U JANDŮ – NADĚJKOV
        </h1>
        <p className="font-bold">Pivnice a tradiční hospodská kuchyně. Otevřeno tři dny v týdnu.</p>
        <p className="text-accent font-bold">
          Pořádáme oslavy, hostiny, rauty a konference. Od řízku s bramborovým salátem až po bohaté slavnostní tabule.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <a href={kontakt.telefonOdkaz} className="retro-btn-big">☎ {kontakt.telefon}</a>
          <Link to="/oslavy" className="retro-btn-big">Poptat oslavu nebo hostinu</Link>
        </div>
      </header>

      <div className="frame mt-1 overflow-hidden bg-wood py-0.5 text-sm font-bold text-beer">
        <span className="marquee-text">*** Otevřeno pátek – sobota – neděle 17:00–22:00 *** Šipky 301 single out – turnaj zhruba jednou za měsíc *** Oslavy, srazy, hostiny, konference *** Volejte {kontakt.telefon} ***</span>
      </div>

      <div className="mt-2 grid gap-2 md:grid-cols-[180px_minmax(0,1fr)]">
        <aside className="space-y-2">
          <nav className="frame paper p-2">
            <div className="retro-heading -mx-2 -mt-2 mb-2 text-sm">» MENU «</div>
            <ul className="grid grid-cols-2 gap-1 md:grid-cols-1">
              {menu.map((m) => (
                <li key={m.to}>
                  <Link to={m.to} className="retro-btn w-full text-center text-xs" activeProps={{ style: { background: "var(--beer)" } }}>
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="frame paper p-2 text-xs">
            <div className="retro-heading -mx-2 -mt-2 mb-2 text-sm">Otevírací doba</div>
            <table className="w-full">
              <tbody>
                {oteviraciDoba.map((o) => (
                  <tr key={o.den} className="border-b border-dotted border-border align-top">
                    <td className="pr-1 font-bold">{o.den}</td>
                    <td>{o.cas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>

      <hr className="hr-retro my-2" />
      <footer className="frame paper p-2 text-center text-xs">
        <b>{kontakt.nazev}</b> · {kontakt.adresa}, {kontakt.obec}, {kontakt.okres} · tel.{" "}
        <a href={kontakt.telefonOdkaz}>{kontakt.telefon}</a>
        {kontakt.facebook && (
          <div className="mt-1">
            <a href={kontakt.facebook} target="_blank" rel="noreferrer">Na Facebooku »</a>
          </div>
        )}
        <div className="mt-1 text-muted-foreground">Stránky nejlépe zobrazíte v jakémkoliv prohlížeči :-) · Na zdraví!</div>
      </footer>
    </div>
  );
}
