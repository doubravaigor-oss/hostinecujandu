import { useEffect, useRef, useState } from "react";
import { RotateCcw, Volume2, VolumeX, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sipkyText as text } from "@/data/hostinec";
import { SEKTORY, TERC, bodNaTerci, vyhodnotHod, vysec } from "@/lib/sipky";
import { zvukZastaveni, zvukVyhra } from "@/lib/zvuky";

type Hod = ReturnType<typeof vyhodnotHod> & { x: number; y: number };

export function Sipky() {
  const [hody, setHody] = useState<Hod[]>([]);
  const [miri, setMiri] = useState({ x: 240, y: 160 });
  const [leti, setLeti] = useState(false);
  const [poharek, setPoharek] = useState(false);
  const [zvuk, setZvuk] = useState(true);
  const [rekord, setRekord] = useState(0);
  const [zprava, setZprava] = useState(text.pripravena);
  const zaklad = useRef({ x: 240, y: 160 });
  const cil = useRef(miri);
  const zamceno = useRef(false);
  const casovac = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soucet = hody.reduce((s, h) => s + h.body, 0);

  useEffect(() => {
    try { setRekord(Number(localStorage.getItem("jandu-sipky-rekord")) || 0); } catch { /* Soukromý režim. */ }
    let frame = 0;
    const animace = (t: number) => {
      if (!zamceno.current) {
        const bod = { x: zaklad.current.x + Math.sin(t / 430) * 12, y: zaklad.current.y + Math.cos(t / 570) * 10 };
        cil.current = bod;
        setMiri(bod);
      }
      frame = requestAnimationFrame(animace);
    };
    frame = requestAnimationFrame(animace);
    return () => { cancelAnimationFrame(frame); if (casovac.current) clearTimeout(casovac.current); };
  }, []);

  function hodit() {
    if (zamceno.current || hody.length >= 3) return;
    zamceno.current = true;
    setLeti(true);
    setPoharek(false);
    const { x, y } = cil.current;
    const hod = { ...vyhodnotHod(x, y), x, y };
    casovac.current = setTimeout(() => {
      const nove = [...hody, hod];
      setHody(nove);
      setLeti(false);
      setPoharek(hod.poharek);
      setZprava(hod.poharek ? hod.body === 50 ? text.stred : text.triple : hod.body === 0 ? text.vedle : `${hod.popis} · ${hod.body} b.`);
      if (zvuk) { if (hod.poharek) zvukVyhra(); else zvukZastaveni(); }
      if (nove.length === 3) {
        const body = nove.reduce((s, h) => s + h.body, 0);
        if (body > rekord) {
          setRekord(body);
          try { localStorage.setItem("jandu-sipky-rekord", String(body)); } catch { /* Hra funguje i bez ukládání. */ }
        }
      } else zamceno.current = false;
    }, 300);
  }

  function znovu() {
    setHody([]); setPoharek(false); setZprava(text.pripravena); zamceno.current = false;
  }

  return (
    <div className="sipky-hra">
      <div className="sipky-skore">
        <span>{text.body} <b>{soucet}</b></span>
        <span>{text.kolo} <b>{hody.length}/3</b></span>
        <span>{text.rekord} <b>{rekord}</b></span>
        <Button variant="ghost" size="icon" className="retro-btn rounded-none" onClick={() => setZvuk(!zvuk)} aria-label={zvuk ? text.ticho : text.zvuk} title={zvuk ? text.ticho : text.zvuk}>{zvuk ? <Volume2 /> : <VolumeX />}</Button>
      </div>
      <div className="sipky-scena">
        <Button variant="ghost" className="sipky-terc" aria-label={text.terc} disabled={leti || hody.length === 3} onClick={hodit}
          onPointerMove={(e) => {
            if (zamceno.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            zaklad.current = { x: (e.clientX - rect.left) / rect.width * 480, y: (e.clientY - rect.top) / rect.height * 480 };
          }}>
          <svg viewBox="0 0 480 480" className="sipky-svg" aria-hidden="true">
            <circle cx="240" cy="240" r="235" className="sipky-lem" />
            <circle cx="240" cy="240" r="181" className="sipky-svetla" />
            {SEKTORY.map((n, i) => {
              const od = i * 18 - 9, konec = od + 18;
              const [x, y] = bodNaTerci(205, i * 18);
              return <g key={n}>
                <path d={vysec(16, 180, od, konec)} className={i % 2 ? "sipky-svetla" : "sipky-tmava"} />
                <path d={vysec(100, 112, od, konec)} className={i % 2 ? "sipky-zelena" : "sipky-cervena"} />
                <path d={vysec(168, 180, od, konec)} className={i % 2 ? "sipky-zelena" : "sipky-cervena"} />
                <text x={x} y={y} dy=".35em" textAnchor="middle" className="sipky-cislo">{n}</text>
              </g>;
            })}
            <circle cx="240" cy="240" r={TERC.outerBull} className="sipky-zelena" />
            <circle cx="240" cy="240" r={TERC.bull} className="sipky-cervena" />
            {hody.map((h, i) => <g key={i} transform={`translate(${h.x} ${h.y})`} className="sipky-zapichnuta"><path d="M0 0 L17 -29" /><path d="M11 -20 L12 -38 L28 -38 L17 -29 Z" className="sipky-letka" /><circle r="3" /></g>)}
            {hody.length < 3 && <g transform={`translate(${miri.x} ${miri.y})`} className={leti ? "sipky-zamerovac sipky-let" : "sipky-zamerovac"}><circle r="9" /><path d="M-17 0 H-5 M5 0 H17 M0 -17 V-5 M0 5 V17" /></g>}
          </svg>
        </Button>
        {poharek && <div key={hody.length} className="sipky-poharek" role="status">
          <svg viewBox="0 0 100 120" aria-hidden="true"><path d="M17 12 H83 L72 109 Q50 117 28 109 Z" className="sipky-sklo" /><path d="M26 49 H74 L68 103 Q50 109 32 103 Z" className="sipky-napoj" /><path d="M27 22 L33 88" className="sipky-odlesk" /></svg>
          <b>{text.poharek}</b>
        </div>}
      </div>
      <p className="sipky-vysledek" role="status" aria-live="polite">{zprava}</p>
      <div className="sipky-hody">{[0, 1, 2].map(i => <span key={i}>{hody[i]?.popis ?? "—"}</span>)}</div>
      <div className="mt-3 flex justify-center">
        {hody.length === 3 ? <Button variant="ghost" className="retro-btn rounded-none" onClick={znovu}><RotateCcw />{text.znovu}</Button> : <Button variant="ghost" className="retro-btn rounded-none" onClick={hodit} disabled={leti}><Crosshair />{text.hodit}</Button>}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">{text.poznamka}</p>
    </div>
  );
}