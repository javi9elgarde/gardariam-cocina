"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

export interface Comment {
  id: string;
  recipeId: string;
  uid: string;
  name: string;
  photo: string;
  text: string;
  createdAt?: { seconds: number } | null;
}

export interface GuestPhoto {
  id: string; // recetaId__uid
  recipeId: string;
  uid: string;
  name: string;
  url: string;
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

export async function addComment(recipeId: string, user: User, text: string) {
  const clean = text.trim().slice(0, 500);
  if (!clean) return;
  await addDoc(collection(db, "comments"), {
    recipeId,
    uid: user.uid,
    name: user.displayName ?? "Invitado",
    photo: user.photoURL ?? "",
    text: clean,
    createdAt: serverTimestamp(),
  });
}

export async function deleteComment(id: string) {
  await deleteDoc(doc(db, "comments", id));
}
