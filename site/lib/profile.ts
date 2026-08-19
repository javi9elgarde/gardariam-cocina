"use client";

import {
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
import { useEffect, useState } from "react";
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

/** Recompensa: no se puede elegir, se desbloquea sellando todo el libro */
export const JUNIMO_DORADO = "dorado";

/** ¿este junimo hay que desbloquearlo? */
export function esBloqueado(j: string): boolean {
  return j === JUNIMO_DORADO;
}

export interface Profile {
  name: string;
  junimo: string;
  /** true cuando ha sellado todas las recetas del libro */
  dorado?: boolean;
}

/** Se sube al cambiar los dibujos, para que nadie se quede con la versión antigua en caché */
const JUNIMO_VER = "3";

export function junimoSrc(j: string): string {
  const color = j === JUNIMO_DORADO || JUNIMOS.includes(j as Junimo) ? j : "verde";
  return `/cocina/junimos/${color}.png?v=${JUNIMO_VER}`;
}

/* ---------------- Perfil del usuario ---------------- */

export function useProfile() {
  const { user } = useAuth();
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

  async function save(p: Profile) {
    if (!user) return;
    const name = p.name.trim().slice(0, 24);
    // el dorado solo se puede llevar si está desbloqueado
    const dorado = p.dorado ?? profile?.dorado ?? false;
    const junimo = p.junimo === JUNIMO_DORADO && !dorado ? "verde" : p.junimo;
    await setDoc(doc(db, "profiles", user.uid), {
      name,
      junimo,
      dorado,
      uid: user.uid,
    });
    // el nombre y el junimo nuevos se aplican también a lo ya publicado
    await renameEverywhere(user.uid, name, junimo);
  }

  return { profile, loaded, save };
}

/** Cambia el nombre/junimo en los comentarios y fotos ya publicados */
async function renameEverywhere(uid: string, name: string, junimo: string) {
  for (const col of ["comments", "photos"]) {
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

export async function toggleStamp(uid: string, recipeId: string, on: boolean) {
  const id = `${uid}__${recipeId}`;
  if (on) {
    await setDoc(doc(db, "stamps", id), { uid, recipeId });
  } else {
    await deleteDoc(doc(db, "stamps", id));
  }
}

/** Marca el logro en el perfil para que el dorado no se pierda */
export async function desbloquearDorado(uid: string) {
  await setDoc(doc(db, "profiles", uid), { dorado: true }, { merge: true });
}
