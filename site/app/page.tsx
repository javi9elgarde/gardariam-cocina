"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import BookReader, { COVER } from "@/components/BookReader";
import LoadingScreen from "@/components/LoadingScreen";
import ProfileSetup from "@/components/ProfileSetup";
import RecipeDetail from "@/components/RecipeDetail";
import RecipePanel from "@/components/RecipePanel";
import RetosZone from "@/components/RetosZone";
import { useAuth } from "@/lib/auth";
import { junimoSrc, useProfile } from "@/lib/profile";
import { alternarSonido, sfx, sonidoActivo } from "@/lib/sfx";
import { getRecipes, onStorageChange, updateRecipe } from "@/lib/storage";
import { useFavorites } from "@/lib/useFavorites";
import { CATEGORIES, isBookRecipe, type Recipe } from "@/lib/types";

const FAV = "__fav__";

const CAT_ICON: Record<string, string> = {
  Entrantes: "entrantes",
  Carnes: "carnes",
  Pasta: "pasta",
  Arroces: "arroces",
  Pescados: "pescados",
  Vegetarianas: "vegetarianas",
  Postres: "postres",
  "Salsas y bases": "salsas",
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
  const { profile, loaded: profileLoaded } = useProfile();
  const [editProfile, setEditProfile] = useState(false);
  const [showRetos, setShowRetos] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [sonido, setSonido] = useState(true);
  useEffect(() => setSonido(sonidoActivo()), []);

  const [rawRecipes, setRawRecipes] = useState<Recipe[]>([]);
  const [editing, setEditing] = useState<Recipe | null | "new">(null);
  const [detail, setDetail] = useState<Recipe | null>(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [readerPage, setReaderPage] = useState<number | null>(null);
  const dragId = useRef<string | null>(null);

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
      if (cat === FAV && !r.favorite) return false;
      if (cat && cat !== FAV && r.category !== cat) return false;
      if (q && !norm(r.title).includes(q)) return false;
      return true;
    });
  }, [recipes, query, cat]);

  const stats = useMemo(
    () => ({
      recetas: recipes.length,
      categorias: new Set(recipes.map((r) => r.category).filter(Boolean)).size,
      favoritas: recipes.filter((r) => r.favorite).length,
      minutos: recipes.reduce((a, r) => a + (r.prepMinutes || 0), 0),
    }),
    [recipes],
  );

  /** Admin arrastra para reordenar */
  function onDrop(targetId: string) {
    const from = dragId.current;
    dragId.current = null;
    if (!from || from === targetId) return;
    const ids = recipes.map((r) => r.id);
    const fromIdx = ids.indexOf(from);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    ids.splice(toIdx, 0, ids.splice(fromIdx, 1)[0]);
    ids.forEach((id, i) => updateRecipe(id, { sortIndex: i }));
  }

  const detailLive = detail ? (recipes.find((r) => r.id === detail.id) ?? detail) : null;

  return (
    <div className="farm">
      <LoadingScreen />
      {/* ---------- Navegación ---------- */}
      <nav className="farm-nav">
        <a className="farm-brand" href="https://gardariam.com">
          🏠 Hub
        </a>
        <div className="farm-links">
          <button className="farm-link" onClick={() => { sfx.abrir(); setShowRetos(true); }}>
            Retos
          </button>
        </div>
        <div className="farm-user">
          <button
            className="sound-btn"
            onClick={() => setSonido(alternarSonido())}
            title={sonido ? "Silenciar sonidos" : "Activar sonidos"}
            aria-label={sonido ? "Silenciar sonidos" : "Activar sonidos"}
          >
            {sonido ? "🔊" : "🔇"}
          </button>
          {!loading && !user && (
            <button className="farm-link" onClick={signIn}>
              Entrar
            </button>
          )}
          {user && (
            <div className="user-menu-wrap">
              <button
                className="user-avatar-btn"
                onClick={() => setUserMenu((v) => !v)}
                aria-label="Tu perfil"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={junimoSrc(profile?.junimo ?? "verde")} alt="" />
              </button>
              {userMenu && (
                <>
                  <div className="user-menu-back" onClick={() => setUserMenu(false)} />
                  <div className="user-menu">
                    <p className="user-menu-name">
                      {profile?.name ?? "Sin nombre"}
                      {isAdmin && <span className="user-menu-admin">⚜ Admin</span>}
                    </p>
                    <button
                      onClick={() => {
                        setUserMenu(false);
                        setEditProfile(true);
                      }}
                    >
                      ✎ Editar perfil
                    </button>
                    <button
                      onClick={() => {
                        setUserMenu(false);
                        signOutUser();
                      }}
                    >
                      ↪ Salir
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ---------- Cartel ---------- */}
      <header className="farm-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="farm-sign-img" src="/cocina/sign.png" alt="Libro de Cocina Mariam & Javi" />
      </header>

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
              <button
                className={`cat-icon-btn ${cat === FAV ? "active" : ""}`}
                onClick={() => setCat(cat === FAV ? null : FAV)}
                title="Favoritas"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/cocina/cat/favoritas.png" alt="Favoritas" />
              </button>
            </div>
          </div>

          {/* ---------- Cuadrícula ---------- */}
          <section className="grid-wrap">
            <div className="grid-head">
              <div className="grid-head-mid">
                <h2 className="grid-title">
                  ❧ {cat === FAV ? "Tus favoritas" : (cat ?? "Nuestras recetas")} ❧
                </h2>
                <p className="grid-sub">
                  {filtered.length} receta{filtered.length === 1 ? "" : "s"}
                  {isAdmin ? " · arrastra para reordenar" : " · toca una para abrirla"}
                </p>
              </div>
              <button className="openbook-btn" onClick={() => { sfx.pagina(); setReaderPage(COVER); }}>
                📖 Abrir el Libro
              </button>
            </div>

            {filtered.length === 0 ? (
              <p className="ob-empty">No hay recetas que coincidan.</p>
            ) : (
              <ul className="rgrid">
                {filtered.map((r) => (
                  <li
                    key={r.id}
                    draggable={isAdmin}
                    onDragStart={() => (dragId.current = r.id)}
                    onDragOver={(e) => isAdmin && e.preventDefault()}
                    onDrop={() => isAdmin && onDrop(r.id)}
                  >
                    <button
                      className={`rtile ${isBookRecipe(r) ? "is-book" : "is-new"}`}
                      onClick={() => { sfx.abrir(); setDetail(r); }}
                    >
                      <span className="rtile-img">
                        {r.iconUrl || r.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.iconUrl || r.photoUrl}
                            alt={r.title}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              // si el icono no existe, usar la foto de la página
                              const img = e.currentTarget;
                              if (r.photoUrl && img.src !== location.origin + r.photoUrl) {
                                img.src = r.photoUrl;
                              }
                            }}
                          />
                        ) : (
                          <span className="rtile-empty">🍲</span>
                        )}
                        <span
                          className="rtile-badge"
                          title={isBookRecipe(r) ? "En el libro" : "Receta de casa"}
                        >
                          {isBookRecipe(r) ? "📖" : "✎"}
                        </span>
                      </span>
                      {isAdmin && (
                        <span
                          role="button"
                          tabIndex={0}
                          aria-label="Editar receta"
                          className="rtile-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(r);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                              setEditing(r);
                            }
                          }}
                        >
                          ✎
                        </span>
                      )}
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Favorita"
                        className={`rtile-fav ${r.favorite ? "is-fav" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sfx.favorito();
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
        {detailLive && (
          <RecipeDetail
            key={`d-${detailLive.id}`}
            recipe={detailLive}
            isAdmin={isAdmin}
            onToggleFav={() => toggleFavorite(detailLive.id)}
            onOpenBook={() => {
              setReaderPage(detailLive.bookPage ?? COVER);
              setDetail(null);
            }}
            onEdit={() => {
              setEditing(detailLive);
              setDetail(null);
            }}
            onClose={() => setDetail(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {readerPage !== null && (
          <BookReader
            key={`reader-${readerPage}`}
            startPage={readerPage}
            onClose={() => setReaderPage(null)}
          />
        )}
      </AnimatePresence>

      {/* Perfil: primera vez tras entrar, o al pulsar su nombre */}
      <AnimatePresence>
        {user && profileLoaded && (!profile || editProfile) && (
          <ProfileSetup
            key="perfil"
            current={profile}
            onDone={() => setEditProfile(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRetos && (
          <RetosZone key="retos" recipes={recipes} onClose={() => setShowRetos(false)} />
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
