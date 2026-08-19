"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Fireworks from "@/components/Fireworks";
import { useAuth } from "@/lib/auth";
import {
  JUNIMO_DORADO,
  desbloquearDorado,
  junimoSrc,
  toggleStamp,
  useProfile,
  watchMyStamps,
} from "@/lib/profile";
import { watchMyProof, type Prueba } from "@/lib/social";
import { sfx } from "@/lib/sfx";
import type { Recipe } from "@/lib/types";

interface Props {
  recipes: Recipe[];
  onClose: () => void;
}

/** para no repetir la fiesta cada vez que se abre la ventana */
const YA_CELEBRADO = "gardariam_dorado_celebrado";

export default function RetosZone({ recipes, onClose }: Props) {
  const { user, signIn } = useAuth();
  const { profile, save } = useProfile();
  const [done, setDone] = useState<string[]>([]);
  const [pruebas, setPruebas] = useState<Record<string, Prueba>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [fiesta, setFiesta] = useState(false);
  const celebrado = useRef(false);

  useEffect(() => {
    if (!user) {
      setDone([]);
      setPruebas({});
      return;
    }
    const a = watchMyStamps(user.uid, setDone);
    const b = watchMyProof(user.uid, setPruebas);
    return () => {
      a();
      b();
    };
  }, [user]);

  const total = recipes.length;
  const hechas = done.filter((id) => recipes.some((r) => r.id === id)).length;
  const pct = total ? Math.round((hechas / total) * 100) : 0;
  const completo = total > 0 && hechas === total;

  /* Al completarlo todo: desbloquear el dorado y montar la fiesta (una vez) */
  useEffect(() => {
    if (!user || !completo || celebrado.current) return;
    celebrado.current = true;
    void desbloquearDorado(user.uid).catch(() => {});
    if (localStorage.getItem(YA_CELEBRADO) === user.uid) return;
    localStorage.setItem(YA_CELEBRADO, user.uid);
    setFiesta(true);
    sfx.fanfarria();
  }, [completo, user]);

  function queFalta(id: string): string | null {
    const p = pruebas[id];
    if (p?.comentario && p?.foto) return null;
    if (!p?.foto && !p?.comentario) return "Sube una foto y deja un comentario en la receta";
    if (!p?.foto) return "Te falta subir tu foto en la receta";
    return "Te falta dejar tu comentario en la receta";
  }

  async function sellar(r: Recipe) {
    if (!user) return;
    const quitar = done.includes(r.id);
    const falta = queFalta(r.id);
    if (!quitar && falta) {
      setAviso(`${r.title}: ${falta}.`);
      return;
    }
    setAviso(null);
    setBusy(r.id);
    if (!quitar) sfx.sello();
    try {
      await toggleStamp(user.uid, r.id, !quitar);
    } catch {
      /* la regla puede rechazarlo */
    }
    setBusy(null);
  }

  async function ponerseDorado() {
    if (!profile) return;
    await save({ name: profile.name, junimo: JUNIMO_DORADO, dorado: true });
    setFiesta(false);
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

        {/* La recompensa, siempre visible arriba */}
        <div className={`retos-premio ${profile?.dorado ? "is-won" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={junimoSrc(JUNIMO_DORADO)} alt="" />
          <div>
            <b>Junimo dorado</b>
            <p>
              {profile?.dorado
                ? "¡Desbloqueado! Ya puedes llevarlo en tu perfil."
                : "Completa todos los retos del libro y lo desbloquearás para tu perfil."}
            </p>
          </div>
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

            <p className="retos-reglas">
              Para sellar una receta hay que <b>subir tu foto</b> y <b>dejar un comentario</b> en
              ella. Así el sello vale de verdad 😉
            </p>

            {aviso && <p className="retos-aviso">⚠️ {aviso}</p>}

            <ul className="retos-grid">
              {recipes.map((r) => {
                const hecha = done.includes(r.id);
                const falta = queFalta(r.id);
                const p = pruebas[r.id];
                return (
                  <li key={r.id}>
                    <button
                      className={`reto ${hecha ? "is-done" : ""} ${
                        !hecha && falta ? "is-locked" : ""
                      }`}
                      onClick={() => sellar(r)}
                      disabled={busy === r.id}
                      title={hecha ? "Quitar el sello" : (falta ?? "Sellar esta receta")}
                    >
                      <span className="reto-img">
                        {r.iconUrl || r.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.iconUrl || r.photoUrl} alt="" />
                        ) : (
                          <span className="rtile-empty">🍲</span>
                        )}
                        {hecha && <span className="reto-sello">✓ HECHA</span>}
                        {!hecha && falta && <span className="reto-lock">🔒</span>}
                      </span>
                      <span className="reto-name">{r.title}</span>
                      {!hecha && (
                        <span className="reto-prueba">
                          <i className={p?.foto ? "ok" : ""}>📷</i>
                          <i className={p?.comentario ? "ok" : ""}>💬</i>
                        </span>
                      )}
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
            <Fireworks />
            <motion.div
              className="fiesta-card"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="fiesta-juni" src={junimoSrc(JUNIMO_DORADO)} alt="" />
              <h2>¡Libro completado!</h2>
              <p>
                Has cocinado y demostrado <b>las {total} recetas</b> del libro. Has desbloqueado el{" "}
                <b>Junimo Dorado</b>.
              </p>
              <div className="fiesta-actions">
                <button className="book-btn" onClick={ponerseDorado}>
                  ✨ Ponérmelo ahora
                </button>
                <button className="book-btn book-btn-ghost" onClick={() => setFiesta(false)}>
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
