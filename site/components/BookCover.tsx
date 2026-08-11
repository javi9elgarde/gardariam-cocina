"use client";

import { motion } from "framer-motion";

interface BookCoverProps {
  onOpen: () => void;
}

export default function BookCover({ onOpen }: BookCoverProps) {
  return (
    <div className="cover-wrap">
      <motion.button
        className="cover-book"
        onClick={onOpen}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ rotateY: -14, scale: 1.02 }}
        aria-label="Abrir el libro"
      >
        <span className="cover-spine" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cover-img" src="/cocina/portada.jpg" alt="Libro de Cocina Mariam y Javi" />
        <span className="cover-shine" />
      </motion.button>

      <motion.button
        className="cover-cta"
        onClick={onOpen}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        Abrir el libro <span className="cover-cta-arrow">→</span>
      </motion.button>
      <p className="book-section-sub cover-hint">Pasa sus páginas como el libro de verdad</p>
    </div>
  );
}
