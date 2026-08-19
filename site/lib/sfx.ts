"use client";

/**
 * Sonidos sutiles de la web: casi todos generados por código; el de pasar
 * página es un archivo grabado.
 * Se pueden silenciar y la preferencia se guarda en el dispositivo.
 */

const KEY = "gardariam_sonido_v1";

/** Sonidos grabados (los demás se generan por código) */
const SONIDO_PAGINA = "/cocina/sonidos/pasar-pagina.mp3";

let ctx: AudioContext | null = null;

export function sonidoActivo(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) !== "off";
}

export function alternarSonido(): boolean {
  const nuevo = !sonidoActivo();
  localStorage.setItem(KEY, nuevo ? "on" : "off");
  if (nuevo) despertar();
  return nuevo;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/**
 * Los navegadores dejan el audio "suspendido" hasta que hay un gesto del
 * usuario, y el móvil vuelve a suspenderlo al cambiar de pestaña o al recibir
 * una llamada. Si no se reanuda, el reloj del audio se queda parado y los
 * sonidos se programan en un instante ya pasado: no se oye nada.
 */
function despertar() {
  const a = audio();
  if (!a) return;
  if (a.state !== "running") void a.resume();
  // el primer toque es el momento de descodificar lo que ya se ha descargado
  cargarGrabado(a, SONIDO_PAGINA);
}

if (typeof window !== "undefined") {
  for (const ev of ["pointerdown", "touchstart", "keydown"]) {
    window.addEventListener(ev, despertar, { passive: true });
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) despertar();
  });
}

/** Ejecuta `fn` con el audio ya en marcha (esperando al resume si hace falta) */
function conAudio(fn: (a: AudioContext) => void) {
  if (!sonidoActivo()) return;
  const a = audio();
  if (!a) return;
  if (a.state === "running") {
    fn(a);
    return;
  }
  a.resume().then(
    () => fn(a),
    () => {},
  );
}

interface Nota {
  f: number; // frecuencia
  t: number; // cuándo empieza (s)
  d: number; // duración (s)
  v?: number; // volumen
  tipo?: OscillatorType;
}

function tocar(notas: Nota[]) {
  conAudio((a) => {
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
  });
}

/* ---------------- Sonidos grabados ---------------- */

/**
 * El archivo se descarga nada más abrir la web (eso no necesita permiso), y se
 * descodifica en cuanto existe un AudioContext, que sí lo necesita. Así ya está
 * listo en el primer clic y no se cuela el sonido de reserva.
 */
const descargas: Record<string, Promise<ArrayBuffer>> = {};
const grabados: Record<string, AudioBuffer | null | undefined> = {};
const decodificaciones: Record<string, Promise<AudioBuffer | null>> = {};

function descargar(url: string) {
  if (typeof window === "undefined" || url in descargas) return;
  descargas[url] = fetch(url).then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.arrayBuffer();
  });
  descargas[url].catch(() => {
    grabados[url] = null; // no se pudo: se queda el sonido generado
  });
}

function cargarGrabado(
  a: AudioContext,
  url: string,
): Promise<AudioBuffer | null> {
  const ya = grabados[url];
  if (ya !== undefined) return Promise.resolve(ya);
  if (!decodificaciones[url]) {
    descargar(url);
    decodificaciones[url] = descargas[url]
      // slice(0): decodeAudioData se queda con el buffer original
      .then((buf) => a.decodeAudioData(buf.slice(0)))
      .then((audio) => {
        grabados[url] = audio;
        return audio;
      })
      .catch(() => {
        grabados[url] = null;
        return null;
      });
  }
  return decodificaciones[url];
}

function sonar(a: AudioContext, buffer: AudioBuffer, vol: number) {
  const src = a.createBufferSource();
  src.buffer = buffer;
  const gain = a.createGain();
  gain.gain.value = vol;
  src.connect(gain).connect(a.destination);
  src.start();
}

/**
 * Reproduce un archivo. Si aún se está descodificando (solo pasa en el primer
 * sonido de la sesión) espera esos milisegundos en vez de tirar del sonido
 * generado, que se nota distinto. Si el archivo falla, suena `deReserva`.
 */
function reproducir(
  a: AudioContext,
  url: string,
  vol: number,
  deReserva: (a: AudioContext) => void,
) {
  const audio = grabados[url];
  if (audio) return sonar(a, audio, vol);
  if (audio === null) return deReserva(a);
  void cargarGrabado(a, url).then((b) => (b ? sonar(a, b, vol) : deReserva(a)));
}

/** Ruido marrón: más grave y "de papel" que el ruido blanco, que suena a escoba */
function ruidoMarron(a: AudioContext, dur: number): AudioBuffer {
  const buffer = a.createBuffer(
    1,
    Math.max(1, Math.floor(a.sampleRate * dur)),
    a.sampleRate,
  );
  const data = buffer.getChannelData(0);
  let ultimo = 0;
  for (let i = 0; i < data.length; i++) {
    const blanco = Math.random() * 2 - 1;
    ultimo = (ultimo + 0.035 * blanco) / 1.035;
    data[i] = ultimo * 3.2;
  }
  return buffer;
}

/**
 * Hoja de papel al pasar: un roce corto que baja de tono (el papel doblándose)
 * y un golpecito grave al final (la hoja al posarse).
 */
function papel() {
  conAudio((a) => reproducir(a, SONIDO_PAGINA, 0.55, papelGenerado));
}

/** Reserva por si el archivo no carga */
function papelGenerado(a: AudioContext) {
  const t0 = a.currentTime;
  const dur = 0.19;

  const src = a.createBufferSource();
  src.buffer = ruidoMarron(a, dur);

  const filtro = a.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.Q.value = 0.7;
  filtro.frequency.setValueAtTime(2200, t0);
  filtro.frequency.exponentialRampToValueAtTime(700, t0 + dur);

  const gain = a.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(0.11, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  src.connect(filtro).connect(gain).connect(a.destination);
  src.start(t0);
  src.stop(t0 + dur + 0.02);

  // golpecito de la hoja al apoyarse
  const golpe = a.createOscillator();
  const gGolpe = a.createGain();
  golpe.type = "sine";
  golpe.frequency.setValueAtTime(190, t0 + 0.11);
  golpe.frequency.exponentialRampToValueAtTime(90, t0 + 0.2);
  gGolpe.gain.setValueAtTime(0.0001, t0 + 0.11);
  gGolpe.gain.linearRampToValueAtTime(0.035, t0 + 0.125);
  gGolpe.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
  golpe.connect(gGolpe).connect(a.destination);
  golpe.start(t0 + 0.11);
  golpe.stop(t0 + 0.24);
}

/* ---------------- Sonidos de la web ---------------- */

export const sfx = {
  /** abrir una receta / ficha */
  abrir: () =>
    tocar([
      { f: 523.25, t: 0, d: 0.16, v: 0.045 },
      { f: 783.99, t: 0.07, d: 0.22, v: 0.04 },
    ]),
  /** cerrar */
  cerrar: () =>
    tocar([
      { f: 587.33, t: 0, d: 0.14, v: 0.035 },
      { f: 392, t: 0.06, d: 0.18, v: 0.03 },
    ]),
  /** pasar página del libro */
  pagina: () => papel(),
  /** marcar ingrediente o paso */
  check: () =>
    tocar([
      { f: 880, t: 0, d: 0.09, v: 0.04 },
      { f: 1318.5, t: 0.05, d: 0.12, v: 0.035 },
    ]),
  /** elegir un filtro de categoría */
  filtro: () =>
    tocar([
      { f: 740, t: 0, d: 0.07, v: 0.03, tipo: "triangle" },
      { f: 1108.73, t: 0.045, d: 0.1, v: 0.025, tipo: "triangle" },
    ]),
  /** quitar el filtro / volver a "todas" */
  filtroOff: () =>
    tocar([
      { f: 660, t: 0, d: 0.07, v: 0.028, tipo: "triangle" },
      { f: 494, t: 0.045, d: 0.1, v: 0.024, tipo: "triangle" },
    ]),
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
  /** ¡todos los retos completados! pequeña fanfarria */
  fanfarria: () => {
    // Do - Mi - Sol - Do agudo, con acompañamiento
    const melodia: Nota[] = [];
    const notas = [523.25, 659.25, 783.99, 1046.5];
    notas.forEach((f, i) => {
      melodia.push({ f, t: i * 0.16, d: 0.34, v: 0.055, tipo: "triangle" });
      melodia.push({ f: f / 2, t: i * 0.16, d: 0.3, v: 0.03, tipo: "sine" });
    });
    // acorde final sostenido
    [1046.5, 1318.51, 1567.98].forEach((f, i) =>
      melodia.push({
        f,
        t: 0.68 + i * 0.03,
        d: 1.1,
        v: 0.045,
        tipo: "triangle",
      }),
    );
    tocar(melodia);
  },
  /** estallido de fuego artificial */
  cohete: (retardo = 0) =>
    conAudio((a) => {
      const t0 = a.currentTime + retardo;
      const src = a.createBufferSource();
      src.buffer = ruidoMarron(a, 0.5);
      const filtro = a.createBiquadFilter();
      filtro.type = "lowpass";
      filtro.frequency.setValueAtTime(4200, t0);
      filtro.frequency.exponentialRampToValueAtTime(500, t0 + 0.45);
      const gain = a.createGain();
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(0.09, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
      src.connect(filtro).connect(gain).connect(a.destination);
      src.start(t0);
      src.stop(t0 + 0.52);
    }),
};

/* La descarga se lanza aquí, al final: si se hace arriba, `descargas` todavía
   no existe y el módulo entero revienta con un error de inicialización. */
descargar(SONIDO_PAGINA);
