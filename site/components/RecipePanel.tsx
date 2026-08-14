"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ListBuilder from "@/components/ListBuilder";
import { BOOK_PAGES } from "@/lib/book";
import { addRecipe, deleteRecipe, updateRecipe } from "@/lib/storage";
import { CATEGORIES, EMPTY_RECIPE, type Recipe } from "@/lib/types";

interface RecipePanelProps {
  recipe: Recipe | null;
  isAdmin: boolean;
  onClose: () => void;
}

export default function RecipePanel({ recipe, isAdmin, onClose }: RecipePanelProps) {
  const [draft, setDraft] = useState<Omit<Recipe, "id">>(
    recipe
      ? {
          title: recipe.title,
          photoUrl: recipe.photoUrl,
          iconUrl: recipe.iconUrl ?? "",
          pages: recipe.pages ?? [],
          bookPage: recipe.bookPage,
          category: recipe.category,
          rating: recipe.rating,
          prepMinutes: recipe.prepMinutes,
          persons: recipe.persons ?? 2,
          favorite: recipe.favorite ?? false,
          description: recipe.description ?? "",
          ingredients2: recipe.ingredients2 ?? [],
          steps2: recipe.steps2 ?? [],
        }
      : EMPTY_RECIPE,
  );

  const inBook = draft.bookPage !== undefined;

  function set<K extends keyof Omit<Recipe, "id">>(k: K, v: Omit<Recipe, "id">[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function save() {
    if (recipe) updateRecipe(recipe.id, draft);
    else addRecipe(draft);
    onClose();
  }

  function remove() {
    if (recipe) deleteRecipe(recipe.id);
    onClose();
  }

  if (!isAdmin) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="recipe-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="recipe-book"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="recipe-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className="recipe-form">
          <h3 className="book-section-title" style={{ fontSize: "1.3rem" }}>
            {recipe ? "✎ Editar receta" : "＋ Nueva receta"}
          </h3>

          {/* ---- Identidad ---- */}
          <label className="book-label">Nombre que aparece</label>
          <input
            className="book-input"
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ej: Pan Ceporros"
          />

          <label className="book-label">Categoría (filtro donde sale)</label>
          <select
            className="book-input"
            value={draft.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">— Sin categoría —</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.id}
              </option>
            ))}
          </select>

          {/* ---- Icono 1:1 ---- */}
          <label className="book-label">Icono cuadrado (1:1) de la cuadrícula</label>
          <div className="icon-row">
            <div className="icon-prev">
              {draft.iconUrl || draft.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.iconUrl || draft.photoUrl} alt="" />
              ) : (
                <span>🍲</span>
              )}
            </div>
            <input
              className="book-input"
              value={draft.iconUrl ?? ""}
              onChange={(e) => set("iconUrl", e.target.value)}
              placeholder="/cocina/iconos/mi-receta.png"
            />
          </div>

          {/* ---- Datos ---- */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="book-label">Minutos</label>
              <input
                className="book-input"
                type="number"
                min={0}
                value={draft.prepMinutes}
                onChange={(e) => set("prepMinutes", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="book-label">Personas</label>
              <input
                className="book-input"
                type="number"
                min={1}
                value={draft.persons}
                onChange={(e) => set("persons", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="book-label">Valoración</label>
              <div className="star-pick">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set("rating", n)}
                    style={{ color: n <= draft.rating ? "var(--oliva)" : "#c9b98f" }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ---- ¿Del libro o nueva? ---- */}
          <div className="book-toggle">
            <label>
              <input
                type="checkbox"
                checked={inBook}
                onChange={(e) => set("bookPage", e.target.checked ? 0 : undefined)}
              />{" "}
              📖 Esta receta está en el libro físico
            </label>
            {inBook && (
              <div className="mt-2">
                <label className="book-label">Página del libro (0–{BOOK_PAGES - 1})</label>
                <input
                  className="book-input"
                  type="number"
                  min={0}
                  max={BOOK_PAGES - 1}
                  value={draft.bookPage ?? 0}
                  onChange={(e) => set("bookPage", Number(e.target.value))}
                />
              </div>
            )}
          </div>

          {/* ---- Receta nueva (sin libro) ---- */}
          {!inBook && (
            <>
              <label className="book-label">Descripción / historia</label>
              <textarea
                className="book-input"
                rows={3}
                value={draft.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Una receta que nos encanta porque..."
              />
              <label className="book-label">Foto grande (URL)</label>
              <input
                className="book-input"
                value={draft.photoUrl}
                onChange={(e) => set("photoUrl", e.target.value)}
                placeholder="https://..."
              />
              <ListBuilder
                label="Ingredientes"
                items={draft.ingredients2 ?? []}
                onChange={(v) => set("ingredients2", v)}
                placeholder="Ej: 350 g de carne picada"
              />
              <ListBuilder
                label="Pasos"
                items={draft.steps2 ?? []}
                onChange={(v) => set("steps2", v)}
                numbered
                placeholder="Siguiente paso..."
              />
            </>
          )}

          <div className="mt-3 flex gap-2">
            <button className="book-btn flex-1" onClick={save}>
              Guardar
            </button>
            {recipe && (
              <button
                className="book-btn book-btn-ghost"
                style={{ borderColor: "var(--granate)", color: "var(--granate)" }}
                onClick={remove}
              >
                Eliminar
              </button>
            )}
            <button className="book-btn book-btn-ghost" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
