import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { SEED_RECIPES } from "./seed";
import { Recipe } from "./types";

const seedMap: Record<string, Recipe> = Object.fromEntries(
  SEED_RECIPES.map((r) => [r.id, r]),
);

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

/**
 * Firestore rechaza los valores `undefined`. Al editar, un campo vacío llega
 * como undefined, así que se quita antes de guardar (y con `merge: true` el
 * valor anterior se conserva; para borrarlo de verdad se manda "" o []).
 */
function limpiar<T>(v: T): T {
  if (Array.isArray(v)) return v.map(limpiar) as unknown as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (val !== undefined) out[k] = limpiar(val);
    }
    return out as T;
  }
  return v;
}

export function getRecipes(): Recipe[] {
  // seed del libro + Firestore; se fusiona por campos (Firestore manda)
  const ids = new Set([...Object.keys(seedMap), ...Object.keys(recipesCache)]);
  const out: Recipe[] = [];
  ids.forEach((id) => {
    out.push({ ...seedMap[id], ...recipesCache[id] } as Recipe);
  });
  // orden del libro / manual del admin; si falta, por página del libro
  return out.sort((a, b) => {
    const ao = a.sortIndex ?? a.bookPage ?? Number.MAX_SAFE_INTEGER;
    const bo = b.sortIndex ?? b.bookPage ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return a.title.localeCompare(b.title);
  });
}

export function getRecipe(id: string): Recipe | undefined {
  if (!seedMap[id] && !recipesCache[id]) return undefined;
  return { ...seedMap[id], ...recipesCache[id] } as Recipe;
}

export function addRecipe(recipe: Omit<Recipe, "id">): string {
  const id = doc(collection(db, "recipes")).id;
  recipesCache = { ...recipesCache, [id]: { id, ...recipe } };
  notify();
  void setDoc(doc(db, "recipes", id), limpiar(recipe));
  return id;
}

export function updateRecipe(id: string, patch: Partial<Omit<Recipe, "id">>): void {
  const current = recipesCache[id] ?? seedMap[id];
  if (!current) return;
  recipesCache = { ...recipesCache, [id]: { ...current, ...patch, id } };
  notify();
  void setDoc(doc(db, "recipes", id), limpiar(patch), { merge: true });
}

export function deleteRecipe(id: string): void {
  const next = { ...recipesCache };
  delete next[id];
  recipesCache = next;
  notify();
  void deleteDoc(doc(db, "recipes", id));
}
