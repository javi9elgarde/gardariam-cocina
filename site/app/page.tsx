"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import OpenBook from "@/components/book/OpenBook";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Recipe | null | "new">(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("recetas");
  const [bookPage, setBookPage] = useState<number | null>(null);

  useEffect(() => {
    const load = () => setRawRecipes(getRecipes());
    load();
    return onStorageChange(load);
  }, []);

  // favorito viene del dispositivo, no de Firestore
  const recipes = useMemo(
    () => rawRecipes.map((r) => ({ ...r, favorite: isFav(r.id) })),
    [rawRecipes, isFav],
  );

  const selected = useMemo(
    () => recipes.find((r) => r.id === selectedId) ?? null,
    [recipes, selectedId],
  );

  // primera receta seleccionada por defecto
  useEffect(() => {
    if (!selectedId && recipes.length) {
      setSelectedId((recipes.find((r) => r.pages?.length) ?? recipes[0]).id);
    }
  }, [recipes, selectedId]);

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

  function toggleFav(r: Recipe) {
    toggleFavorite(r.id);
  }

  function openOriginal(r: Recipe | null) {
    const p = r ? RECIPE_PAGE[r.id] : undefined;
    setBookPage(p ?? 0);
  }

  return (
    <div className="farm">
      {/* ---------- Navegación ---------- */}
      <nav className="farm-nav">
        <a className="farm-brand" href="https://gardariam.com">
          🏠 Cocina
          <br />
          Gardariam
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

      {tab === "recetas" || tab === "favoritas" ? (
        <>
          {/* ---------- Buscador + categorías ---------- */}
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

          {/* ---------- EL LIBRO ---------- */}
          <div className="ob-frame">
            <OpenBook
              recipes={filtered}
              selected={selected}
              onSelect={(r) => setSelectedId(r.id)}
              onToggleFav={toggleFav}
              onSeeAll={() => {
                setCat(null);
                setQuery("");
                setTab("recetas");
              }}
              onOpenOriginal={() => openOriginal(selected)}
            />
          </div>
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
        {bookPage !== null && (
          <BookReader
            key={`book-${bookPage}`}
            startPage={bookPage}
            onClose={() => setBookPage(null)}
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
