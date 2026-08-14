"use client";

import { motion } from "framer-motion";
import { getRecipeData } from "@/lib/recipes-data";
import { useChecklist } from "@/lib/useChecklist";
import type { Recipe } from "@/lib/types";

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export default function IngredientsPanel({ recipe, onClose }: Props) {
  const data = getRecipeData(recipe.id);
  const { done, toggle, clear } = useChecklist("gardariam_cocina_ingredientes_v1", recipe.id);

  // ingredientes: del libro (recipes-data) o de la receta nueva
  const items: string[] =
    data?.ingredients?.map((i) =>
      [i.qty, i.name, i.note ? `(${i.note})` : ""].filter(Boolean).join(" "),
    ) ??
    recipe.ingredients2 ??
    [];

  return (
    <motion.aside
      className="ing-panel"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ing-head">
        <h3>🧺 Ingredientes</h3>
        <button className="ing-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>
      <p className="ing-sub">{recipe.title}</p>

      {items.length === 0 ? (
        <p className="ing-empty">
          Esta receta aún no tiene la lista escrita. Puedes verla en la página del libro.
        </p>
      ) : (
        <>
          <p className="ing-count">
            {done.length} / {items.length} marcados
          </p>
          <ul className="ing-list">
            {items.map((txt, i) => {
              const checked = done.includes(i);
              return (
                <li key={i}>
                  <label className={`ing-item ${checked ? "is-done" : ""}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggle(i)} />
                    <span className="ing-box" aria-hidden>
                      {checked ? "✓" : ""}
                    </span>
                    <span className="ing-txt">{txt}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <button className="book-btn book-btn-ghost ing-clear" onClick={clear}>
            ↺ Deseleccionar todo
          </button>
        </>
      )}
    </motion.aside>
  );
}
