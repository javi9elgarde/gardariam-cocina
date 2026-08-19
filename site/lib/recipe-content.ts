import { getRecipeData, type Ingredient, type RecipeData, type Step } from "./recipes-data";
import type { Recipe } from "./types";

/**
 * Contenido de una receta, ya resuelto.
 *
 * Prioridad: lo que el admin haya escrito en la web (recipe.contenido) manda
 * sobre lo transcrito del libro (recipes-data.ts), y eso a su vez manda sobre
 * los campos sueltos antiguos de las recetas nuevas.
 */
export interface Contenido extends RecipeData {
  ingredients: Ingredient[];
  steps: Step[];
}

const vacio = <T,>(v: T[] | undefined) => (v && v.length > 0 ? v : undefined);

export function contenidoDe(recipe: Recipe): Contenido {
  const libro = getRecipeData(recipe.id);
  const ov = recipe.contenido;

  return {
    story: ov?.story ?? libro?.story ?? recipe.description ?? "",
    note: ov?.note ?? libro?.note ?? "",
    difficulty: ov?.difficulty ?? libro?.difficulty,
    tip: ov?.tip ?? libro?.tip ?? "",
    ingredients:
      vacio(ov?.ingredients) ??
      vacio(libro?.ingredients) ??
      (recipe.ingredients2 ?? []).map((name) => ({ name })),
    steps:
      vacio(ov?.steps) ??
      vacio(libro?.steps) ??
      (recipe.steps2 ?? []).map((text) => ({ text })),
  };
}

/** Un ingrediente en una sola línea: "500 g Harina de fuerza (opcional)" */
export function lineaIngrediente(i: Ingredient): string {
  return [i.qty, i.name, i.note ? `(${i.note})` : ""].filter(Boolean).join(" ");
}
