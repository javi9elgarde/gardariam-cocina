"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import FieldRows from "@/components/FieldRows";
import { BOOK_PAGES } from "@/lib/book";
import { contenidoDe } from "@/lib/recipe-content";
import type { Ingredient, Step } from "@/lib/recipes-data";
import { addRecipe, deleteRecipe, updateRecipe } from "@/lib/storage";
import { CATEGORIES, EMPTY_RECIPE, type Recipe } from "@/lib/types";

interface RecipePanelProps {
  recipe: Recipe | null;
  isAdmin: boolean;
  onClose: () => void;
}

const DIFICULTADES = ["Fácil", "Media", "Alta"] as const;

export default function RecipePanel({ recipe, isAdmin, onClose }: RecipePanelProps) {
  // el contenido se precarga ya resuelto: el admin ve lo que hay ahora y lo edita
  const inicial = recipe ? contenidoDe(recipe) : null;

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
          sortIndex: recipe.sortIndex,
          description: recipe.description ?? "",
          ingredients2: recipe.ingredients2 ?? [],
          steps2: recipe.steps2 ?? [],
          contenido: {
            story: inicial?.story ?? "",
            note: inicial?.note ?? "",
            difficulty: inicial?.difficulty,
            tip: inicial?.tip ?? "",
            ingredients: inicial?.ingredients ?? [],
            steps: inicial?.steps ?? [],
          },
        }
      : {
          ...EMPTY_RECIPE,
          contenido: { story: "", note: "", tip: "", ingredients: [], steps: [] },
        },
  );

  const inBook = draft.bookPage !== undefined;

  function set<K extends keyof Omit<Recipe, "id">>(k: K, v: Omit<Recipe, "id">[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function setCont<K extends keyof NonNullable<Recipe["contenido"]>>(
    k: K,
    v: NonNullable<Recipe["contenido"]>[K],
  ) {
    setDraft((d) => ({ ...d, contenido: { ...d.contenido, [k]: v } }));
  }

  function save() {
    const c = draft.contenido ?? {};
    const limpio: Omit<Recipe, "id"> = {
      ...draft,
      pages: (draft.pages ?? []).map((u) => u.trim()).filter(Boolean),
      contenido: {
        ...c,
        ingredients: (c.ingredients ?? []).filter((i) => i.name?.trim()),
        steps: (c.steps ?? []).filter((st) => st.text?.trim()),
      },
    };
    if (recipe) updateRecipe(recipe.id, limpio);
    else addRecipe(limpio);
    onClose();
  }

  function remove() {
    if (recipe) deleteRecipe(recipe.id);
    onClose();
  }

  if (!isAdmin) return null;

  const cont = draft.contenido ?? {};

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

          {/* ---------- Identidad ---------- */}
          <p className="form-group">Ficha</p>

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
              placeholder="/cocina/iconos/mi-receta.jpg"
            />
          </div>

          <label className="book-label">Foto grande (se usa si no hay icono)</label>
          <input
            className="book-input"
            value={draft.photoUrl}
            onChange={(e) => set("photoUrl", e.target.value)}
            placeholder="/cocina/paginas/mi-receta-card.jpg"
          />

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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="book-label">Dificultad</label>
              <select
                className="book-input"
                value={cont.difficulty ?? ""}
                onChange={(e) =>
                  setCont(
                    "difficulty",
                    (e.target.value || undefined) as (typeof DIFICULTADES)[number] | undefined,
                  )
                }
              >
                <option value="">— Sin indicar —</option>
                {DIFICULTADES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="book-label">Posición en la cuadrícula</label>
              <input
                className="book-input"
                type="number"
                value={draft.sortIndex ?? ""}
                placeholder="(se ordena arrastrando)"
                onChange={(e) =>
                  set("sortIndex", e.target.value === "" ? undefined : Number(e.target.value))
                }
              />
            </div>
          </div>

          <label className="book-toggle-line">
            <input
              type="checkbox"
              checked={draft.favorite}
              onChange={(e) => set("favorite", e.target.checked)}
            />{" "}
            ⭐ Marcada como favorita
          </label>

          {/* ---------- Libro ---------- */}
          <p className="form-group">Libro</p>

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

          <FieldRows<{ url: string }>
            label="Páginas ilustradas de la receta"
            ayuda="Imágenes que se ven al abrir la receta. Ej: /cocina/paginas/paella-0.jpg"
            items={(draft.pages ?? []).map((url) => ({ url }))}
            columnas={[{ clave: "url", etiqueta: "/cocina/paginas/…" }]}
            nuevo={() => ({ url: "" })}
            numerado
            onChange={(v) => set("pages", v.map((p) => p.url))}
          />

          {/* ---------- Contenido ---------- */}
          <p className="form-group">Contenido de la receta</p>

          <label className="book-label">Historia / introducción</label>
          <textarea
            className="book-input"
            rows={4}
            value={cont.story ?? ""}
            onChange={(e) => setCont("story", e.target.value)}
            placeholder="Una receta que nos encanta porque..."
          />

          <FieldRows<Ingredient>
            label="Ingredientes"
            ayuda="Cantidad + nombre + una nota opcional entre paréntesis."
            items={cont.ingredients ?? []}
            columnas={[
              { clave: "qty", etiqueta: "500 g", peso: 1 },
              { clave: "name", etiqueta: "Harina de fuerza", peso: 3 },
              { clave: "note", etiqueta: "nota (opcional)", peso: 2 },
            ]}
            nuevo={() => ({ name: "" })}
            onChange={(v) => setCont("ingredients", v)}
          />

          <FieldRows<Step>
            label="Pasos de la elaboración"
            ayuda="El título es opcional; si lo dejas vacío solo se ve el texto."
            items={cont.steps ?? []}
            columnas={[
              { clave: "title", etiqueta: "Título del paso", peso: 1 },
              { clave: "text", etiqueta: "Qué hay que hacer…", peso: 3, multilinea: true },
            ]}
            nuevo={() => ({ text: "" })}
            numerado
            onChange={(v) => setCont("steps", v)}
          />

          <label className="book-label">Consejo del granjero</label>
          <textarea
            className="book-input"
            rows={2}
            value={cont.tip ?? ""}
            onChange={(e) => setCont("tip", e.target.value)}
            placeholder="El truco que no puede faltar..."
          />

          <label className="book-label">Nota al margen</label>
          <textarea
            className="book-input"
            rows={2}
            value={cont.note ?? ""}
            onChange={(e) => setCont("note", e.target.value)}
            placeholder="Apunte a mano en el margen de la página"
          />

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
