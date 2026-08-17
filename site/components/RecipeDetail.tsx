"use client";

import { motion } from "framer-motion";
import RecipeSocial from "@/components/RecipeSocial";
import { getRecipeData } from "@/lib/recipes-data";
import { useChecklist } from "@/lib/useChecklist";
import { useProgress } from "@/lib/useProgress";
import { isBookRecipe, type Recipe } from "@/lib/types";

interface Props {
  recipe: Recipe;
  isAdmin: boolean;
  onOpenBook: () => void;
  onEdit: () => void;
  onToggleFav: () => void;
  onClose: () => void;
}

/** Ficha completa: ingredientes marcables + pasos + datos, todo en un clic. */
export default function RecipeDetail({
  recipe,
  isAdmin,
  onOpenBook,
  onEdit,
  onToggleFav,
  onClose,
}: Props) {
  const data = getRecipeData(recipe.id);

  const ingredients: string[] =
    data?.ingredients?.map((i) =>
      [i.qty, i.name, i.note ? `(${i.note})` : ""].filter(Boolean).join(" "),
    ) ??
    recipe.ingredients2 ??
    [];

  const steps: { title?: string; text: string }[] =
    data?.steps?.map((s) => ({ title: s.title, text: s.text })) ??
    (recipe.steps2 ?? []).map((t) => ({ text: t }));

  const { done, toggle, clear } = useChecklist("gardariam_cocina_ingredientes_v1", recipe.id);
  const { done: stepsDone, toggle: toggleStep } = useProgress(recipe.id);

  const inBook = isBookRecipe(recipe);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="recipe-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className={`rd-card ${inBook ? "is-book" : "is-new"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="recipe-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <span className="rd-badge">{inBook ? "📖 Receta del libro" : "✎ Receta de casa"}</span>

        {/* ---------- Cabecera ---------- */}
        <header className="rd-head">
          {(recipe.iconUrl || recipe.photoUrl) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="rd-icon" src={recipe.iconUrl || recipe.photoUrl} alt="" />
          )}
          <div className="rd-head-txt">
            <h2 className="rd-title">{recipe.title}</h2>
            <div className="rd-stars">
              {"★".repeat(Math.max(1, Math.min(5, recipe.rating || 5)))}
            </div>
            {(data?.story || recipe.description) && (
              <p className="rd-story">{data?.story ?? recipe.description}</p>
            )}
          </div>
        </header>

        {/* ---------- Cuerpo: ingredientes | pasos | ficha ---------- */}
        <div className="rd-body">
          {/* Ingredientes marcables */}
          <section className="rd-col rd-ings">
            <h4 className="rd-h">🧺 Ingredientes</h4>
            {ingredients.length === 0 ? (
              <p className="ing-empty">Los tienes en la página del libro.</p>
            ) : (
              <>
                <p className="ing-count">
                  {done.length} / {ingredients.length} marcados
                </p>
                <ul className="ing-list">
                  {ingredients.map((txt, i) => {
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

          {/* Pasos */}
          <section className="rd-col rd-steps">
            <h4 className="rd-h">📜 Elaboración</h4>
            {steps.length === 0 ? (
              <p className="ing-empty">
                Los pasos están en las páginas del libro.
              </p>
            ) : (
              <ol className="ob-steps">
                {steps.map((s, i) => {
                  const d = stepsDone.includes(i);
                  return (
                    <li key={i} className={`ob-step ${d ? "is-done" : ""}`}>
                      <span className="ob-step-n">{String(i + 1).padStart(2, "0")}</span>
                      <div className="ob-step-body">
                        {s.title && <h5>{s.title}</h5>}
                        <p>{s.text}</p>
                      </div>
                      <button
                        className="ob-check"
                        onClick={() => toggleStep(i)}
                        aria-label={d ? "Marcar pendiente" : "Marcar hecho"}
                      >
                        {d ? "✓" : ""}
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
            {data?.tip && (
              <aside className="ob-tip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/cocina/mascota-chef.png" alt="" className="ob-tip-mascot" />
                <div>
                  <h5>Consejo del granjero</h5>
                  <p>{data.tip}</p>
                </div>
              </aside>
            )}
          </section>

          {/* Ficha */}
          <aside className="rd-col rd-ficha">
            <h4 className="rd-h">📋 Ficha</h4>
            <dl className="ficha-data">
              <div>
                <dt>Categoría</dt>
                <dd>{recipe.category || "—"}</dd>
              </div>
              <div>
                <dt>Tiempo</dt>
                <dd>⏱ {recipe.prepMinutes} min</dd>
              </div>
              <div>
                <dt>Raciones</dt>
                <dd>👤 {recipe.persons ?? 2}</dd>
              </div>
              <div>
                <dt>Dificultad</dt>
                <dd>{data?.difficulty ?? "—"}</dd>
              </div>
              {inBook && recipe.bookPage !== undefined && (
                <div>
                  <dt>En el libro</dt>
                  <dd>pág. {recipe.bookPage + 1}</dd>
                </div>
              )}
            </dl>

            {data?.note && <p className="ob-note mt-2">{data.note}</p>}

            <div className="rd-actions">
              <button className="book-btn book-btn-ghost" onClick={onToggleFav}>
                {recipe.favorite ? "❤️ Quitar de favoritas" : "🤍 Añadir a favoritas"}
              </button>
              {inBook && (
                <button className="book-btn" onClick={onOpenBook}>
                  📖 Verlo en el libro
                </button>
              )}
              {isAdmin && (
                <button className="book-btn book-btn-ghost" onClick={onEdit}>
                  ✎ Editar receta
                </button>
              )}
            </div>
          </aside>
        </div>

        <RecipeSocial recipeId={recipe.id} />
      </motion.div>
    </motion.div>
  );
}
