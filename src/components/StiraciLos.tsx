import { useEffect, useRef, useState } from "react";

// Stírací los – vtipek, ale stírá se doopravdy (myší i prstem na telefonu).
// Věty jsou jen pro zábavu, o nic se nehraje.
const VYHRY = [
  "Jeden upřímný úsměv obsluhy",
  "Pivo vám dnes bude chutnat o 20 % líp",
  "Sleva 0 Kč – ale s úsměvem",
  "První šipka do terče vám vždycky sedne",
  "Tichý souhlas souseda u piva",
  "Medaile za trpělivost se stíráním",
  "Jeden utopenec navíc (jen v duchu)",
  "Nic. Ale hezky jste si zabrali.",
];

const VYSKA = 108;

export function StiraciLos({ sirka = 176 }: { sirka?: number }) {
  const platno = useRef<HTMLCanvasElement | null>(null);
  const [vyhra, setVyhra] = useState("…");
  const [setreno, setSetreno] = useState(false);
  const [kolo, setKolo] = useState(0);
  const kreslim = useRef(false);

  // náhoda až po načtení stránky – server a prohlížeč musí začít stejně
  useEffect(() => {
    setVyhra(VYHRY[Math.floor(Math.random() * VYHRY.length)] ?? VYHRY[0]);
    setSetreno(false);
    const c = platno.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = sirka * dpr;
    c.height = VYSKA * dpr;
    const g = c.getContext("2d");
    if (!g) return;
    g.scale(dpr, dpr);
    g.clearRect(0, 0, sirka, VYSKA);
    g.fillStyle = "#b9a184";
    g.fillRect(0, 0, sirka, VYSKA);
    g.strokeStyle = "rgba(255,255,255,0.35)";
    g.lineWidth = 1;
    for (let x = -VYSKA; x < sirka; x += 7) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x + VYSKA, VYSKA);
      g.stroke();
    }
    g.fillStyle = "#4a3222";
    g.font = "bold 15px Georgia, serif";
    g.textAlign = "center";
    g.fillText("STÍRACÍ LOS", sirka / 2, VYSKA / 2 - 6);
    g.font = "11px Georgia, serif";
    g.fillText("setřete prstem nebo myší", sirka / 2, VYSKA / 2 + 14);
  }, [kolo, sirka]);

  const smazat = (x: number, y: number) => {
    const g = platno.current?.getContext("2d");
    if (!g) return;
    g.globalCompositeOperation = "destination-out";
    g.beginPath();
    g.arc(x, y, 15, 0, Math.PI * 2);
    g.fill();
    g.globalCompositeOperation = "source-over";
  };

  const souradnice = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = platno.current;
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const kontrola = () => {
    const c = platno.current;
    const g = c?.getContext("2d");
    if (!c || !g || setreno) return;
    const data = g.getImageData(0, 0, c.width, c.height).data;
    let volno = 0;
    for (let i = 3; i < data.length; i += 40) if (data[i] === 0) volno++;
    if (volno / (data.length / 40) > 0.45) {
      setSetreno(true);
      g.clearRect(0, 0, c.width, c.height);
    }
  };

  return (
    <div className="frame paper p-2" style={{ width: sirka + 16 }}>
      <div className="retro-heading -mx-2 -mt-2 mb-2 text-xs">★ STÍRACÍ LOS ★</div>
      <div className="relative" style={{ height: VYSKA }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <span className="text-[10px] text-muted-foreground">vaše „výhra“:</span>
          <span className="text-xs font-bold text-title">{vyhra}</span>
        </div>
        <canvas
          ref={platno}
          className="absolute inset-0 cursor-crosshair border-2 border-border"
          style={{ width: sirka, height: VYSKA, touchAction: "none" }}
          onPointerDown={(e) => {
            if (setreno) return;
            kreslim.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            const p = souradnice(e);
            if (p) smazat(p.x, p.y);
          }}
          onPointerMove={(e) => {
            if (!kreslim.current || setreno) return;
            const p = souradnice(e);
            if (p) smazat(p.x, p.y);
          }}
          onPointerUp={() => {
            kreslim.current = false;
            kontrola();
          }}
          onPointerLeave={() => {
            kreslim.current = false;
            kontrola();
          }}
        />
      </div>
      <div className="mt-1 text-center text-[10px] text-muted-foreground">
        {setreno ? "Vyhráno! Gratulujeme." : "Žádná sázka, jen zábava."}
      </div>
      <button
        type="button"
        className="retro-btn mt-1 w-full text-xs"
        onClick={() => setKolo((k) => k + 1)}
      >
        » Nový los «
      </button>
    </div>
  );
}
