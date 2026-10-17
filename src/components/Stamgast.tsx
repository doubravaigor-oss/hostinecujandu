// ============= Full file contents =============

1: import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { stamgastText as text } from "@/data/hostinec";
import { zvukPanak, zvukPivo, zvukPlac } from "@/lib/zvuky";
import obrazekCeka from "@/assets/stamgast-igor-foto.jpg";
import obrazekPivo from "@/assets/stamgast-pivo.jpg";
import obrazekZelena from "@/assets/stamgast-zelena.jpg";
import obrazekSucho from "@/assets/stamgast-sucho.jpg";

type Reakce = "ceka" | "pivo" | "zelena" | "sucho";

const obrazky: Record<Reakce, { src: string; alt: string }> = {
  ceka: { src: obrazekCeka, alt: "Usměvavý štamgast na židli u stolu" },
  pivo: { src: obrazekPivo, alt: "Štamgast si blaženě vychutnává pivo" },
  zelena: { src: obrazekZelena, alt: "Štamgast exuje panáka zelené" },
  sucho: { src: obrazekSucho, alt: "Štamgast u prázdného stolu pláče" },
};

export function Stamgast() {
  const [reakce, setReakce] = useState<Reakce>("ceka");
  const [zprava, setZprava] = useState(text.ceka);
  const casovac = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pije = reakce === "pivo" || reakce === "zelena";

  useEffect(() => () => {
    if (casovac.current) clearTimeout(casovac.current);
  }, []);

  function pohostit(volba: Exclude<Reakce, "ceka">) {
    if (casovac.current) clearTimeout(casovac.current);
    setReakce(volba);
    setZprava(volba === "pivo" ? text.pijePivo : volba === "zelena" ? text.pijeZelenou : text.place);
    if (volba === "pivo") zvukPivo();
    else if (volba === "zelena") zvukPanak();
    else zvukPlac();
    if (volba === "sucho") return;
    casovac.current = setTimeout(() => {
      setReakce("ceka");
      setZprava(volba === "pivo" ? text.poPivu : text.poZelene);
    }, volba === "pivo" ? 4200 : 1800);
  }

  return (
    <section className="frame paper mb-3" aria-labelledby="stamgast-nadpis">
      <h2 id="stamgast-nadpis" className="retro-heading">{text.nadpis}</h2>
      <div className="stamgast-layout">
        <div className={`stamgast-scena stamgast-${reakce}`} data-reakce={reakce}>
          <img key={reakce} src={obrazky[reakce].src} width={600} height={600} loading="lazy"
            alt={obrazky[reakce].alt}
            className="stamgast-obrazek" />
        </div>
        <div className="stamgast-volby">
          <p className="stamgast-hlaska font-bold text-title" role="status" aria-live="polite">{zprava}</p>
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="retro-btn h-auto whitespace-normal rounded-none text-xs" disabled={pije} onClick={() => pohostit("pivo")}>{text.pivo}</Button>
            <Button variant="ghost" className="retro-btn h-auto whitespace-normal rounded-none text-xs" disabled={pije} onClick={() => pohostit("zelena")}>{text.zelena}</Button>
            <Button variant="ghost" className="retro-btn h-auto whitespace-normal rounded-none text-xs" disabled={pije} onClick={() => pohostit("sucho")}>{text.sucho}</Button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">{text.poznamka}</p>
        </div>
      </div>
    </section>
  );
}
