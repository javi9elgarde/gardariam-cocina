"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Fireworks from "@/components/Fireworks";
import { useAuth } from "@/lib/auth";
import {
  LOGROS,
  ORDEN_LOGROS,
  desbloquearLogros,
  junimoSrc,
  logrosDe,
  logrosPorRetos,
  toggleStamp,
  useProfile,
  watchMyStamps,
  type Logro,
} from "@/lib/profile";
import { sfx } from "@/lib/sfx";
import type { Recipe } from "@/lib/types";

interface Props {
  recipes: Recipe[];
  onClose: () => void;
}

/** logros ya celebrados en este dispositivo, para no repetir la fiesta */
const CELEBRADOS = "gardariam_logros_celebrados";

function yaCelebrado(uid: string, logro: Logro): boolean {
  try {
    const m = JSON.parse(localStorage.getItem(CELEBRADOS) ?? "{}");
    return Array.isArray(m[uid]) && m[uid].includes(logro);
  } catch {
    return false;
  }
}

function marcarCelebrado(uid: string, logro: Logro) {
  try {
    const m = JSON.parse(localStorage.getItem(CELEBRADOS) ?? "{}");
    m[uid] = [...new Set([...(m[uid] ?? []), logro])];
    localStorage.setItem(CELEBRADOS, JSON.stringify(m));
  } catch {
    /* sin localStorage se celebra otra vez, no pasa nada */
  }
}

export default function RetosZone({ recipes, onClose }: Props) {
  const { user, signIn } = useAuth();
  const { profile, save } = useProfile();
  const [done, setDone] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [fiesta, setFiesta] = useState<Logro | null>(null);
  const guardando = useRef(false);

  useEffect(() => {
    if (!user) {
      setDone([]);
      return;
    }
    return watchMyStamps(user.uid, setDone);
  }, [user]);

  const total = recipes.length;
  const hechas = done.filter((id) => recipes.some((r) => r.id === id)).length;
  const pct = total ? Math.round((hechas / total) * 100) : 0;
  const completo = total > 0 && hechas === total;

  const ganados = logrosDe(profile, user);

  /* Al llegar a 5, 10 o todas: se guarda el logro y se celebra (una sola vez) */
  useEffect(() => {
    if (!user || guardando.current) return;
    // se recalcula aquí dentro: `ganados` es un Set nuevo en cada render
    const tiene = logrosDe(profile, user);
    const nuevos = logrosPorRetos(hechas, total).filter((l) => !tiene.has(l));
    if (nuevos.length === 0) return;

    guardando.current = true;
    void desbloquearLogros(user.uid, nuevos)
      .catch(() => {})
      .finally(() => {
        guardando.current = false;
      });

    // se celebra el mejor de los nuevos
    const mejor = nuevos[nuevos.length - 1];
    if (!yaCelebrado(user.uid, mejor)) {
      marcarCelebrado(user.uid, mejor);
      setFiesta(mejor);
      if (mejor === "dorado") sfx.fanfarria();
      else sfx.sello();
    }
  }, [hechas, total, user, profile]);

  async function sellar(r: Recipe) {
    if (!user) return;
    const quitar = done.includes(r.id);
    setBusy(r.id);
    if (!quitar) sfx.sello();
    try {
      await toggleStamp(user.uid, r.id, !quitar);
    } catch {
      /* la regla puede rechazarlo */
    }
    setBusy(null);
  }

  async function ponerse(l: Logro) {
    if (!profile) return;
    await save({ ...profile, junimo: l });
    setFiesta(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="recipe-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="retos-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="recipe-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <header className="retos-head">
          {user && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="retos-juni" src={junimoSrc(profile?.junimo ?? "verde")} alt="" />
          )}
          <div>
            <h2 className="retos-title">⭐ Retos de cocina</h2>
            <p className="retos-sub">
              {user
                ? `${profile?.name ?? "Cocinero"}, sella cada receta que cocines`
                : "Entra con Google para sellar las recetas que cocines"}
            </p>
          </div>
        </header>

        {/* Junimos que se pueden ganar */}
        <div className="premios">
          <p className="premios-title">Junimos de recompensa</p>
          <ul className="premios-list">
            {ORDEN_LOGROS.map((l) => {
              const tengo = ganados.has(l);
              return (
                <li key={l} className={`premio ${tengo ? "is-won" : ""}`}>
                  <span className="premio-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={junimoSrc(l)} alt="" />
                    {!tengo && <span className="premio-lock">🔒</span>}
                  </span>
                  <span className="premio-txt">
                    <b>{LOGROS[l].nombre}</b>
                    <i>{tengo ? "¡Desbloqueado! Ya puedes llevarlo." : LOGROS[l].pista}</i>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {!user ? (
          <div className="soc-login">
            <button className="book-btn" onClick={signIn}>
              Entrar con Google
            </button>
          </div>
        ) : (
          <>
            <div className="retos-progress">
              <div className="retos-bar">
                <span style={{ width: `${pct}%` }} />
              </div>
              <p>
                <b>{hechas}</b> de {total} recetas selladas · {pct}%
              </p>
            </div>

            <ul className="retos-grid">
              {recipes.map((r) => {
                const hecha = done.includes(r.id);
                return (
                  <li key={r.id}>
                    <button
                      className={`reto ${hecha ? "is-done" : ""}`}
                      onClick={() => sellar(r)}
                      disabled={busy === r.id}
                      title={hecha ? "Quitar el sello" : "Sellar esta receta"}
                    >
                      <span className="reto-img">
                        {r.iconUrl || r.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.iconUrl || r.photoUrl} alt="" />
                        ) : (
                          <span className="rtile-empty">🍲</span>
                        )}
                        {hecha && <span className="reto-sello">✓ HECHA</span>}
                      </span>
                      <span className="reto-name">{r.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {completo && <p className="retos-win">🏆 ¡Habéis cocinado todo el libro!</p>}
          </>
        )}
      </motion.div>

      {/* ¡Fiesta! */}
      <AnimatePresence>
        {fiesta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fiesta-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            {fiesta === "dorado" && <Fireworks />}
            <motion.div
              className="fiesta-card"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="fiesta-juni" src={junimoSrc(fiesta)} alt="" />
              <h2>{fiesta === "dorado" ? "¡Libro completado!" : "¡Nuevo junimo!"}</h2>
              <p>
                {fiesta === "dorado" ? (
                  <>
                    Has cocinado todas las recetas del libro y desbloqueado el{" "}
                    <b>{LOGROS.dorado.nombre}</b>.
                  </>
                ) : (
                  <>
                    Has desbloqueado el <b>{LOGROS[fiesta].nombre}</b>.
                  </>
                )}
              </p>
              <div className="fiesta-actions">
                <button className="book-btn" onClick={() => ponerse(fiesta)}>
                  ✨ Ponérmelo ahora
                </button>
                <button className="book-btn book-btn-ghost" onClick={() => setFiesta(null)}>
                  Más tarde
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
