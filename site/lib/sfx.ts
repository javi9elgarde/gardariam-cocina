"use client";

/**
 * Sonidos sutiles generados por código (sin archivos que descargar).
 * Se pueden silenciar y la preferencia se guarda en el dispositivo.
 */

const KEY = "gardariam_sonido_v1";

let ctx: AudioContext | null = null;

export function sonidoActivo(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) !== "off";
}

export function alternarSonido(): boolean {
  const nuevo = !sonidoActivo();
  localStorage.setItem(KEY, nuevo ? "on" : "off");
  return nuevo;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface Nota {
  f: number; // frecuencia
  t: number; // cuándo empieza (s)
  d: number; // duración (s)
  v?: number; // volumen
  tipo?: OscillatorType;
}

function tocar(notas: Nota[]) {
  if (!sonidoActivo()) return;
  const a = audio();
  if (!a) return;
  const ahora = a.currentTime;
  for (const n of notas) {
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = n.tipo ?? "sine";
    osc.frequency.value = n.f;
    const vol = n.v ?? 0.05;
    const t0 = ahora + n.t;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + n.d);
    osc.connect(gain).connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + n.d + 0.02);
  }
}

/** Ruido corto tipo "hoja de papel" para pasar página */
function papel() {
  if (!sonidoActivo()) return;
  const a = audio();
  if (!a) return;
  const dur = 0.22;
  const buffer = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const p = i / data.length;
    // ruido que sube y baja rápido
    data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * p) * 0.5;
  }
  const src = a.createBufferSource();
  src.buffer = buffer;
  const filtro = a.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.frequency.value = 2600;
  filtro.Q.value = 0.8;
  const gain = a.createGain();
  gain.gain.value = 0.05;
  src.connect(filtro).connect(gain).connect(a.destination);
  src.start();
}

/* ---------------- Sonidos de la web ---------------- */

export const sfx = {
  /** abrir una receta / ficha */
  abrir: () => tocar([{ f: 523.25, t: 0, d: 0.16, v: 0.045 }, { f: 783.99, t: 0.07, d: 0.22, v: 0.04 }]),
  /** cerrar */
  cerrar: () => tocar([{ f: 587.33, t: 0, d: 0.14, v: 0.035 }, { f: 392, t: 0.06, d: 0.18, v: 0.03 }]),
  /** pasar página del libro */
  pagina: () => papel(),
  /** marcar ingrediente o paso */
  check: () => tocar([{ f: 880, t: 0, d: 0.09, v: 0.04 }, { f: 1318.5, t: 0.05, d: 0.12, v: 0.035 }]),
  /** añadir a favoritas */
  favorito: () =>
    tocar([
      { f: 659.25, t: 0, d: 0.12, v: 0.045 },
      { f: 987.77, t: 0.08, d: 0.16, v: 0.04 },
    ]),
  /** sellar un reto */
  sello: () =>
    tocar([
      { f: 392, t: 0, d: 0.1, v: 0.06, tipo: "triangle" },
      { f: 523.25, t: 0.08, d: 0.14, v: 0.05, tipo: "triangle" },
      { f: 659.25, t: 0.16, d: 0.26, v: 0.045, tipo: "triangle" },
    ]),
};
