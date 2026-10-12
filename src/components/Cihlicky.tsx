import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { hraText } from "@/data/hostinec";
import { Pause, Play, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";

type Stav = "ready" | "playing" | "paused" | "won" | "lost";
type Ovladani = { start: () => void; pause: () => void; reset: () => void; move: (x: number) => void };

export function Cihlicky() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controls = useRef<Ovladani | null>(null);
  const keys = useRef({ left: false, right: false });
  const [stav, setStav] = useState<Stav>("ready");
  const [skore, setSkore] = useState(0);
  const [zivoty, setZivoty] = useState(3);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    import("matter-js").then(({ default: M }) => {
      const el = canvas.current;
      const ctx = el?.getContext("2d");
      if (disposed || !el || !ctx) return;
      const { Engine, Bodies, Body, Composite, Events } = M;
      const engine = Engine.create({ gravity: { x: 0, y: 0 } });
      const colors = getComputedStyle(el);
      const token = (name: string) => colors.getPropertyValue(name).trim();
      const ink = token("--game-ink");
      const palette = ["--game-red", "--game-gold", "--game-green", "--game-cyan"].map(token);
      let status: Stav = "ready", score = 0, lives = 3, frame = 0, last = 0, accumulator = 0;
      let paddle = Bodies.rectangle(320, 388, 96, 14, { isStatic: true, label: "paddle" });
      let ball = Bodies.circle(320, 368, 7, { restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0, inertia: Infinity, label: "ball" });
      let bricks: typeof paddle[] = [];
      const change = (next: Stav) => { status = next; setStav(next); };
      const move = (x: number) => {
        Body.setPosition(paddle, { x: Math.max(50, Math.min(590, x)), y: 388 });
        if (status === "ready") Body.setPosition(ball, { x: paddle.position.x, y: 368 });
      };
      const reset = () => {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        paddle = Bodies.rectangle(320, 388, 96, 14, { isStatic: true, label: "paddle" });
        ball = Bodies.circle(320, 368, 7, { restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0, inertia: Infinity, label: "ball" });
        bricks = Array.from({ length: 40 }, (_, i) => Bodies.rectangle(54 + (i % 10) * 59, 55 + Math.floor(i / 10) * 25, 53, 18, { isStatic: true, restitution: 1, friction: 0, label: "brick" }));
        Composite.add(engine.world, [paddle, ball, ...bricks,
          Bodies.rectangle(-10, 210, 20, 460, { isStatic: true, restitution: 1, friction: 0 }),
          Bodies.rectangle(650, 210, 20, 460, { isStatic: true, restitution: 1, friction: 0 }),
          Bodies.rectangle(320, -10, 660, 20, { isStatic: true, restitution: 1, friction: 0 }),
        ]);
        score = 0; lives = 3; setSkore(0); setZivoty(3); change("ready");
      };
      const start = () => {
        if (status === "won" || status === "lost") reset();
        if (status === "ready") Body.setVelocity(ball, { x: 2.8, y: -4.6 });
        change("playing"); el.focus();
      };
      const pause = () => { if (status === "playing") change("paused"); else if (status === "paused") start(); };
      controls.current = { move, start, pause, reset };
      Events.on(engine, "collisionStart", (event) => {
        for (const pair of event.pairs) {
          const other = pair.bodyA === ball ? pair.bodyB : pair.bodyB === ball ? pair.bodyA : null;
          if (other?.label === "brick" && bricks.includes(other)) {
            bricks = bricks.filter((b) => b !== other); Composite.remove(engine.world, other);
            score += 10; setSkore(score);
            if (!bricks.length) change("won");
          }
          if (other === paddle && ball.position.y < paddle.position.y) {
            const vx = Math.max(-4.5, Math.min(4.5, (ball.position.x - paddle.position.x) / 10));
            Body.setVelocity(ball, { x: vx, y: -Math.sqrt(30 - vx * vx) });
          }
        }
      });
      const draw = (now: number) => {
        accumulator += Math.min(now - (last || now), 50); last = now;
        while (accumulator >= 1000 / 60) {
          if (status === "playing") {
            if (keys.current.left) move(paddle.position.x - 7);
            if (keys.current.right) move(paddle.position.x + 7);
            Engine.update(engine, 1000 / 60);
            const speed = Math.hypot(ball.velocity.x, ball.velocity.y);
            if (speed > 0) Body.setVelocity(ball, { x: ball.velocity.x / speed * 5.5, y: (Math.abs(ball.velocity.y) < 1.2 ? (ball.velocity.y < 0 ? -1.8 : 1.8) : ball.velocity.y / speed * 5.5) });
            if (ball.position.y > 435) {
              lives--; setZivoty(lives);
              Body.setPosition(ball, { x: paddle.position.x, y: 368 }); Body.setVelocity(ball, { x: 0, y: 0 });
              change(lives > 0 ? "ready" : "lost");
            }
          }
          accumulator -= 1000 / 60;
        }
        ctx.clearRect(0, 0, 640, 420);
        ctx.strokeStyle = ink; ctx.globalAlpha = 0.1;
        for (let y = 0; y < 420; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(640, y); ctx.stroke(); }
        ctx.globalAlpha = 1;
        for (const brick of bricks) {
          ctx.fillStyle = palette[Math.max(0, Math.min(3, Math.round((brick.position.y - 55) / 25)))];
          ctx.fillRect(brick.position.x - 26.5, brick.position.y - 9, 53, 18);
          ctx.fillStyle = ink; ctx.globalAlpha = 0.35; ctx.fillRect(brick.position.x - 25, brick.position.y - 8, 50, 2); ctx.globalAlpha = 1;
        }
        ctx.fillStyle = ink; ctx.fillRect(paddle.position.x - 48, 381, 96, 14);
        ctx.beginPath(); ctx.arc(ball.position.x, ball.position.y, 7, 0, Math.PI * 2); ctx.fill();
        frame = requestAnimationFrame(draw);
      };
      reset(); frame = requestAnimationFrame(draw);
      const hidden = () => { keys.current = { left: false, right: false }; if (status === "playing") change("paused"); };
      window.addEventListener("blur", hidden);
      cleanup = () => { cancelAnimationFrame(frame); window.removeEventListener("blur", hidden); Events.off(engine, "collisionStart"); Composite.clear(engine.world, false); Engine.clear(engine); controls.current = null; };
    });
    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div>
      <div className="mb-2 flex justify-between font-mono font-bold" aria-live="polite"><span>SKÓRE: {skore.toString().padStart(4, "0")}</span><span>ŽIVOTY: {zivoty}</span></div>
      <div className="cihlicky-screen relative">
        <canvas ref={canvas} width={640} height={420} tabIndex={0} aria-label="Cihličky, hrací plocha" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); controls.current?.move((e.clientX - r.left) * 640 / r.width); }} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); e.currentTarget.focus(); }} onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
          if (e.key === "ArrowLeft") keys.current.left = true;
          if (e.key === "ArrowRight") keys.current.right = true;
          if (e.key === " ") stav === "playing" ? controls.current?.pause() : controls.current?.start();
        }} onKeyUp={(e) => { if (e.key === "ArrowLeft") keys.current.left = false; if (e.key === "ArrowRight") keys.current.right = false; }} onBlur={() => { keys.current = { left: false, right: false }; }} />
        {stav !== "playing" && <div className="cihlicky-overlay absolute inset-x-4 top-1/2 text-center p-3 pointer-events-none"><b className="text-lg">{stav === "ready" ? hraText.pripravena : stav === "paused" ? hraText.pauza : stav === "won" ? hraText.vyhra : hraText.konec}</b></div>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        <Button className="retro-btn" onClick={() => stav === "playing" ? controls.current?.pause() : controls.current?.start()}>{stav === "playing" ? <Pause /> : <Play />}{stav === "playing" ? "Pauza" : stav === "paused" ? "Pokračovat" : "Hrát"}</Button>
        <Button className="retro-btn" onClick={() => controls.current?.reset()}><RotateCcw />Nová hra</Button>
        <Button className="retro-btn" aria-label="Plošinka doleva" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); keys.current.left = true; }} onPointerUp={() => { keys.current.left = false; }} onPointerCancel={() => { keys.current.left = false; }}><ArrowLeft /></Button>
        <Button className="retro-btn" aria-label="Plošinka doprava" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); keys.current.right = true; }} onPointerUp={() => { keys.current.right = false; }} onPointerCancel={() => { keys.current.right = false; }}><ArrowRight /></Button>
      </div>
    </div>
  );
}