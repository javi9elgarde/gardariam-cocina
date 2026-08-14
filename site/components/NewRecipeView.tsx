"use client";

import { motion } from "framer-motion";
import { useChecklist } from "@/lib/useChecklist";
import { useProgress } from "@/lib/useProgress";
import type { Recipe } from "@/lib/types";

interface Props {
  recipe: Recipe;
  isAdmin: boolean;
  onEdit: () => void;
  onClose: () => void;
}

/** Recetas que NO están en el libro: ficha propia, estilo nota de cocina. */
export default function NewRecipeView({ recipe, isAdmin, onEdit, onClose }: Props) {
  const ings = recipe.ingredients2 ?? [];
  const steps = recipe.steps2 ?? [];
  const { done, toggle, clear } = useChecklist("gardariam_cocina_ingredientes_v1", recipe.id);
  const { done: stepsDone, toggle: toggleStep } = useProgress(recipe.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="recipe-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="nr-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="recipe-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <span className="nr-badge">✎ Receta de casa</span>

        <header className="nr-head">
          {(recipe.iconUrl || recipe.photoUrl) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="nr-photo" src={recipe.photoUrl || recipe.iconUrl} alt={recipe.title} />
          )}
          <h2 className="nr-title">{recipe.title}</h2>
          <div className="ficha-stars" style={{ fontSize: "1.05rem" }}>
            {"★".repeat(Math.max(1, Math.min(5, recipe.rating || 5)))}
          </div>
          {recipe.description && <p className="nr-desc">{recipe.description}</p>}
          <div className="ob-facts">
            <span>
              <b>{recipe.prepMinutes} min</b>
              <em>Tiempo</em>
            </span>
            <span>
              <b>{recipe.persons ?? 2} pers.</b>
              <em>Raciones</em>
            </span>
            <span>
              <b>{recipe.category || "—"}</b>
              <em>Categoría</em>
            </span>
          </div>
        </header>

        <div className="nr-body">
          <section>
            <h4 className="ob-sub">Ingredientes</h4>
            {ings.length === 0 ? (
              <p className="ing-empty">Sin ingredientes añadidos.</p>
            ) : (
              <>
                <p className="ing-count">
                  {done.length} / {ings.length} marcados
                </p>
                <ul className="ing-list">
                  {ings.map((txt, i) => {
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
          </section>

          <section>
            <h4 className="ob-sub">Elaboración</h4>
            {steps.length === 0 ? (
              <p className="ing-empty">Sin pasos añadidos.</p>
            ) : (
              <ol className="ob-steps">
                {steps.map((s, i) => {
                  const d = stepsDone.includes(i);
                  return (
                    <li key={i} className={`ob-step ${d ? "is-done" : ""}`}>
                      <span className="ob-step-n">{String(i + 1).padStart(2, "0")}</span>
                      <div className="ob-step-body">
                        <p>{s}</p>
                      </div>
                      <button className="ob-check" onClick={() => toggleStep(i)}>
                        {d ? "✓" : ""}
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>

        {isAdmin && (
          <div className="nr-admin">
            <button className="book-btn book-btn-ghost" onClick={onEdit}>
              ✎ Editar receta
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
