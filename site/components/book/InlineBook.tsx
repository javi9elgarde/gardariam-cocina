"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BOOK_PAGES, BOOK_SECTIONS, pageSrc } from "@/lib/book";

interface InlineBookProps {
  /** página izquierda del pliego actual (par) */
  page: number;
  opened: boolean;
  onOpen: () => void;
  onChangePage: (page: number) => void;
  /** al pulsar una hoja -> abrir lector grande en esa página */
  onZoomPage: (page: number) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function InlineBook({
  page,
  opened,
  onOpen,
  onChangePage,
  onZoomPage,
}: InlineBookProps) {
  const [dir, setDir] = useState(1);
  const left = page % 2 === 0 ? page : page - 1;
  const right = left + 1;
  const sectionLabel =
    [...BOOK_SECTIONS].reverse().find((s) => s.page <= left)?.label ?? "";

  function go(d: number) {
    setDir(d);
    onChangePage(Math.max(0, Math.min(BOOK_PAGES - 1, left + d * 2)));
  }

  /* ---------- Cerrado: portada ---------- */
  if (!opened) {
    return (
      <div className="ib ib-closed">
        <motion.button
          className="ib-cover"
          onClick={onOpen}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          whileHover={{ rotateY: -12, scale: 1.015 }}
          aria-label="Abrir el libro"
        >
          <span className="ib-cover-spine" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cocina/portada.jpg" alt="Libro de Cocina Mariam y Javi" />
          <span className="ib-cover-shine" />
        </motion.button>
        <motion.span
          className="ib-cta"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Toca la portada para abrir el libro →
        </motion.span>
      </div>
    );
  }

  /* ---------- Abierto: pliego ---------- */
  return (
    <div className="ib">
      <button
        className="ib-arrow left"
        onClick={() => go(-1)}
        disabled={left <= 0}
        aria-label="Página anterior"
      >
        ‹
      </button>

      <motion.div
        key={left}
        className="ib-spread"
        initial={{ rotateY: dir > 0 ? 26 : -26, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <button className="ib-leaf" onClick={() => onZoomPage(left)} aria-label="Ampliar página">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pageSrc(left)} alt={`Página ${left + 1}`} />
        </button>
        {right < BOOK_PAGES && (
          <button
            className="ib-leaf ib-leaf-right"
            onClick={() => onZoomPage(right)}
            aria-label="Ampliar página"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pageSrc(right)} alt={`Página ${right + 1}`} />
          </button>
        )}
      </motion.div>

      <button
        className="ib-arrow right"
        onClick={() => go(1)}
        disabled={right >= BOOK_PAGES - 1}
        aria-label="Página siguiente"
      >
        ›
      </button>

      <p className="ib-foot">
        Pág. <b>{left + 1}</b>
        {right < BOOK_PAGES ? ` – ${right + 1}` : ""} de {BOOK_PAGES}
        {sectionLabel ? ` — ${sectionLabel}` : ""} · toca una hoja para ampliar
      </p>
    </div>
  );
}
