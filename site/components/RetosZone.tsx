"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { junimoSrc, toggleStamp, useProfile, watchMyStamps } from "@/lib/profile";
import { sfx } from "@/lib/sfx";
import type { Recipe } from "@/lib/types";

interface Props {
  recipes: Recipe[];
  onClose: () => void;
}

export default function RetosZone({ recipes, onClose }: Props) {
  const { user, signIn } = useAuth();
  const { profile } = useProfile();
  const [done, setDone] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setDone([]);
      return;
    }
    return watchMyStamps(user.uid, setDone);
  }, [user]);

  async function sellar(r: Recipe) {
    if (!user) return;
    setBusy(r.id);
    if (!done.includes(r.id)) sfx.sello();
    try {
      await toggleStamp(user.uid, r.id, !done.includes(r.id));
    } catch {
      /* la regla puede rechazarlo */
    }
    setBusy(null);
  }

  const total = recipes.length;
  const hechas = done.length;
  const pct = total ? Math.round((hechas / total) * 100) : 0;

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

            {hechas === total && total > 0 && (
              <p className="retos-win">🏆 ¡Habéis cocinado todo el libro!</p>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
