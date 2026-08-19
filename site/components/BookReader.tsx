"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  BOOK_PAGES,
  BOOK_SECTIONS,
  COVER_SRC,
  BACK_SRC,
  COVER_SRC_HD,
  pageSrc,
  pageSrcHD,
} from "@/lib/book";
import { sfx } from "@/lib/sfx";

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

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const upd = () => setIsWide(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  const isCover = page === COVER;
  const isBack = page === BACK;
  // pantalla ancha: pliego par-impar. Móvil: la hoja tal cual.
  const left = isCover || isBack ? page : isWide ? (page % 2 === 0 ? page : page - 1) : page;
  const right = left + 1;

  const go = useCallback(
    (d: number) => {
      sfx.pagina();
      setPage((p) => {
        if (p === COVER) return d > 0 ? 0 : COVER; // desde la portada solo se avanza
        if (p === BACK) return d < 0 ? (isWide ? BOOK_PAGES - 2 : BOOK_PAGES - 1) : BACK;
        // en móvil se avanza hoja a hoja; en ancho, de pliego en pliego
        const base = isWide ? (p % 2 === 0 ? p : p - 1) : p;
        const next = base + d * (isWide ? 2 : 1);
        if (next < 0) return COVER; // volver a la portada
        if (next > BOOK_PAGES - 1) return BACK; // al final, la contraportada
        return next;
      });
    },
    [isWide],
  );

  const irA = useCallback((p: number) => {
    sfx.pagina();
    setPage(p);
  }, []);

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
        <span className="reader-title">Libro de Cocina</span>
        <div className="reader-bar-right">
          <button
            className="book-top-link"
            onClick={() => setZoom((z) => !z)}
            aria-pressed={zoom}
          >
            {zoom ? "Reducir" : "Ampliar"}
          </button>
        </div>
      </div>

      <div className={`reader-stage ${zoom ? "is-zoom" : ""}`}>
        <button
          className="reader-arrow left"
          onClick={() => go(-1)}
          disabled={atStart}
          aria-label="Página anterior"
        >
          ‹
        </button>

        {/* Sin animación de pasar hoja: se muestra directamente */}
        <div className="reader-spread" onClick={() => setZoom((z) => !z)}>
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
          aria-label="Página siguiente"
        >
          ›
        </button>
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
          <button className={`reader-sec ${isCover ? "active" : ""}`} onClick={() => irA(COVER)}>
            📕 Portada
          </button>
          {BOOK_SECTIONS.filter((s) => s.id !== "portada").map((s) => (
            <button
              key={s.id}
              className={`reader-sec ${!isCover && left >= s.page && left < s.page + 2 ? "active" : ""}`}
              onClick={() => irA(s.page)}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
        <p className="reader-hint">Usa las flechas ‹ › para pasar de página · toca la hoja para ampliar</p>
      </div>
    </motion.div>
  );
}
