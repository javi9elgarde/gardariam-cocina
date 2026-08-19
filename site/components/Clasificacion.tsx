"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  junimoSrc,
  ocultarAdminsEnClasificacion,
  useProfile,
  watchAllProfiles,
  watchAllStamps,
  type Profile,
  type Stamp,
} from "@/lib/profile";
import type { Recipe } from "@/lib/types";

interface Props {
  recipes: Recipe[];
  onClose: () => void;
}

interface Fila {
  uid: string;
  name: string;
  junimo: string;
  hechas: number;
}

const MEDALLAS = ["🥇", "🥈", "🥉"];

export default function Clasificacion({ recipes, onClose }: Props) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [stamps, setStamps] = useState<Stamp[] | null>(null);
  const [perfiles, setPerfiles] = useState<Record<string, Profile>>({});

  useEffect(() => watchAllStamps(setStamps), []);
  useEffect(() => watchAllProfiles(setPerfiles), []);

  const total = recipes.length;
  const idsValidos = new Set(recipes.map((r) => r.id));
  // hasta la boda, Mery y Javi salen en la tabla para poder probarla
  const sinAdmins = ocultarAdminsEnClasificacion();

  // se agrupa por persona; el nombre y el junimo vienen en el propio sello
  const porUid = new Map<string, Fila>();
  for (const s of stamps ?? []) {
    if (!idsValidos.has(s.recipeId)) continue;
    const fila = porUid.get(s.uid) ?? {
      uid: s.uid,
      name: s.name?.trim() || "Cocinero",
      junimo: s.junimo || "verde",
      hechas: 0,
    };
    // el sello más reciente manda para el nombre
    if (s.name?.trim()) fila.name = s.name.trim();
    if (s.junimo) fila.junimo = s.junimo;
    fila.hechas += 1;
    porUid.set(s.uid, fila);
  }

  // el perfil manda sobre lo copiado en el sello, que puede ser antiguo
  for (const [uid, fila] of porUid) {
    const perfil = uid === user?.uid ? (profile ?? perfiles[uid]) : perfiles[uid];
    if (perfil?.name) fila.name = perfil.name;
    if (perfil?.junimo) fila.junimo = perfil.junimo;
    if (sinAdmins && perfil?.admin) porUid.delete(uid);
  }

  const filas = [...porUid.values()].sort(
    (a, b) => b.hechas - a.hechas || a.name.localeCompare(b.name),
  );

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
          <div>
            <h2 className="retos-title">📊 Clasificación</h2>
            <p className="retos-sub">Quién lleva más recetas del libro cocinadas</p>
          </div>
        </header>

        {stamps === null ? (
          <p className="clas-vacia">Cargando…</p>
        ) : filas.length === 0 ? (
          <p className="clas-vacia">
            Todavía no ha sellado nadie. ¡Sé el primero desde <b>Retos</b>!
          </p>
        ) : (
          <ol className="clas-list">
            {filas.map((f, i) => {
              const pct = total ? Math.round((f.hechas / total) * 100) : 0;
              return (
                <li
                  key={f.uid}
                  className={`clas-fila ${f.uid === user?.uid ? "is-yo" : ""} ${
                    i < 3 ? "is-podio" : ""
                  }`}
                >
                  <span className="clas-puesto">{MEDALLAS[i] ?? i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="clas-juni" src={junimoSrc(f.junimo)} alt="" />
                  <span className="clas-datos">
                    <b>
                      {f.name}
                      {f.uid === user?.uid && <i> (tú)</i>}
                    </b>
                    <span className="clas-bar">
                      <span style={{ width: `${pct}%` }} />
                    </span>
                  </span>
                  <span className="clas-num">
                    <b>{f.hechas}</b>
                    <i>de {total}</i>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </motion.div>
    </motion.div>
  );
}
