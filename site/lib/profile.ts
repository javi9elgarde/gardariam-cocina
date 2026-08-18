"use client";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
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

export interface Profile {
  name: string;
  junimo: Junimo;
}

export function junimoSrc(j: string): string {
  return `/cocina/junimos/${JUNIMOS.includes(j as Junimo) ? j : "verde"}.png`;
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
    await setDoc(doc(db, "profiles", user.uid), {
      name: p.name.trim().slice(0, 24),
      junimo: p.junimo,
      uid: user.uid,
    });
  }

  return { profile, loaded, save };
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
