"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { addRecipe, deleteRecipe, updateRecipe } from "@/lib/storage";
import { EMPTY_RECIPE, type Recipe } from "@/lib/types";

interface RecipePanelProps {
  recipe: Recipe | null;
  isAdmin: boolean;
  onClose: () => void;
}

const inputCls =
  "w-full rounded border border-white/10 bg-imperial-charcoal-2 px-2.5 py-1.5 text-sm text-parchment outline-none focus:border-imperial-gold";
const labelCls =
  "font-display mb-1 block text-[0.56rem] uppercase tracking-[0.12em] text-parchment-faint";

export default function RecipePanel({ recipe, isAdmin, onClose }: RecipePanelProps) {
  const [mode, setMode] = useState<"view" | "edit">(recipe ? "view" : "edit");
  const [draft, setDraft] = useState<Omit<Recipe, "id">>(
    recipe
      ? {
          title: recipe.title,
          photoUrl: recipe.photoUrl,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          prepMinutes: recipe.prepMinutes,
          category: recipe.category,
          rating: recipe.rating,
        }
      : EMPTY_RECIPE,
  );

  function save() {
    if (recipe) {
      updateRecipe(recipe.id, draft);
    } else {
      addRecipe(draft);
    }
    onClose();
  }

  function remove() {
    if (recipe) deleteRecipe(recipe.id);
    onClose();
  }

  const showForm = mode === "edit" && isAdmin;

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel fixed inset-y-0 right-0 z-[800] flex w-full max-w-sm flex-col overflow-y-auto border-l border-imperial-gold/20"
    >
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-imperial-gold/25 bg-imperial-charcoal/70 text-parchment-faint backdrop-blur transition-colors hover:border-imperial-gold hover:text-imperial-gold-bright"
      >
        ✕
      </button>

      {showForm ? (
        <div className="p-5 pt-14">
          <label className={labelCls}>Título</label>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className={`${inputCls} mb-3`}
          />
          <label className={labelCls}>URL de foto</label>
          <input
            value={draft.photoUrl}
            onChange={(e) => setDraft({ ...draft, photoUrl: e.target.value })}
            placeholder="https://imagen.com/foto.jpg"
            className={`${inputCls} mb-3`}
          />
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Categoría</label>
              <input
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Minutos</label>
              <input
                type="number"
                min={0}
                value={draft.prepMinutes}
                onChange={(e) => setDraft({ ...draft, prepMinutes: Number(e.target.value) })}
                className={inputCls}
              />
            </div>
          </div>
          <label className={labelCls}>Valoración</label>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setDraft({ ...draft, rating: n })}
                className={`text-2xl leading-none transition-colors ${
                  n <= draft.rating ? "" : "opacity-30"
                }`}
              >
                🔥
              </button>
            ))}
          </div>
          <label className={labelCls}>Ingredientes (uno por línea)</label>
          <textarea
            value={draft.ingredients.join("\n")}
            onChange={(e) =>
              setDraft({ ...draft, ingredients: e.target.value.split("\n").filter(Boolean) })
            }
            rows={4}
            className={`${inputCls} mb-3 resize-none`}
          />
          <label className={labelCls}>Pasos (uno por línea)</label>
          <textarea
            value={draft.steps.join("\n")}
            onChange={(e) =>
              setDraft({ ...draft, steps: e.target.value.split("\n").filter(Boolean) })
            }
            rows={5}
            className={`${inputCls} mb-4 resize-none`}
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="font-display flex-1 rounded bg-imperial-gold/18 py-2 text-[0.6rem] uppercase tracking-[0.1em] text-imperial-gold-bright"
            >
              Guardar
            </button>
            <button
              onClick={() => (recipe ? setMode("view") : onClose())}
              className="font-display rounded border border-white/10 px-3 py-2 text-[0.6rem] uppercase tracking-[0.1em] text-parchment-faint"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : recipe ? (
        <>
          <div className="relative aspect-video w-full flex-shrink-0 overflow-hidden bg-imperial-charcoal-2">
            {recipe.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={recipe.photoUrl} alt={recipe.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl">🍲</div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-imperial-charcoal via-imperial-charcoal/10 to-transparent" />
            <h2 className="text-gold-glow font-display absolute bottom-3 left-4 right-16 text-lg font-bold text-parchment">
              {recipe.title}
            </h2>
          </div>

          <div className="flex flex-shrink-0 items-center justify-between px-5 pt-4">
            <span className="rounded border border-imperial-gold/20 bg-imperial-gold/10 px-2 py-1 text-[0.62rem] text-imperial-gold-text">
              {recipe.category || "Receta"}
            </span>
            <span className="text-[0.62rem] text-parchment-faint">
              ⏱ {recipe.prepMinutes} min
            </span>
            <span className="text-xs">{"🔥".repeat(Math.max(1, Math.min(5, recipe.rating)))}</span>
          </div>

          <div className="flex-1 px-5 py-5">
            <div className="mb-5">
              <div className="mb-2.5 border-b border-imperial-gold/20 pb-2">
                <span className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-parchment-faint">
                  🌿 Ingredientes
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-[0.82rem] text-parchment-dim">
                    • {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-5">
              <div className="mb-2.5 border-b border-imperial-gold/20 pb-2">
                <span className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-parchment-faint">
                  📜 Pasos
                </span>
              </div>
              <ol className="flex flex-col gap-2.5">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="text-[0.82rem] leading-relaxed text-parchment-dim">
                    <span className="font-display mr-1.5 text-imperial-gold-text">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {isAdmin && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setMode("edit")}
                  className="font-display flex-1 rounded border border-white/10 py-2 text-[0.6rem] uppercase tracking-[0.1em] text-parchment-faint transition-colors hover:border-imperial-gold/40 hover:text-imperial-gold-text"
                >
                  Editar
                </button>
                <button
                  onClick={remove}
                  className="font-display flex-1 rounded border border-white/10 py-2 text-[0.6rem] uppercase tracking-[0.1em] text-parchment-faint transition-colors hover:border-red-400/40 hover:text-red-300"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </>
      ) : null}
    </motion.aside>
  );
}
