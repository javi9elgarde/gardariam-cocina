"use client";

import { motion } from "framer-motion";
import { getRecipeData } from "@/lib/recipes-data";
import { useProgress } from "@/lib/useProgress";
import type { Recipe } from "@/lib/types";

interface OpenBookProps {
  recipes: Recipe[]; // lista filtrada (página izquierda)
  selected: Recipe | null; // receta abierta
  onSelect: (r: Recipe) => void;
  onToggleFav: (r: Recipe) => void;
  onSeeAll: () => void;
  onOpenOriginal: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function OpenBook({
  recipes,
  selected,
  onSelect,
  onToggleFav,
  onSeeAll,
  onOpenOriginal,
}: OpenBookProps) {
  const data = selected ? getRecipeData(selected.id) : undefined;
  const { done, toggle } = useProgress(selected?.id ?? null);

  return (
    <div className="ob">
      {/* ---------- Página izquierda: índice de recetas ---------- */}
      <section className="ob-page ob-left">
        <h3 className="ob-h">❧ Nuestras recetas ❧</h3>
        <ul className="ob-list">
          {recipes.map((r) => (
            <li key={r.id}>
              <button
                className={`ob-item ${selected?.id === r.id ? "is-active" : ""}`}
                onClick={() => onSelect(r)}
              >
                {r.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="ob-item-thumb" src={r.photoUrl} alt="" />
                ) : (
                  <span className="ob-item-thumb ob-item-thumb--empty" />
                )}
                <span className="ob-item-body">
                  <span className="ob-item-name">{r.title}</span>
                  <span className="ob-item-meta">
                    <span className="ob-stars">
                      {"★".repeat(Math.max(1, Math.min(5, r.rating || 5)))}
                    </span>
                    · {r.prepMinutes} min
                  </span>
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Favorita"
                  className={`ob-fav ${r.favorite ? "is-fav" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFav(r);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      onToggleFav(r);
                    }
                  }}
                >
                  {r.favorite ? "♥" : "♡"}
                </span>
              </button>
            </li>
          ))}
          {recipes.length === 0 && (
            <li className="ob-empty">No hay recetas que coincidan.</li>
          )}
        </ul>
        <button className="book-btn ob-seeall" onClick={onSeeAll}>
          📖 Ver todas las recetas
        </button>
      </section>

      {/* ---------- Página central: la receta ---------- */}
      <section className="ob-page ob-center">
        <div>
          <motion.div
            key={selected?.id ?? "none"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {!selected ? (
              <p className="ob-placeholder">Elige una receta del índice ❧</p>
            ) : (
              <>
                <h2 className="ob-title">{selected.title}</h2>
                {data?.story && <p className="ob-story">{data.story}</p>}

                {selected.photoUrl && (
                  <div className="ob-photo-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="ob-photo" src={selected.photoUrl} alt={selected.title} />
                  </div>
                )}

                {data?.note && <p className="ob-note">{data.note}</p>}

                <div className="ob-facts">
                  <span>
                    <b>{selected.prepMinutes} min</b>
                    <em>Tiempo</em>
                  </span>
                  <span>
                    <b>{selected.persons ?? 2} pers.</b>
                    <em>Raciones</em>
                  </span>
                  <span>
                    <b>{data?.difficulty ?? "—"}</b>
                    <em>Dificultad</em>
                  </span>
                </div>

                {data?.ingredients?.length ? (
                  <>
                    <h4 className="ob-sub">Ingredientes</h4>
                    <ul className="ob-ings">
                      {data.ingredients.map((ing, i) => (
                        <li key={i}>
                          {ing.qty && <b>{ing.qty}</b>} {ing.name}
                          {ing.note && <em> ({ing.note})</em>}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="ob-fallback">
                    <p>Esta receta está en las páginas originales del libro.</p>
                    <button className="book-btn book-btn-ghost" onClick={onOpenOriginal}>
                      Ver páginas del libro
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ---------- Página derecha: elaboración ---------- */}
      <section className="ob-page ob-right">
        <h3 className="ob-h">❧ Elaboración ❧</h3>
        <div>
          <motion.div
            key={selected?.id ?? "none-steps"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {data?.steps?.length ? (
              <>
                <ol className="ob-steps">
                  {data.steps.map((s, i) => {
                    const isDone = done.includes(i);
                    return (
                      <li key={i} className={`ob-step ${isDone ? "is-done" : ""}`}>
                        <span className="ob-step-n">{String(i + 1).padStart(2, "0")}</span>
                        <div className="ob-step-body">
                          <h5>{s.title}</h5>
                          <p>{s.text}</p>
                        </div>
                        <button
                          className="ob-check"
                          onClick={() => toggle(i)}
                          aria-label={isDone ? "Marcar como pendiente" : "Marcar como hecho"}
                        >
                          {isDone ? "✓" : ""}
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {data.tip && (
                  <aside className="ob-tip">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/cocina/mascota-chef.png" alt="" className="ob-tip-mascot" />
                    <div>
                      <h5>Consejo del granjero</h5>
                      <p>{data.tip}</p>
                    </div>
                  </aside>
                )}
              </>
            ) : (
              <p className="ob-placeholder">
                {selected
                  ? "Los pasos de esta receta están en las páginas originales del libro."
                  : "Aquí verás la elaboración paso a paso."}
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
