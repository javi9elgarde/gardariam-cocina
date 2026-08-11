"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BOOK_PAGES, BOOK_SECTIONS, pageSrc } from "@/lib/book";

interface BookReaderProps {
  startPage?: number;
  onClose: () => void;
}

export default function BookReader({ startPage = 0, onClose }: BookReaderProps) {
  const [page, setPage] = useState(startPage);
  const [dir, setDir] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const upd = () => setIsWide(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  // PC: hoja doble (izq par, der impar). Móvil: una página.
  const step = isWide ? 2 : 1;
  const left = isWide ? (page % 2 === 0 ? page : page - 1) : page;
  const right = left + 1;

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setPage((p) => {
        const base = isWide ? (p % 2 === 0 ? p : p - 1) : p;
        const next = base + d * step;
        return Math.max(0, Math.min(BOOK_PAGES - 1, next));
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

  const sectionLabel =
    [...BOOK_SECTIONS].reverse().find((s) => s.page <= left)?.label ?? "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="reader-overlay"
    >
      <div className="reader-bar">
        <button className="book-top-link" onClick={onClose}>
          ← Volver al recetario
        </button>
        <span className="reader-title">📖 Mariam y Javi — Libro de Cocina</span>
        <button className="book-top-link" onClick={() => setZoom((z) => !z)}>
          {zoom ? "Reducir" : "Ampliar"}
        </button>
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
