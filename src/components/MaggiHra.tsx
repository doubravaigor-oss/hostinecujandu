import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { RotateCcw, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { maggiText as text } from "@/data/hostinec";
import { zvukKapka } from "@/lib/zvuky";
import lahev from "@/assets/maggi-bottle.png";
import polevka from "@/assets/maggi-soup.png";

// Hra v postranním sloupci: scéna se zmenší podle šířky sloupce,
// takže se vejde i vedle menu na malém displeji.
export function MaggiHra() {
  const [kapky, setKapky] = useState(0);
  const [davka, setDavka] = useState("5");
  const [leje, setLeje] = useState(false);
  const casovac = useRef<ReturnType<typeof setInterval> | null>(null);
  const id = useId();
  const pocet = Number(davka);
  const platnaDavka = Number.isSafeInteger(pocet) && pocet > 0;

  useEffect(() => () => {
    if (casovac.current) clearInterval(casovac.current);
  }, []);

  function nalit(kolik: number) {
    if (leje) return;
    setLeje(true);
    let krok = 0;
    let pridano = 0;
    const kroky = Math.min(20, Math.max(5, kolik));
    casovac.current = setInterval(() => {
      krok += 1;
      zvukKapka();
      const cil = Math.round(kolik * krok / kroky);
      const navic = cil - pridano;
      pridano = cil;
      setKapky((predchozi) => Math.min(Number.MAX_SAFE_INTEGER, predchozi + navic));
      if (krok >= kroky) {
        if (casovac.current) clearInterval(casovac.current);
        casovac.current = null;
        setLeje(false);
      }
    }, 130);
  }

  function nova() {
    if (casovac.current) clearInterval(casovac.current);
    casovac.current = null;
    setKapky(0);
    setLeje(false);
  }

  return (
    <div className="frame paper p-2 text-xs" aria-labelledby={`${id}-nadpis`}>
      <div className="retro-heading -mx-2 -mt-2 mb-2 text-sm" id={`${id}-nadpis`}>{text.nadpis}</div>
      <p className="mb-2">{text.uvod}</p>
      <div className="maggi-layout">
        <div className={`maggi-scena ${leje ? "maggi-leje" : ""}`} data-kapky={kapky}>
          <div className="maggi-miska">
            <img src={polevka} alt="Miska vývaru s nudlemi a zeleninou" width={992} height={672} loading="lazy" />
            <span className="maggi-hladina" aria-hidden="true" style={{ "--maggi-strength": Math.min(0.95, kapky / 60) } as CSSProperties} />
          </div>
          <Button variant="ghost" className="maggi-lahev" aria-label={text.kapka} title={text.kapka} disabled={leje} onClick={() => nalit(1)}>
            <img src={lahev} alt={text.lahvicka} width={672} height={992} loading="lazy" draggable={false} />
          </Button>
          {leje && <span className="maggi-proud" aria-hidden="true"><i /><i /><i /></span>}
        </div>
        <div className="maggi-ovladani">
          <p className="font-bold" role="status" aria-live="polite">{text.pocet} <span>{kapky}</span></p>
          <p className="maggi-hlaska text-xs text-title">{kapky === 0 ? text.cista : kapky < 15 ? text.trochu : kapky < 60 ? text.hodne : text.hneda}</p>
          <form onSubmit={(e) => { e.preventDefault(); if (platnaDavka) nalit(pocet); }} className="flex flex-wrap items-end gap-1">
            <label className="flex flex-col gap-1 text-xs" htmlFor={`${id}-davka`}>
              {text.davka}
              <input id={`${id}-davka`} className="retro-input w-16" type="number" min="1" step="1" value={davka} disabled={leje} onChange={(e) => setDavka(e.target.value)} />
            </label>
            <Button type="submit" variant="ghost" disabled={leje || !platnaDavka} className="retro-btn h-auto rounded-none text-xs"><Droplet size={12} />{text.pridat}</Button>
          </form>
          <Button variant="ghost" onClick={nova} className="retro-btn mt-2 h-auto rounded-none text-xs"><RotateCcw size={12} />{text.nova}</Button>
        </div>
      </div>
    </div>
  );
}
