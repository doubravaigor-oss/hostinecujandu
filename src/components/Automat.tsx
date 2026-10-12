import { useEffect, useRef, useState } from "react";

const SYMBOLY = ["UTOPENEC", "HERMELÍN", "PIVO", "ŠIPKA", "TOUST"];

function nahodny() {
  return SYMBOLY[Math.floor(Math.random() * SYMBOLY.length)];
}

export function Automat() {
  const [valce, setValce] = useState<string[]>(["UTOPENEC", "HERMELÍN", "PIVO"]);
  const [toci, setToci] = useState(false);
  const [vyhra, setVyhra] = useState(false);
  const [zprava, setZprava] = useState("Zatáhněte za páku!");
  const [padaji, setPadaji] = useState<{ id: number; txt: string; left: number; delay: number }[]>([]);
  const casovac = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (casovac.current) clearInterval(casovac.current); }, []);

  const hraj = () => {
    if (toci) return;
    setToci(true);
    setVyhra(false);
    setPadaji([]);
    setZprava("Točí se...");
    let n = 0;
    casovac.current = setInterval(() => {
      n++;
      setValce([nahodny(), nahodny(), nahodny()]);
      if (n >= 14) {
        if (casovac.current) clearInterval(casovac.current);
        // zhruba každá čtvrtá hra vyhrává
        const vyhrava = Math.random() < 0.28;
        const v = nahodny();
        const konec = vyhrava ? [v, v, v] : [nahodny(), nahodny(), nahodny()];
        if (!vyhrava && konec[0] === konec[1] && konec[1] === konec[2]) konec[2] = SYMBOLY[(SYMBOLY.indexOf(konec[2]) + 1) % SYMBOLY.length];
        setValce(konec);
        setToci(false);
        if (vyhrava) {
          setVyhra(true);
          setZprava("VÝHRA! Sype se hospodská sláva!");
          setPadaji(
            Array.from({ length: 22 }, (_, i) => ({
              id: i,
              txt: i % 2 ? "HERMELÍN" : "UTOPENEC",
              left: Math.random() * 90,
              delay: Math.random() * 1.2,
            })),
          );
          setTimeout(() => setPadaji([]), 4500);
        } else {
          setZprava("Nic. Zkuste to znovu :-)");
        }
      }
    }, 90);
  };

  return (
    <div className="frame paper p-2 text-xs text-center">
      <div className="retro-heading -mx-2 -mt-2 mb-2 text-sm">★ Hospodský automat ★</div>
      <div className="mb-1 flex gap-1">
        {valce.map((s, i) => (
          <div
            key={i}
            className="flex h-10 flex-1 items-center justify-center border-2 border-border bg-background px-0.5 text-[9px] font-bold leading-tight"
            style={vyhra ? { background: "var(--beer)" } : undefined}
          >
            {s}
          </div>
        ))}
      </div>
      <div className={vyhra ? "blink mb-1 font-bold text-accent" : "mb-1"}>{zprava}</div>
      <button type="button" className="retro-btn w-full text-xs" onClick={hraj} disabled={toci}>
        » ZATÁHNOUT «
      </button>
      <div className="mt-1 text-muted-foreground">Hra jen pro zábavu, o nic se nehraje.</div>
      {padaji.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
          {padaji.map((p) => (
            <span
              key={p.id}
              className="padajici retro-badge"
              style={{ left: `${p.left}%`, animationDelay: `${p.delay}s` }}
            >
              {p.txt}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
