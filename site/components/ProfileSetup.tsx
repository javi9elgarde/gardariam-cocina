"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { JUNIMOS, JUNIMO_DORADO, junimoSrc, useProfile, type Profile } from "@/lib/profile";

interface Props {
  /** perfil actual (null = primera vez) */
  current: Profile | null;
  onDone: () => void;
}

export default function ProfileSetup({ current, onDone }: Props) {
  const { user } = useAuth();
  const { save } = useProfile();
  const [name, setName] = useState(current?.name ?? user?.displayName?.split(" ")[0] ?? "");
  const [junimo, setJunimo] = useState<string>(current?.junimo ?? "verde");
  const dorado = current?.dorado ?? false;
  const [busy, setBusy] = useState(false);

  async function guardar() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await save({ name, junimo, dorado });
      onDone();
    } catch {
      setBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="recipe-overlay"
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="prof-card"
      >
        <h2 className="prof-title">
          {current ? "✎ Tu perfil" : "🌱 ¡Bienvenido a la cocina!"}
        </h2>
        <p className="prof-sub">
          {current
            ? "Cambia tu nombre o tu junimo cuando quieras."
            : "Elige cómo quieres aparecer. Nadie verá tu foto de Google."}
        </p>

        <div className="prof-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={junimoSrc(junimo)} alt="" />
          <span>{name.trim() || "Sin nombre"}</span>
        </div>

        <label className="book-label">Tu nombre</label>
        <input
          className="book-input"
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Mery, Javi, La Yaya..."
        />

        <label className="book-label">Elige tu junimo</label>
        <div className="prof-junimos">
          {JUNIMOS.map((j) => (
            <button
              key={j}
              className={`prof-juni ${junimo === j ? "is-sel" : ""}`}
              onClick={() => setJunimo(j)}
              title={j}
              aria-label={j}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={junimoSrc(j)} alt="" />
            </button>
          ))}

          {/* Recompensa por sellar todo el libro */}
          <button
            className={`prof-juni prof-juni-oro ${junimo === JUNIMO_DORADO ? "is-sel" : ""} ${
              dorado ? "" : "is-locked"
            }`}
            onClick={() => dorado && setJunimo(JUNIMO_DORADO)}
            disabled={!dorado}
            title={dorado ? "Junimo dorado" : "Se desbloquea al sellar todo el libro"}
            aria-label={dorado ? "Junimo dorado" : "Junimo dorado (bloqueado)"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={junimoSrc(JUNIMO_DORADO)} alt="" />
            {!dorado && <span className="prof-juni-lock">🔒</span>}
          </button>
        </div>
        {!dorado && (
          <p className="prof-oro-hint">
            🔒 El <b>junimo dorado</b> se desbloquea al completar todos los retos del libro.
          </p>
        )}

        <div className="prof-actions">
          <button className="book-btn" onClick={guardar} disabled={busy || !name.trim()}>
            {busy ? "Guardando…" : "Guardar"}
          </button>
          {current && (
            <button className="book-btn book-btn-ghost" onClick={onDone}>
              Cancelar
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
