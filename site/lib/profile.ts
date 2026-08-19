"use client";

import type { User } from "firebase/auth";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "./firebase";
import { useAuth } from "./auth";

export const JUNIMOS = [
  "verde",
  "turquesa",
  "azul",
  "morado",
  "rosa",
  "rojo",
  "naranja",
  "amarillo",
] as const;

export type Junimo = (typeof JUNIMOS)[number];

/* ---------------- Junimos de recompensa ---------------- */

/** Junimos que no se eligen: hay que ganárselos */
export const LOGROS = {
  bronce: {
    nombre: "Junimo de bronce",
    pista: "Sella 5 recetas del libro",
  },
  plata: {
    nombre: "Junimo de plata",
    pista: "Sella 10 recetas del libro",
  },
  dorado: {
    nombre: "Junimo dorado",
    pista: "Sella todas las recetas del libro",
  },
  boda: {
    nombre: "Junimo de boda",
    pista: "Solo para quien se registre entre el 29 de agosto y el 1 de septiembre de 2026",
  },
} as const;

export type Logro = keyof typeof LOGROS;
export const ORDEN_LOGROS: Logro[] = ["bronce", "plata", "dorado", "boda"];

/** Compatibilidad: antes solo existía el dorado */
export const JUNIMO_DORADO: Logro = "dorado";

/** ¿este junimo hay que desbloquearlo? */
export function esBloqueado(j: string): boolean {
  return j in LOGROS;
}

/* Ventana de la boda (hora de España, UTC+2 en verano) */
const BODA_DESDE = Date.parse("2026-08-29T00:00:00+02:00");
const BODA_HASTA = Date.parse("2026-09-01T23:59:59+02:00");

/**
 * Mery y Javi salen en la clasificación solo mientras se prueba. El día que
 * empieza la boda y entra la gente de verdad, desaparecen de la tabla.
 */
export function ocultarAdminsEnClasificacion(): boolean {
  return Date.now() >= BODA_DESDE;
}

/**
 * El junimo de boda se deduce de la fecha en que se creó la cuenta de Google,
 * que la pone Firebase y el usuario no puede tocar. Por eso no hace falta
 * guardarlo: no se puede hacer trampa con él.
 */
export function esInvitadoDeBoda(user: User | null): boolean {
  const t = user?.metadata?.creationTime;
  if (!t) return false;
  const ms = Date.parse(t);
  return !Number.isNaN(ms) && ms >= BODA_DESDE && ms <= BODA_HASTA;
}

/** Logros que un usuario ya tiene ganados */
export function logrosDe(profile: Profile | null, user: User | null): Set<Logro> {
  const s = new Set<Logro>((profile?.logros ?? []).filter((l): l is Logro => l in LOGROS));
  if (profile?.dorado) s.add("dorado"); // perfiles guardados antes de haber varios logros
  if (esInvitadoDeBoda(user)) s.add("boda");
  return s;
}

/** Logros que corresponden por número de recetas selladas */
export function logrosPorRetos(hechas: number, total: number): Logro[] {
  const out: Logro[] = [];
  if (hechas >= 5) out.push("bronce");
  if (hechas >= 10) out.push("plata");
  if (total > 0 && hechas >= total) out.push("dorado");
  return out;
}

export interface Profile {
  name: string;
  junimo: string;
  /** Mery y Javi: se marca solo, para poder sacarlos de la clasificación */
  admin?: boolean;
  /** junimos de recompensa ya ganados */
  logros?: string[];
  /** antiguo: true cuando había sellado todas las recetas */
  dorado?: boolean;
}

/** Se sube al cambiar los dibujos, para que nadie se quede con la versión antigua en caché */
const JUNIMO_VER = "4";

export function junimoSrc(j: string): string {
  const color = esBloqueado(j) || JUNIMOS.includes(j as Junimo) ? j : "verde";
  return `/cocina/junimos/${color}.png?v=${JUNIMO_VER}`;
}

/* ---------------- Perfil del usuario ---------------- */

export function useProfile() {
  const { user, isAdmin } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoaded(true);
      return;
    }
    setLoaded(false);
    return onSnapshot(
      doc(db, "profiles", user.uid),
      (d) => {
        setProfile(d.exists() ? (d.data() as Profile) : null);
        setLoaded(true);
      },
      () => setLoaded(true),
    );
  }, [user]);

  /* Deja constancia en el perfil de quién es admin, sin tener que tocar nada */
  const marcado = useRef(false);
  useEffect(() => {
    if (!user || !isAdmin || !profile || profile.admin || marcado.current) return;
    marcado.current = true;
    void setDoc(doc(db, "profiles", user.uid), { admin: true }, { merge: true }).catch(() => {
      marcado.current = false;
    });
  }, [user, isAdmin, profile]);

  async function save(p: Profile) {
    if (!user) return;
    const name = p.name.trim().slice(0, 24);
    const ganados = logrosDe({ ...(profile ?? { name: "", junimo: "verde" }), ...p }, user);
    // un junimo de recompensa solo se puede llevar si está desbloqueado
    const junimo = esBloqueado(p.junimo) && !ganados.has(p.junimo as Logro) ? "verde" : p.junimo;
    await setDoc(
      doc(db, "profiles", user.uid),
      {
        name,
        junimo,
        uid: user.uid,
      },
      { merge: true },
    );
    // el nombre y el junimo nuevos se aplican también a lo ya publicado
    await renameEverywhere(user.uid, name, junimo);
  }

  return { profile, loaded, save };
}

/** Cambia el nombre/junimo en los comentarios y fotos ya publicados */
async function renameEverywhere(uid: string, name: string, junimo: string) {
  for (const col of ["comments", "photos", "stamps"]) {
    try {
      const snap = await getDocs(query(collection(db, col), where("uid", "==", uid)));
      await Promise.all(
        snap.docs.map((d) => updateDoc(doc(db, col, d.id), { name, junimo })),
      );
    } catch {
      /* si las reglas no lo permiten, el perfil ya se guardó igualmente */
    }
  }
}

/* ---------------- Retos: sellar recetas hechas ---------------- */

export interface Stamp {
  id: string; // uid__recetaId
  uid: string;
  recipeId: string;
  /** se guardan aquí para poder montar la clasificación leyendo solo los sellos */
  name?: string;
  junimo?: string;
}

/** Todos los sellos de todo el mundo (para la clasificación) */
export function watchAllStamps(cb: (list: Stamp[]) => void): Unsubscribe {
  return onSnapshot(
    collection(db, "stamps"),
    (snap) => {
      const list: Stamp[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Stamp, "id">) }));
      cb(list);
    },
    () => cb([]),
  );
}

export function watchMyStamps(uid: string, cb: (ids: string[]) => void): Unsubscribe {
  return onSnapshot(
    collection(db, "stamps"),
    (snap) => {
      const mine: string[] = [];
      snap.forEach((d) => {
        const s = d.data() as Stamp;
        if (s.uid === uid) mine.push(s.recipeId);
      });
      cb(mine);
    },
    () => cb([]),
  );
}

export async function toggleStamp(
  uid: string,
  recipeId: string,
  on: boolean,
  perfil?: { name: string; junimo: string },
) {
  const id = `${uid}__${recipeId}`;
  if (on) {
    await setDoc(doc(db, "stamps", id), {
      uid,
      recipeId,
      name: perfil?.name ?? "Cocinero",
      junimo: perfil?.junimo ?? "verde",
    });
  } else {
    await deleteDoc(doc(db, "stamps", id));
  }
}

/** Guarda los logros ganados para que no se pierdan si luego quita un sello */
export async function desbloquearLogros(uid: string, ids: Logro[]) {
  if (ids.length === 0) return;
  await setDoc(
    doc(db, "profiles", uid),
    {
      logros: arrayUnion(...ids),
      ...(ids.includes("dorado") ? { dorado: true } : {}),
    },
    { merge: true },
  );
}

/**
 * Solo para los admin: borra los sellos y los logros de un usuario, para poder
 * probar de cero el sistema de retos y de junimos.
 */
export async function reiniciarRetos(uid: string) {
  const snap = await getDocs(query(collection(db, "stamps"), where("uid", "==", uid)));
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "stamps", d.id))));
  await setDoc(doc(db, "profiles", uid), { logros: [], dorado: false }, { merge: true });
}

/**
 * Todos los perfiles, para poner nombres al día en la clasificación.
 * Si las reglas no dejan listarlos, devuelve vacío y se usan los nombres
 * guardados dentro de cada sello.
 */
export function watchAllProfiles(
  cb: (m: Record<string, Profile>) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, "profiles"),
    (snap) => {
      const m: Record<string, Profile> = {};
      snap.forEach((d) => (m[d.id] = d.data() as Profile));
      cb(m);
    },
    () => cb({}),
  );
}
