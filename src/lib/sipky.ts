export const SEKTORY = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5] as const;
export const TERC = { stred: 240, bull: 7, outerBull: 16, tripleIn: 100, tripleOut: 112, doubleIn: 168, okraj: 180 };

export function vyhodnotHod(x: number, y: number) {
  const dx = x - TERC.stred;
  const dy = y - TERC.stred;
  const r = Math.hypot(dx, dy);
  if (r > TERC.okraj) return { body: 0, popis: "0", poharek: false };
  if (r <= TERC.bull) return { body: 50, popis: "BULL · 50", poharek: true };
  if (r <= TERC.outerBull) return { body: 25, popis: "25", poharek: false };
  const uhel = (Math.atan2(dx, -dy) * 180 / Math.PI + 369) % 360;
  const sektor = SEKTORY[Math.floor(uhel / 18)] ?? 20;
  const nasobek = r >= TERC.doubleIn ? 2 : r >= TERC.tripleIn && r <= TERC.tripleOut ? 3 : 1;
  return { body: sektor * nasobek, popis: `${nasobek > 1 ? `${nasobek} × ` : ""}${sektor}`, poharek: sektor === 20 && nasobek === 3 };
}

export function bodNaTerci(r: number, stupne: number): [number, number] {
  const rad = stupne * Math.PI / 180;
  return [TERC.stred + r * Math.sin(rad), TERC.stred - r * Math.cos(rad)];
}

export function vysec(r1: number, r2: number, od: number, doUhlu: number) {
  const a = bodNaTerci(r2, od), b = bodNaTerci(r2, doUhlu);
  const c = bodNaTerci(r1, doUhlu), d = bodNaTerci(r1, od);
  return `M ${a.join(" ")} A ${r2} ${r2} 0 0 1 ${b.join(" ")} L ${c.join(" ")} A ${r1} ${r1} 0 0 0 ${d.join(" ")} Z`;
}