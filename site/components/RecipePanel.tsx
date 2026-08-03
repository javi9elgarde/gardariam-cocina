"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ListBuilder from "@/components/ListBuilder";
import { addRecipe, deleteRecipe, updateRecipe } from "@/lib/storage";
import { CATEGORIES, EMPTY_RECIPE, type Recipe } from "@/lib/types";

interface RecipePanelProps {
  recipe: Recipe | null;
  isAdmin: boolean;
  onClose: () => void;
}

export default function RecipePanel({ recipe, isAdmin, onClose }: RecipePanelProps) {
  const [mode, setMode] = useState<"view" | "edit">(recipe ? "view" : "edit");
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [fav, setFav] = useState(recipe?.favorite ?? false);
  const [draft, setDraft] = useState<Omit<Recipe, "id">>(
    recipe
      ? {
          title: recipe.title,
          photoUrl: recipe.photoUrl,
          pages: recipe.pages ?? [],
          category: recipe.category,
          rating: recipe.rating,
          prepMinutes: recipe.prepMinutes,
          persons: recipe.persons ?? 2,
          favorite: recipe.favorite ?? false,
        }
      : EMPTY_RECIPE,
  );

  const pages = recipe?.pages ?? [];

  function save() {
    if (recipe) updateRecipe(recipe.id, draft);
    else addRecipe(draft);
    onClose();
  }
  function remove() {
    if (recipe) deleteRecipe(recipe.id);
    onClose();
  }
  function toggleFav() {
    if (!recipe) return;
    const v = !fav;
    setFav(v);
    updateRecipe(recipe.id, { favorite: v });
  }
  function share() {
    const url = pages[page] || recipe?.photoUrl || "";
    if (navigator.share) navigator.share({ title: recipe?.title, url }).catch(() => {});
    else if (url) window.open(url, "_blank");
  }
  function print() {
    const url = pages[page];
    if (!url) return;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(
        `<img src="${url}" style="max-width:100%" onload="window.print()"/>`,
      );
      w.document.close();
    }
  }
  function go(d: number) {
    setDir(d);
    setPage((p) => Math.max(0, Math.min(pages.length - 1, p + d)));
  }

  const showForm = mode === "edit" && isAdmin;
  const inputCls = "book-input";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="recipe-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, rotateY: -12, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="recipe-book"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="recipe-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        {showForm ? (
          <div className="recipe-form">
            <h3 className="book-section-title" style={{ fontSize: "1.3rem" }}>
              {recipe ? "Editar receta" : "Nueva receta"}
            </h3>
            <label className="book-label">Título</label>
            <input
              className={inputCls}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <label className="book-label">Imagen de la tarjeta (URL)</label>
            <input
              className={inputCls}
              value={draft.photoUrl}
              placeholder="https://imagen.com/plato.jpg"
              onChange={(e) => setDraft({ ...draft, photoUrl: e.target.value })}
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="book-label">Categoría</label>
                <select
                  className={inputCls}
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                >
                  <option value="">—</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="book-label">Minutos</label>
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  value={draft.prepMinutes}
                  onChange={(e) => setDraft({ ...draft, prepMinutes: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="book-label">Personas</label>
                <input
                  className={inputCls}
                  type="number"
                  min={1}
                  value={draft.persons}
                  onChange={(e) => setDraft({ ...draft, persons: Number(e.target.value) })}
                />
              </div>
            </div>
            <label className="book-label">Valoración</label>
            <div className="mb-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDraft({ ...draft, rating: n })}
                  style={{
                    fontSize: "1.5rem",
                    lineHeight: 1,
                    color: n <= draft.rating ? "var(--oliva)" : "#c9b98f",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            <label className="book-label" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={draft.favorite}
                onChange={(e) => setDraft({ ...draft, favorite: e.target.checked })}
              />
              Marcar como favorita
            </label>
            <div className="mt-3">
              <ListBuilder
                label="Páginas del libro (URLs de imagen, en orden)"
                items={draft.pages}
                onChange={(pages) => setDraft({ ...draft, pages })}
                numbered
                placeholder="https://imagen.com/pagina1.jpg"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <button className="book-btn flex-1" onClick={save}>
                Guardar
              </button>
              <button
                className="book-btn book-btn-ghost"
                onClick={() => (recipe ? setMode("view") : onClose())}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="recipe-view">
            <div className="recipe-pages">
              <AnimatePresence mode="wait" custom={dir}>
                {pages.length > 0 ? (
                  <motion.img
                    key={page}
                    custom={dir}
                    initial={{ rotateY: dir > 0 ? 55 : -55, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: dir > 0 ? -55 : 55, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="recipe-page-img"
                    src={pages[page]}
                    alt={`${recipe?.title} página ${page + 1}`}
                  />
                ) : (
                  <div className="recipe-page-empty">
                    <div style={{ fontSize: "3rem" }}>📖</div>
                    <p className="book-section-sub">Esta receta aún no tiene páginas.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="recipe-side">
              <h2 className="book-section-title" style={{ fontSize: "1.4rem" }}>
                {recipe?.title}
              </h2>
              <div className="recipe-side-meta">
                {recipe?.category && <span>{recipe.category}</span>}
                <span>⏱ {recipe?.prepMinutes} min</span>
                <span>👤 {recipe?.persons ?? 2}</span>
              </div>
              <div className="rcard-stars" style={{ fontSize: "1rem" }}>
                {"★".repeat(Math.max(1, Math.min(5, recipe?.rating ?? 5)))}
              </div>

              <div className="recipe-actions">
                <button className="book-btn book-btn-ghost" onClick={toggleFav}>
                  {fav ? "❤️ Favorita" : "🤍 Favorita"}
                </button>
                <button className="book-btn book-btn-ghost" onClick={print}>
                  🖨 Imprimir
                </button>
                <button className="book-btn book-btn-ghost" onClick={share}>
                  📱 Compartir
                </button>
              </div>

              {isAdmin && (
                <div className="mt-3 flex gap-2">
                  <button className="book-btn book-btn-ghost" onClick={() => setMode("edit")}>
                    ✎ Editar
                  </button>
                  <button
                    className="book-btn book-btn-ghost"
                    style={{ borderColor: "var(--granate)", color: "var(--granate)" }}
                    onClick={remove}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            {pages.length > 1 && (
              <div className="recipe-nav">
                <button className="book-btn book-btn-ghost" disabled={page === 0} onClick={() => go(-1)}>
                  ← Anterior
                </button>
                <span className="recipe-pagenum">
                  {page + 1} / {pages.length}
                </span>
                <button
                  className="book-btn book-btn-ghost"
                  disabled={page === pages.length - 1}
                  onClick={() => go(1)}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
