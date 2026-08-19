import type { RecipeData } from "./recipes-data";

export interface Recipe {
  id: string;
  title: string;
  photoUrl: string; // ilustración de la tarjeta
  iconUrl?: string; // icono cuadrado 1:1 para la cuadrícula
  pages: string[]; // páginas ilustradas del libro (imágenes)
  /** página del libro físico (si es del libro). undefined = receta nueva */
  bookPage?: number;
  category: string;
  rating: number;
  prepMinutes: number;
  persons: number;
  favorite: boolean;
  /** posición en la cuadrícula (admin la cambia arrastrando).
   *  Se usa `sortIndex` y no `order` porque en Firestore quedó guardado
   *  un `order` antiguo (alfabético) que pisaba el orden del libro. */
  sortIndex?: number;
  /** Contenido editable por el admin (historia, ingredientes, pasos, consejo…).
   *  Si falta, se usa el transcrito del libro en recipes-data.ts. */
  contenido?: RecipeData;
  /** recetas nuevas (fuera del libro) */
  description?: string;
  ingredients2?: string[];
  steps2?: string[];
  // Campos antiguos (compatibilidad; ya no se usan en la vista)
  ingredients?: string[];
  tools?: string[];
  steps?: string[];
}

export const EMPTY_RECIPE: Omit<Recipe, "id"> = {
  title: "",
  photoUrl: "",
  iconUrl: "",
  pages: [],
  category: "",
  rating: 5,
  prepMinutes: 30,
  persons: 2,
  favorite: false,
  description: "",
  ingredients2: [],
  steps2: [],
};

/** ¿la receta está en el libro físico? */
export function isBookRecipe(r: Recipe): boolean {
  return r.bookPage !== undefined || (r.pages?.length ?? 0) > 0;
}

export interface Category {
  id: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "Entrantes", emoji: "🥗" },
  { id: "Carnes", emoji: "🍗" },
  { id: "Pasta", emoji: "🍝" },
  { id: "Arroces", emoji: "🥘" },
  { id: "Pescados", emoji: "🐟" },
  { id: "Vegetarianas", emoji: "🥦" },
  { id: "Postres", emoji: "🍰" },
  { id: "Salsas y bases", emoji: "🥣" },
];
