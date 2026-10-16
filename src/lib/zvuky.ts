// Veselé zvuky her – malé syntetizované tóny přímo v prohlížeči (Web Audio API).
// Nic se nestahuje, nic se neplatí. Zvuky hrají až po kliknutí návštěvníka,
// takže prohlížeče je neblokují.

let kontext: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!kontext) kontext = new AC();
  if (kontext.state === "suspended") void kontext.resume();
  return kontext;
}

function ton(freq: number, zacatek: number, delka: number, typ: OscillatorType = "square", hlasitost = 0.08, konec?: number) {
  const ctx = audio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = typ;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + zacatek);
  if (konec) osc.frequency.exponentialRampToValueAtTime(konec, ctx.currentTime + zacatek + delka);
  gain.gain.setValueAtTime(hlasitost, ctx.currentTime + zacatek);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + zacatek + delka);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + zacatek);
  osc.stop(ctx.currentTime + zacatek + delka + 0.02);
}

/** Kapka Maggi dopadne do polévky – krátké „plop". */
export function zvukKapka() {
  ton(620, 0, 0.09, "sine", 0.12, 180);
}

/** Cvakání točících se válců automatu. */
export function zvukCvak() {
  ton(1400, 0, 0.03, "square", 0.03);
}

/** Válec se zastavil – dunění. */
export function zvukZastaveni() {
  ton(220, 0, 0.12, "triangle", 0.15, 90);
}

/** Zatáhnutí páky. */
export function zvukPaka() {
  ton(300, 0, 0.15, "sawtooth", 0.06, 120);
}

/** Výherní fanfára. */
export function zvukVyhra() {
  const noty = [523, 659, 784, 1047, 784, 1047];
  noty.forEach((n, i) => ton(n, i * 0.12, 0.16, "square", 0.07));
}

/** Štamgast pije pivo – hluboké lokání. */
export function zvukPivo() {
  for (let i = 0; i < 4; i++) ton(160 - i * 15, i * 0.35, 0.22, "sine", 0.12, 70);
}

/** Panák zelené – rychlé exnutí. */
export function zvukPanak() {
  ton(400, 0, 0.25, "sine", 0.12, 60);
  ton(900, 0.28, 0.08, "square", 0.05);
}

/** Štamgast na suchu – smutné „bééé". */
export function zvukPlac() {
  ton(520, 0, 0.35, "sawtooth", 0.05, 380);
  ton(380, 0.4, 0.35, "sawtooth", 0.05, 260);
  ton(260, 0.8, 0.5, "sawtooth", 0.05, 140);
}
