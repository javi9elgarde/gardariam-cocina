"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { User } from "firebase/auth";
import { db, storage } from "./firebase";

export interface Comment {
  id: string;
  recipeId: string;
  uid: string;
  name: string;
  junimo?: string;
  text: string;
  createdAt?: { seconds: number } | null;
}

/* ---------------- Comentarios ---------------- */

export function watchComments(
  recipeId: string,
  cb: (list: Comment[]) => void,
): Unsubscribe {
  const q = query(collection(db, "comments"), where("recipeId", "==", recipeId));
  return onSnapshot(
    q,
    (snap) => {
      const list: Comment[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Comment, "id">) }));
      list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      cb(list);
    },
    () => cb([]),
  );
}

export async function addComment(
  recipeId: string,
  user: User,
  text: string,
  perfil?: { name: string; junimo: string },
) {
  const clean = text.trim().slice(0, 500);
  if (!clean) return;
  await addDoc(collection(db, "comments"), {
    recipeId,
    uid: user.uid,
    name: perfil?.name ?? user.displayName ?? "Invitado",
    junimo: perfil?.junimo ?? "verde",
    text: clean,
    createdAt: serverTimestamp(),
  });
}

export async function deleteComment(id: string) {
  await deleteDoc(doc(db, "comments", id));
}

/* ---------------- Fotos de invitados (1 por receta y persona) ---------------- */

export interface GuestPhoto {
  id: string; // recetaId__uid
  recipeId: string;
  uid: string;
  name: string;
  junimo?: string;
  url: string;
}

export function watchPhotos(recipeId: string, cb: (list: GuestPhoto[]) => void): Unsubscribe {
  const q = query(collection(db, "photos"), where("recipeId", "==", recipeId));
  return onSnapshot(
    q,
    (snap) => {
      const list: GuestPhoto[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<GuestPhoto, "id">) }));
      cb(list);
    },
    () => cb([]),
  );
}

/** Encoge la foto antes de subirla (ahorra espacio y va más rápido) */
async function shrink(file: File, max = 1200): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
  return new Promise((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.85));
}

export async function uploadPhoto(
  recipeId: string,
  user: User,
  file: File,
  perfil?: { name: string; junimo: string },
) {
  const blob = await shrink(file);
  const storageRef = ref(storage, `fotos/${recipeId}/${user.uid}`);
  await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
  const url = await getDownloadURL(storageRef);
  await setDoc(doc(db, "photos", `${recipeId}__${user.uid}`), {
    recipeId,
    uid: user.uid,
    name: perfil?.name ?? user.displayName ?? "Invitado",
    junimo: perfil?.junimo ?? "verde",
    url,
  });
  return url;
}

export async function deletePhoto(p: GuestPhoto) {
  await deleteDoc(doc(db, "photos", p.id));
  try {
    await deleteObject(ref(storage, `fotos/${p.recipeId}/${p.uid}`));
  } catch {
    /* puede que ya no exista */
  }
}

/* ---------------- Pruebas de que una receta se ha cocinado ---------------- */

export interface Prueba {
  comentario: boolean;
  foto: boolean;
}

/**
 * Escucha qué recetas tiene el usuario con comentario y con foto propios.
 * Es lo que da derecho a sellar un reto: sin foto y comentario, no cuenta.
 */
export function watchMyProof(
  uid: string,
  cb: (m: Record<string, Prueba>) => void,
): Unsubscribe {
  const comentarios = new Set<string>();
  const fotos = new Set<string>();

  const emitir = () => {
    const m: Record<string, Prueba> = {};
    for (const id of comentarios) m[id] = { comentario: true, foto: fotos.has(id) };
    for (const id of fotos) m[id] = { comentario: comentarios.has(id), foto: true };
    cb(m);
  };

  const unC = onSnapshot(
    query(collection(db, "comments"), where("uid", "==", uid)),
    (snap) => {
      comentarios.clear();
      snap.forEach((d) => comentarios.add((d.data() as Comment).recipeId));
      emitir();
    },
    () => emitir(),
  );

  const unF = onSnapshot(
    query(collection(db, "photos"), where("uid", "==", uid)),
    (snap) => {
      fotos.clear();
      snap.forEach((d) => fotos.add((d.data() as GuestPhoto).recipeId));
      emitir();
    },
    () => emitir(),
  );

  return () => {
    unC();
    unF();
  };
}
