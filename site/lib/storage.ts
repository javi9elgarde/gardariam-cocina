import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Recipe } from "./types";

const isBrowser = typeof window !== "undefined";

let recipesCache: Record<string, Recipe> = {};
let listeners: Array<() => void> = [];

export function onStorageChange(cb: () => void): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function notify(): void {
  listeners.forEach((l) => l());
}

let initialized = false;

function initFirestoreSync(): void {
  if (initialized || !isBrowser) return;
  initialized = true;

  onSnapshot(collection(db, "recipes"), (snap) => {
    const next: Record<string, Recipe> = {};
    snap.forEach((d) => {
      next[d.id] = { id: d.id, ...(d.data() as Omit<Recipe, "id">) };
    });
    recipesCache = next;
    notify();
  });
}

initFirestoreSync();

export function getRecipes(): Recipe[] {
  return Object.values(recipesCache).sort((a, b) => a.title.localeCompare(b.title));
}

export function getRecipe(id: string): Recipe | undefined {
  return recipesCache[id];
}

export function addRecipe(recipe: Omit<Recipe, "id">): string {
  const id = doc(collection(db, "recipes")).id;
  recipesCache = { ...recipesCache, [id]: { id, ...recipe } };
  notify();
  void setDoc(doc(db, "recipes", id), recipe);
  return id;
}

export function updateRecipe(id: string, patch: Partial<Omit<Recipe, "id">>): void {
  const current = recipesCache[id];
  if (!current) return;
  recipesCache = { ...recipesCache, [id]: { ...current, ...patch } };
  notify();
  void setDoc(doc(db, "recipes", id), patch, { merge: true });
}

export function deleteRecipe(id: string): void {
  const next = { ...recipesCache };
  delete next[id];
  recipesCache = next;
  notify();
  void deleteDoc(doc(db, "recipes", id));
}
