"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOOK_PAGES,
  BOOK_SECTIONS,
  COVER_SRC,
  BACK_SRC,
  COVER_SRC_HD,
  pageSrc,
  pageSrcHD,
  recipeIdForPage,
} from "@/lib/book";
import IngredientsPanel from "@/components/IngredientsPanel";
import { sfx } from "@/lib/sfx";
import { getRecipe } from "@/lib/storage";
import type { Recipe } from "@/lib/types";

/** -1 = portada del libro */
export const COVER = -1;
/** contraportada: va justo detrás de la última página */
export const BACK = BOOK_PAGES;

interface BookReaderProps {
  startPage?: number;
  onClose: () => void;
}

export default function BookReader({ startPage = COVER, onClose }: BookReaderProps) {
  const [page, setPage] = useState(startPage);
  const [zoom, setZoom] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const [ficha, setFicha] = useState(false);
  const [ings, setIngs] = useState(false);
  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const upd = () => setIsWide(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  const isCover = page === COVER;
  const isBack = page === BACK;
  const left = isCover || isBack ? page : page % 2 === 0 ? page : page - 1;
  const right = left + 1;

  const go = useCallback(
    (d: number) => {
      sfx.pagina();
      setFicha(false);
      setPage((p) => {
        const paso = isWide ? 2 : 1;
        if (p === COVER) return d > 0 ? 0 : COVER; // desde la portada solo se avanza
        if (p === BACK) return d < 0 ? (isWide ? BOOK_PAGES - 2 : BOOK_PAGES - 1) : BACK;
        const base = p % 2 === 0 ? p : p - 1;
        const next = base + d * paso;
        if (next < 0) return COVER; // volver a la portada
        if (next > BOOK_PAGES - 1) return BACK; // al final, la contraportada
        return next;
      });
    },
    [isWide],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") (zoom ? setZoom(false) : onClose());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose, zoom]);

  const atStart = isCover;
  const atEnd = isBack;
  const sectionLabel = isCover
    ? "Portada"
    : isBack
    ? "Contraportada"
    : ([...BOOK_SECTIONS].reverse().find((s) => s.page <= left)?.label ?? "");

  const recipeId = isCover || isBack ? null : recipeIdForPage(left, right);
  const recipe: Recipe | undefined = recipeId ? getRecipe(recipeId) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="reader-overlay"
    >
      <div className="reader-bar">
        <button className="book-top-link" onClick={onClose}>
          ← Volver
        </button>
        <span className="reader-title">📖 Mariam y Javi — Libro de Cocina</span>
        <div className="reader-bar-right">
          {!isCover && (
            <button className="book-top-link" onClick={() => setPage(COVER)}>
              Portada
            </button>
          )}
          {recipe && (
            <button className="book-top-link" onClick={() => setIngs((v) => !v)}>
              🧺 Ingredientes
            </button>
          )}
          {recipe && (
            <button className="book-top-link" onClick={() => setFicha((f) => !f)}>
              {ficha ? "Ocultar ficha" : "📋 Ficha"}
            </button>
          )}
          <button className="book-top-link" onClick={() => setZoom((z) => !z)}>
            {zoom ? "Reducir" : "Ampliar"}
          </button>
        </div>
      </div>

      <div
        className={`reader-stage ${zoom ? "is-zoom" : ""}`}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchX.current = t.clientX;
          touchY.current = t.clientY;
          swiped.current = false;
        }}
        onTouchMove={(e) => {
          if (touchX.current === null || touchY.current === null) return;
          const dx = e.touches[0].clientX - touchX.current;
          const dy = e.touches[0].clientY - touchY.current;
          // deslizamiento claramente horizontal
          if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            swiped.current = true;
          }
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null || touchY.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          const dy = e.changedTouches[0].clientY - touchY.current;
          touchX.current = null;
          touchY.current = null;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            swiped.current = true;
            go(dx < 0 ? 1 : -1);
          }
        }}
      >
        <button
          className="reader-arrow left"
          onClick={() => go(-1)}
          disabled={atStart}
          aria-label="Anterior"
        >
          ‹
        </button>

        {/* Sin animación de pasar hoja: se muestra directamente */}
        <div
          className="reader-spread"
          onClick={() => {
            if (swiped.current) { swiped.current = false; return; }
            setZoom((z) => !z);
          }}
        >
          {isBack ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="reader-page" src={BACK_SRC} alt="Contraportada del libro" />
          ) : isCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="reader-page"
              src={zoom ? COVER_SRC_HD : COVER_SRC}
              alt="Portada del libro"
            />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="reader-page"
                src={zoom ? pageSrcHD(left) : pageSrc(left)}
                alt={`Página ${left + 1}`}
              />
              {isWide && right < BOOK_PAGES && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="reader-page"
                  src={zoom ? pageSrcHD(right) : pageSrc(right)}
                  alt={`Página ${right + 1}`}
                />
              )}
            </>
          )}
        </div>

        <button
          className="reader-arrow right"
          onClick={() => go(1)}
          disabled={atEnd}
          aria-label="Siguiente"
        >
          ›
        </button>

        {/* Ingredientes marcables */}
        <AnimatePresence>
          {ings && recipe && (
            <IngredientsPanel recipe={recipe} onClose={() => setIngs(false)} />
          )}
        </AnimatePresence>

        {/* Ficha resumen */}
        <AnimatePresence>
          {ficha && recipe && (
            <motion.aside
              className="ficha"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ficha-tape" />
              <h3 className="ficha-title">{recipe.title}</h3>
              <div className="ficha-stars">
                {"★".repeat(Math.max(1, Math.min(5, recipe.rating || 5)))}
              </div>
              <dl className="ficha-data">
                <div>
                  <dt>Categoría</dt>
                  <dd>{recipe.category || "—"}</dd>
                </div>
                <div>
                  <dt>Tiempo</dt>
                  <dd>⏱ {recipe.prepMinutes} min</dd>
                </div>
                <div>
                  <dt>Raciones</dt>
                  <dd>👤 {recipe.persons ?? 2} pers.</dd>
                </div>
                <div>
                  <dt>Páginas</dt>
                  <dd>
                    {left + 1}
                    {isWide && right < BOOK_PAGES ? `–${right + 1}` : ""}
                  </dd>
                </div>
              </dl>
              <button className="book-btn book-btn-ghost ficha-btn" onClick={() => setZoom(true)}>
                🔍 Ampliar página
              </button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <div className="reader-foot">
        <p className="reader-pageinfo">
          {isCover ? (
            "Portada"
          ) : isBack ? (
            "Contraportada"
          ) : (
            <>
              Pág. <b>{left + 1}</b>
              {isWide && right < BOOK_PAGES ? ` – ${right + 1}` : ""} de {BOOK_PAGES}
              {sectionLabel ? ` — ${sectionLabel}` : ""}
            </>
          )}
        </p>
        <div className="reader-sections">
          <button
            className={`reader-sec ${isCover ? "active" : ""}`}
            onClick={() => setPage(COVER)}
          >
            📕 Portada
          </button>
          {BOOK_SECTIONS.filter((s) => s.id !== "portada").map((s) => (
            <button
              key={s.id}
              className={`reader-sec ${!isCover && left >= s.page && left < s.page + 2 ? "active" : ""}`}
              onClick={() => {
                setFicha(false);
                setPage(s.page);
              }}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
        <p className="reader-hint">← → flechas · desliza en móvil · toca la hoja para ampliar</p>
      </div>
    </motion.div>
  );
}
