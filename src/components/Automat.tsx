import { useEffect, useRef, useState } from "react";
import burt from "@/assets/burt.png";
import hermelin from "@/assets/hermelin.png";
import utopenec from "@/assets/utopenec.png";

const OBR = [utopenec, burt, hermelin];
const nahodnyObr = () => OBR[Math.floor(Math.random() * OBR.length)] ?? utopenec;

const SYMBOLY = ["UTOPENEC", "HERMELÍN", "PIVO", "ŠIPKA", "TOUST"];
const rnd = () => SYMBOLY[Math.floor(Math.random() * SYMBOLY.length)] ?? "PIVO";
const novyValec = () => [rnd(), rnd(), rnd()];
// kolik "cvaknutí" udělá každý válec, než se zastaví
const ZASTAVENI = [12, 19, 26];

export function Automat() {
  const [valce, setValce] = useState<string[][]>([novyValec(), novyValec(), novyValec()]);
  const [stoji, setStoji] = useState<boolean[]>([true, true, true]);
  const [paka, setPaka] = useState(false);
  const [vyhra, setVyhra] = useState(false);
  const [zprava, setZprava] = useState("Zatáhněte za páku!");
  const [padaji, setPadaji] = useState<{ id: number; img: string; vel: number; left: number; delay: number; trv: number }[]>([]);
  const casovac = useRef<ReturnType<typeof setInterval> | null>(null);
  const bezi = stoji.some((s) => !s);

  useEffect(() => () => { if (casovac.current) clearInterval(casovac.current); }, []);

  const hraj = () => {
    if (bezi) return;
    setVyhra(false);
    setPadaji([]);
    setZprava("Točí se...");
    setPaka(true);
    setTimeout(() => setPaka(false), 450);
    setStoji([false, false, false]);
    const vyhrava = Math.random() < 0.28;
    const vitez = rnd();
    let n = 0;
    casovac.current = setInterval(() => {
      n++;
      const hotovo = ZASTAVENI.map((z) => n >= z);
      setValce((stare) =>
        stare.map((v, i) => {
          if (n > (ZASTAVENI[i] ?? 0)) return v;
          const posledni = n === ZASTAVENI[i];
          let novy = rnd();
          if (posledni) {
            // prostřední řádek = výsledek
            novy = vyhrava ? vitez : rnd();
          }
          // symbol se posune dolů, nový naskočí nahoře; po zastavení se výsledek "usadí" doprostřed
          return posledni ? [rnd(), novy, rnd()] : [novy, v[0] ?? rnd(), v[1] ?? rnd()];
        }),
      );
      setStoji(hotovo);
      if (n >= (ZASTAVENI[2] ?? 26)) {
        if (casovac.current) clearInterval(casovac.current);
        if (vyhrava) {
          setVyhra(true);
          setZprava("VÝHRA! JACKPOT!");
          setPadaji(
            Array.from({ length: 26 }, (_, i) => ({
              id: i,
              img: nahodnyObr(),
              vel: 70 + Math.round(Math.random() * 90),
              left: Math.random() * 86,
              delay: Math.random() * 1.3,
              trv: 2.3 + Math.random() * 1.3,
            })),
          );
          setTimeout(() => setPadaji([]), 5200);
        } else {
          setZprava("Nic. Zkuste to znovu :-)");
        }
      }
    }, 80);
  };

  // pokud by náhodou nová prostřední trojice vyšla shodně bez výhry, nevadí – výhra se řídí vyhrava
  return (
    <div className="text-xs text-center">
      <div
        className="relative border-4 p-2 pr-5"
        style={{
          borderStyle: "outset",
          borderColor: "var(--beer)",
          background: "linear-gradient(to bottom, var(--wood-light), var(--wood))",
          borderRadius: 10,
        }}
      >
        {/* blikající žárovky nahoře */}
        <div className="mb-1 flex justify-between px-1" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className={vyhra || bezi ? "blink" : ""}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: i % 2 ? "var(--accent)" : "var(--beer)",
                animationDelay: `${(i % 2) * 0.5}s`,
              }}
            />
          ))}
        </div>
        <div
          className="mb-1 border-2 py-0.5 text-sm font-bold"
          style={{ borderStyle: "inset", background: "var(--background)", color: "var(--accent)", letterSpacing: 1 }}
        >
          ★ U JANDŮ ★
        </div>

        {/* okénko s válci */}
        <div className="relative border-4 p-1" style={{ borderStyle: "inset", background: "var(--background)" }}>
          <div className="flex gap-1">
            {valce.map((v, i) => (
              <div key={i} className="flex-1 overflow-hidden border-2 border-border" style={{ background: "var(--paper, var(--background))" }}>
                {v.map((s, r) => (
                  <div
                    key={r}
                    className="flex h-7 items-center justify-center text-[6.5px] font-bold leading-none tracking-tighter"
                    style={{
                      opacity: r === 1 ? 1 : 0.45,
                      filter: !stoji[i] ? "blur(1px)" : undefined,
                      background: r === 1 && vyhra ? "var(--beer)" : undefined,
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* výherní čára */}
          <div
            className="pointer-events-none absolute left-0 right-0"
            style={{ top: "50%", height: 2, background: "var(--accent)", opacity: 0.8 }}
            aria-hidden="true"
          />
        </div>

        <div className={vyhra ? "blink mt-1 font-bold text-accent" : "mt-1"}>{zprava}</div>

        {/* páka na boku */}
        <button
          type="button"
          onClick={hraj}
          disabled={bezi}
          aria-label="Zatáhnout za páku"
          className="absolute"
          style={{ right: 2, top: 28, width: 18, height: 80, background: "none", border: 0, cursor: bezi ? "default" : "pointer" }}
        >
          <span
            className="absolute left-1/2 block"
            style={{
              width: 5,
              height: 46,
              marginLeft: -2,
              background: "var(--border)",
              top: paka ? 22 : 4,
              transition: "top 0.2s",
            }}
          />
          <span
            className="absolute left-1/2 block"
            style={{
              width: 16,
              height: 16,
              marginLeft: -8,
              borderRadius: "50%",
              background: "var(--accent)",
              border: "2px outset var(--accent)",
              top: paka ? 58 : 0,
              transition: "top 0.2s",
            }}
          />
        </button>

        <button type="button" className="retro-btn mt-1 w-full text-xs" onClick={hraj} disabled={bezi}>
          » ZATÁHNOUT «
        </button>
      </div>
      <div className="mt-1 text-muted-foreground">Hra jen pro zábavu, o nic se nehraje.</div>

      {padaji.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
          {padaji.map((p) => (
            <img
              key={p.id}
              src={p.img}
              alt=""
              loading="lazy"
              width={360}
              height={360}
              className="padajici"
              style={{
                left: `${p.left}%`,
                width: p.vel,
                height: p.vel,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.trv}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
