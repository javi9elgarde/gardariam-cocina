"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import BookCover from "@/components/BookCover";
import BookReader from "@/components/BookReader";
import RecipeCard from "@/components/RecipeCard";
import RecipePanel from "@/components/RecipePanel";
import { RECIPE_PAGE } from "@/lib/book";
import { useAuth } from "@/lib/auth";
import { getRecipes, onStorageChange } from "@/lib/storage";
import { CATEGORIES, type Recipe } from "@/lib/types";

const FAV = "__fav__";

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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Recipe | null | "new">(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [bookPage, setBookPage] = useState<number | null>(null);
  const [openAnim, setOpenAnim] = useState(false);

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
      {/* Barra superior */}
      <div className="relative z-30 flex items-center justify-between px-4 pt-3">
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

      {/* Cabecera: franja granja + cartel */}
      <header className="cocina-header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cocina-granja" src="/cocina/granja.png" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cocina-sign" src="/cocina/sign.png" alt="Libro de Cocina Mariam & Javi" />
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-40">
        {/* Buscador */}
        <div className="mt-6">
          <label className="book-search">
            <span aria-hidden>🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar receta..."
            />
          </label>
        </div>

        {/* Categorías (iconos madera) */}
        <div className="cat-row mt-6">
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
          <button
            className={`cat-icon-btn ${cat === FAV ? "active" : ""}`}
            onClick={() => setCat(cat === FAV ? null : FAV)}
            title="Favoritas"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cocina/cat/favoritas.png" alt="Favoritas" />
          </button>
        </div>

        {/* Título sección */}
        <div className="mt-8 text-center">
          <div className="book-divider mx-auto mb-4 max-w-md" />
          <h2 className="book-section-title">❧ Nuestras recetas ❧</h2>
          <p className="book-section-sub mt-1">
            Cada receta cuenta una historia, cada bocado un recuerdo ♥
          </p>
        </div>

        {/* Portada del libro: se abre con animación */}
        <div className="mt-6">
          <BookCover
            onOpen={() => {
              setOpenAnim(true);
              setBookPage(0);
            }}
          />
        </div>

        {/* Rejilla */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <p className="py-12 text-center italic text-ink-faint">
              No hay recetas que coincidan.
            </p>
          ) : (
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}
            >
              {filtered.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  onClick={() => {
                    const p = RECIPE_PAGE[r.id];
                    if (p !== undefined) setBookPage(p);
                    else setSelected(r);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Estantería decorativa + mascotas */}
      <div className="cocina-foot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cocina-mascota" src="/cocina/mascota-saluda.png" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cocina-shelf" src="/cocina/shelf.png" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cocina-gallina" src="/cocina/gallina.png" alt="" />
      </div>

      {isAdmin && (
        <button className="book-fab" onClick={() => setSelected("new")}>
          <span style={{ fontSize: "1.4rem" }}>👨‍🍳</span>
          Añadir
        </button>
      )}

      <AnimatePresence>
        {bookPage !== null && (
          <BookReader
            key={`book-${bookPage}-${openAnim ? "anim" : "direct"}`}
            startPage={bookPage}
            animateOpen={openAnim}
            onClose={() => {
              setBookPage(null);
              setOpenAnim(false);
            }}
          />
        )}
      </AnimatePresence>

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
