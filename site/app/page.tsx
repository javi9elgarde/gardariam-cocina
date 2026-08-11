"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import BookReader, { COVER } from "@/components/BookReader";
import RecipePanel from "@/components/RecipePanel";
import { RECIPE_PAGE } from "@/lib/book";
import { useAuth } from "@/lib/auth";
import { getRecipes, onStorageChange } from "@/lib/storage";
import { useFavorites } from "@/lib/useFavorites";
import { CATEGORIES, type Recipe } from "@/lib/types";

type Tab = "recetas" | "favoritas" | "colecciones" | "nosotros";

const CAT_ICON: Record<string, string> = {
  Entrantes: "entrantes",
  Carnes: "carnes",
  Pasta: "pasta",
  Arroces: "arroces",
  Pescados: "pescados",
  Vegetarianas: "vegetarianas",
  Postres: "postres",
  Desayunos: "desayunos",
  "Salsas y bases": "salsas",
  Bebidas: "bebidas",
};

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function Home() {
  const { isAdmin, user, loading, signIn, signOutUser } = useAuth();
  const { isFav, toggle: toggleFavorite } = useFavorites();

  const [rawRecipes, setRawRecipes] = useState<Recipe[]>([]);
  const [editing, setEditing] = useState<Recipe | null | "new">(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("recetas");
  const [readerPage, setReaderPage] = useState<number | null>(null);

  useEffect(() => {
    const load = () => setRawRecipes(getRecipes());
    load();
    return onStorageChange(load);
  }, []);

  const recipes = useMemo(
    () => rawRecipes.map((r) => ({ ...r, favorite: isFav(r.id) })),
    [rawRecipes, isFav],
  );

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    return recipes.filter((r) => {
      if (tab === "favoritas" && !r.favorite) return false;
      if (cat && r.category !== cat) return false;
      if (q && !norm(r.title).includes(q)) return false;
      return true;
    });
  }, [recipes, query, cat, tab]);

  const stats = useMemo(
    () => ({
      recetas: recipes.length,
      categorias: new Set(recipes.map((r) => r.category).filter(Boolean)).size,
      favoritas: recipes.filter((r) => r.favorite).length,
      minutos: recipes.reduce((a, r) => a + (r.prepMinutes || 0), 0),
    }),
    [recipes],
  );

  /** Al pulsar una receta se abre el libro en su página */
  function openRecipe(r: Recipe) {
    setReaderPage(RECIPE_PAGE[r.id] ?? COVER);
  }

  const showRecipes = tab === "recetas" || tab === "favoritas";

  return (
    <div className="farm">
      {/* ---------- Navegación ---------- */}
      <nav className="farm-nav">
        <a className="farm-brand" href="https://gardariam.com">
          🏠 Hub
        </a>
        <div className="farm-links">
          {(
            [
              ["recetas", "📖 Recetas"],
              ["favoritas", "❤️ Favoritas"],
              ["colecciones", "📦 Colecciones"],
              ["nosotros", "👥 Nosotros"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              className={`farm-link ${tab === id ? "active" : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="farm-user">
          {!loading && (
            <button
              className="farm-link"
              onClick={() => (user ? signOutUser() : signIn())}
              title={user ? (user.email ?? "") : "Iniciar sesión"}
            >
              {user ? (isAdmin ? "⚜ Admin" : "Salir") : "Entrar"}
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="farm-avatar" src="/cocina/mascota-chef.png" alt="" />
        </div>
      </nav>

      {/* ---------- Cartel ---------- */}
      <header className="farm-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="farm-sign-img"
          src="/cocina/sign.png"
          alt="Libro de Cocina Mariam & Javi"
        />
      </header>

      {showRecipes ? (
        <>
          {/* ---------- Buscador + filtros ---------- */}
          <div className="farm-tools">
            <label className="book-search">
              <span aria-hidden>🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar receta..."
              />
            </label>

            <div className="farm-cats">
              <button
                className={`cat-icon-btn ${cat === null ? "active" : ""}`}
                onClick={() => setCat(null)}
                title="Todas"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/cocina/cat/todas.png" alt="Todas" />
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={`cat-icon-btn ${cat === c.id ? "active" : ""}`}
                  onClick={() => setCat(cat === c.id ? null : c.id)}
                  title={c.id}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/cocina/cat/${CAT_ICON[c.id]}.png`} alt={c.id} />
                </button>
              ))}
            </div>
          </div>

          {/* ---------- Abrir el libro ---------- */}
          <div className="openbook-cta">
            <button className="openbook-btn" onClick={() => setReaderPage(COVER)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cocina/portada.jpg" alt="" />
              <span>📖 Abrir el libro</span>
            </button>
          </div>

          {/* ---------- Cuadrícula de recetas 1:1 ---------- */}
          <section className="grid-wrap">
            <h2 className="grid-title">
              ❧ {tab === "favoritas" ? "Tus favoritas" : (cat ?? "Nuestras recetas")} ❧
            </h2>
            <p className="grid-sub">
              {filtered.length} receta{filtered.length === 1 ? "" : "s"} · toca una para abrirla en
              el libro
            </p>

            {filtered.length === 0 ? (
              <p className="ob-empty">No hay recetas que coincidan.</p>
            ) : (
              <ul className="rgrid">
                {filtered.map((r) => (
                  <li key={r.id}>
                    <button className="rtile" onClick={() => openRecipe(r)}>
                      <span className="rtile-img">
                        {r.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.photoUrl} alt={r.title} />
                        ) : (
                          <span className="rtile-empty">🍲</span>
                        )}
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Favorita"
                        className={`rtile-fav ${r.favorite ? "is-fav" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(r.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            toggleFavorite(r.id);
                          }
                        }}
                      >
                        {r.favorite ? "♥" : "♡"}
                      </span>
                      <span className="rtile-cap">
                        <span className="rtile-name">{r.title}</span>
                        <span className="rtile-meta">
                          <span className="ob-stars">
                            {"★".repeat(Math.max(1, Math.min(5, r.rating || 5)))}
                          </span>{" "}
                          · {r.prepMinutes} min
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <div className="farm-empty">
          <h2 className="book-section-title">
            {tab === "colecciones" ? "📦 Colecciones" : "👥 Nosotros"}
          </h2>
          <p className="book-section-sub mt-2">Próximamente ❧</p>
        </div>
      )}

      {/* ---------- Pie ---------- */}
      <footer className="farm-foot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cocina/mascota-saluda.png" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="shelf-img" src="/cocina/shelf.png" alt="" />
        <div className="stats-panel">
          <div>
            <b>{stats.recetas}</b>
            <span>Recetas</span>
          </div>
          <div>
            <b>{stats.categorias}</b>
            <span>Categorías</span>
          </div>
          <div>
            <b>{stats.favoritas}</b>
            <span>Favoritas</span>
          </div>
          <div>
            <b>{Math.round(stats.minutos / 60)}h</b>
            <span>De cocina</span>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cocina/gallina.png" alt="" />
      </footer>

      {isAdmin && (
        <button className="book-fab" onClick={() => setEditing("new")}>
          <span style={{ fontSize: "1.4rem" }}>👨‍🍳</span>
          Añadir
        </button>
      )}

      <AnimatePresence>
        {readerPage !== null && (
          <BookReader
            key={`reader-${readerPage}`}
            startPage={readerPage}
            onClose={() => setReaderPage(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editing !== null && (
          <RecipePanel
            key={editing === "new" ? "new" : editing.id}
            recipe={editing === "new" ? null : editing}
            isAdmin={isAdmin}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
