"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import InlineBook from "@/components/book/InlineBook";
import BookReader from "@/components/BookReader";
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

  // libro dentro del marco
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  // lector grande (solo al pulsar una hoja)
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

  /** Al pulsar una receta: el libro salta a su página (sin salir del marco) */
  function jumpToRecipe(r: Recipe) {
    const p = RECIPE_PAGE[r.id];
    if (p === undefined) return;
    setOpened(true);
    setPage(p % 2 === 0 ? p : p - 1);
    document.querySelector(".stage-frame")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const showBook = tab === "recetas" || tab === "favoritas";

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

      {showBook ? (
        <>
          {/* ---------- EL LIBRO dentro del marco ---------- */}
          <div className="stage-frame">
            <InlineBook
              page={page}
              opened={opened}
              onOpen={() => {
                setOpened(true);
                setPage(0);
              }}
              onChangePage={setPage}
              onZoomPage={(p) => setReaderPage(p)}
            />
          </div>

          {/* ---------- Filtros + recomendaciones ---------- */}
          <section className="picker">
            <div className="picker-tools">
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

            {/* Columna de recomendaciones del filtro */}
            <div className="reco">
              <h3 className="reco-h">
                ❧ {tab === "favoritas" ? "Tus favoritas" : (cat ?? "Todas las recetas")} ❧
              </h3>
              <p className="reco-sub">
                {filtered.length} receta{filtered.length === 1 ? "" : "s"} · toca una para abrir su
                página
              </p>
              <ul className="reco-list">
                {filtered.map((r) => (
                  <li key={r.id}>
                    <button className="reco-item" onClick={() => jumpToRecipe(r)}>
                      {r.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="reco-thumb" src={r.photoUrl} alt="" />
                      ) : (
                        <span className="reco-thumb reco-thumb--empty" />
                      )}
                      <span className="reco-body">
                        <span className="reco-name">{r.title}</span>
                        <span className="reco-meta">
                          <span className="ob-stars">
                            {"★".repeat(Math.max(1, Math.min(5, r.rating || 5)))}
                          </span>{" "}
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
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="ob-empty">No hay recetas que coincidan.</li>
                )}
              </ul>
            </div>
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

      {/* ---------- Pie decorativo + números ---------- */}
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
