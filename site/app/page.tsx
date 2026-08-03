"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import RecipePanel from "@/components/RecipePanel";
import { useAuth } from "@/lib/auth";
import { getRecipes, onStorageChange } from "@/lib/storage";
import { CATEGORIES, type Recipe } from "@/lib/types";

const FAV = "__fav__";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function Home() {
  const { isAdmin, user, loading, signIn, signOutUser } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Recipe | null | "new">(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  useEffect(() => {
    setRecipes(getRecipes());
    return onStorageChange(() => setRecipes(getRecipes()));
  }, []);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    return recipes.filter((r) => {
      if (cat === FAV && !r.favorite) return false;
      if (cat && cat !== FAV && r.category !== cat) return false;
      if (q && !norm(r.title).includes(q)) return false;
      return true;
    });
  }, [recipes, query, cat]);

  return (
    <div className="cocina-book">
      {/* Barra superior: volver al hub + login */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-4">
        <a href="https://gardariam.com" className="book-top-link">
          ← Hub
        </a>
        {!loading && (
          <button
            className="book-top-link"
            onClick={() => (user ? signOutUser() : signIn())}
            title={user ? user.email ?? "" : "Iniciar sesión"}
          >
            {user ? (isAdmin ? "⚜ Admin" : "Salir") : "Iniciar sesión"}
          </button>
        )}
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-6">
        {/* Cartel header */}
        <div className="flex justify-center pt-6">
          <div className="book-sign">
            <div className="book-sign-title">📖 Libro de Cocina</div>
            <div className="book-sign-names">
              Mariam <span style={{ color: "#e88" }}>&amp;</span> Javi
            </div>
            <div className="book-sign-sub">Recetas hechas con amor ♥</div>
          </div>
        </div>

        {/* Buscador */}
        <div className="mt-8">
          <label className="book-search">
            <span aria-hidden>🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar receta..."
            />
          </label>
        </div>

        {/* Categorías */}
        <div className="mt-6">
          <div className="cat-row">
            <button
              className={`cat-tab ${cat === null ? "active" : ""}`}
              onClick={() => setCat(null)}
            >
              <span className="cat-tab-emoji">🍽️</span>
              Todas
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`cat-tab ${cat === c.id ? "active" : ""}`}
                onClick={() => setCat(cat === c.id ? null : c.id)}
              >
                <span className="cat-tab-emoji">{c.emoji}</span>
                {c.id}
              </button>
            ))}
            <button
              className={`cat-tab ${cat === FAV ? "active" : ""}`}
              onClick={() => setCat(cat === FAV ? null : FAV)}
            >
              <span className="cat-tab-emoji">⭐</span>
              Favoritas
            </button>
          </div>
        </div>

        {/* Título sección */}
        <div className="mt-8 text-center">
          <div className="book-divider mx-auto mb-4 max-w-md" />
          <h2 className="book-section-title">Nuestras recetas</h2>
          <p className="book-section-sub mt-1">
            Cada receta cuenta una historia, cada bocado un recuerdo ♥
          </p>
        </div>

        {/* Rejilla */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <p className="py-12 text-center italic text-ink-faint">
              {recipes.length === 0
                ? "Aún no hay recetas en el libro."
                : "No hay recetas que coincidan."}
            </p>
          ) : (
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}
            >
              {filtered.map((r) => (
                <RecipeCard key={r.id} recipe={r} onClick={() => setSelected(r)} />
              ))}
            </div>
          )}
        </div>
      </main>

      {isAdmin && (
        <button className="book-fab" onClick={() => setSelected("new")}>
          <span style={{ fontSize: "1.4rem" }}>👨‍🍳</span>
          Añadir
        </button>
      )}

      <AnimatePresence>
        {selected !== null && (
          <RecipePanel
            key={selected === "new" ? "new" : selected.id}
            recipe={selected === "new" ? null : selected}
            isAdmin={isAdmin}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
