"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  JUNIMOS,
  LOGROS,
  ORDEN_LOGROS,
  junimoSrc,
  logrosDe,
  useProfile,
  type Profile,
} from "@/lib/profile";

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
  const ganados = logrosDe(current, user);
  const [busy, setBusy] = useState(false);

  async function guardar() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await save({ ...current, name, junimo });
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

          {/* Junimos de recompensa */}
          {ORDEN_LOGROS.map((l) => {
            const tengo = ganados.has(l);
            return (
              <button
                key={l}
                className={`prof-juni prof-juni-oro ${junimo === l ? "is-sel" : ""} ${
                  tengo ? "" : "is-locked"
                }`}
                onClick={() => tengo && setJunimo(l)}
                disabled={!tengo}
                title={tengo ? LOGROS[l].nombre : `${LOGROS[l].nombre} — ${LOGROS[l].pista}`}
                aria-label={tengo ? LOGROS[l].nombre : `${LOGROS[l].nombre} (bloqueado)`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={junimoSrc(l)} alt="" />
                {!tengo && <span className="prof-juni-lock">🔒</span>}
              </button>
            );
          })}
        </div>
        {ORDEN_LOGROS.some((l) => !ganados.has(l)) && (
          <ul className="prof-oro-hint">
            {ORDEN_LOGROS.filter((l) => !ganados.has(l)).map((l) => (
              <li key={l}>
                🔒 <b>{LOGROS[l].nombre}</b>: {LOGROS[l].pista}.
              </li>
            ))}
          </ul>
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
