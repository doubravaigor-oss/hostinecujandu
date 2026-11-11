import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { stamgastText as text } from "@/data/hostinec";
import { zvukPanak, zvukPivo, zvukPlac } from "@/lib/zvuky";
import obrazek from "@/assets/stamgast-neutralni.jpg";

type Reakce = "ceka" | "pivo" | "zelena" | "sucho";

const popisy: Record<Reakce, string> = {
  ceka: "Kreslený štamgast se usmívá na židli u stolu",
  pivo: "Kreslený štamgast si blaženě vychutnává pivo",
  zelena: "Kreslený štamgast exuje panáka zelené",
  sucho: "Kreslený štamgast u prázdného stolu pláče",
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
    if (pije) return;
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
          <div key={reakce} className="stamgast-obrazek">
            <img src={obrazek} width={1024} height={1024} loading="lazy"
              alt={popisy[reakce]} className="stamgast-sprite" />
          </div>
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
