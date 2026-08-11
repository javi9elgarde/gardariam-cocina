"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BOOK_PAGES, BOOK_SECTIONS, pageSrc, recipeIdForPage } from "@/lib/book";
import { getRecipe } from "@/lib/storage";
import type { Recipe } from "@/lib/types";

interface BookReaderProps {
  startPage?: number;
  /** true = empieza con la portada cerrada y la abre con animación */
  animateOpen?: boolean;
  onClose: () => void;
}

export default function BookReader({
  startPage = 0,
  animateOpen = false,
  onClose,
}: BookReaderProps) {
  const [page, setPage] = useState(startPage);
  const [dir, setDir] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const [opening, setOpening] = useState(animateOpen);
  const [ficha, setFicha] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const upd = () => setIsWide(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  // Secuencia de apertura: portada cerrada -> se abre -> páginas
  useEffect(() => {
    if (!opening) return;
    const t = setTimeout(() => setOpening(false), 1150);
    return () => clearTimeout(t);
  }, [opening]);

  const step = isWide ? 2 : 1;
  const left = isWide ? (page % 2 === 0 ? page : page - 1) : page;
  const right = left + 1;

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setFicha(false);
      setPage((p) => {
        const base = isWide ? (p % 2 === 0 ? p : p - 1) : p;
        return Math.max(0, Math.min(BOOK_PAGES - 1, base + d * step));
      });
    },
    [isWide, step],
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

  const atStart = left <= 0;
  const atEnd = (isWide ? right : left) >= BOOK_PAGES - 1;
  const sectionLabel = [...BOOK_SECTIONS].reverse().find((s) => s.page <= left)?.label ?? "";

  const recipeId = recipeIdForPage(left, right);
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
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {opening ? (
          /* ===== Animación de apertura ===== */
          <div className="opening-scene">
            <motion.img
              className="opening-cover"
              src="/cocina/portada.jpg"
              alt="Portada"
              initial={{ rotateY: 0, opacity: 1 }}
              animate={{ rotateY: -168, opacity: 0.15 }}
              transition={{ duration: 1.05, ease: [0.5, 0, 0.3, 1] }}
            />
            <motion.div
              className="opening-inner"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="reader-page" src={pageSrc(0)} alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="reader-page" src={pageSrc(1)} alt="" />
            </motion.div>
          </div>
        ) : (
          <>
            <button
              className="reader-arrow left"
              onClick={() => go(-1)}
              disabled={atStart}
              aria-label="Página anterior"
            >
              ‹
            </button>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={left}
                custom={dir}
                initial={{ rotateY: dir > 0 ? 32 : -32, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: dir > 0 ? -32 : 32, opacity: 0 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="reader-spread"
                onClick={() => setZoom((z) => !z)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="reader-page" src={pageSrc(left)} alt={`Página ${left + 1}`} />
                {isWide && right < BOOK_PAGES && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="reader-page" src={pageSrc(right)} alt={`Página ${right + 1}`} />
                )}
              </motion.div>
            </AnimatePresence>

            <button
              className="reader-arrow right"
              onClick={() => go(1)}
              disabled={atEnd}
              aria-label="Página siguiente"
            >
              ›
            </button>
          </>
        )}

        {/* ===== Ficha resumen ===== */}
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
          Pág. <b>{left + 1}</b>
          {isWide && right < BOOK_PAGES ? ` – ${right + 1}` : ""} de {BOOK_PAGES}
          {sectionLabel ? ` — ${sectionLabel}` : ""}
        </p>
        <div className="reader-sections">
          {BOOK_SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`reader-sec ${left >= s.page && left < s.page + 2 ? "active" : ""}`}
              onClick={() => {
                setDir(s.page > left ? 1 : -1);
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
