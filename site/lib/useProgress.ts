"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "gardariam_cocina_pasos_v1";

type ProgressMap = Record<string, number[]>; // recetaId -> índices completados

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as ProgressMap;
  } catch {
    return {};
  }
}

/** Progreso de pasos por receta, persistido en el dispositivo. */
export function useProgress(recipeId: string | null) {
  const [map, setMap] = useState<ProgressMap>({});

  useEffect(() => setMap(read()), []);

  const done = recipeId ? (map[recipeId] ?? []) : [];

  const toggle = useCallback(
    (index: number) => {
      if (!recipeId) return;
      setMap((prev) => {
        const cur = prev[recipeId] ?? [];
        const next = cur.includes(index)
          ? cur.filter((i) => i !== index)
          : [...cur, index];
        const out = { ...prev, [recipeId]: next };
        try {
          localStorage.setItem(KEY, JSON.stringify(out));
        } catch {}
        return out;
      });
    },
    [recipeId],
  );

  const reset = useCallback(() => {
    if (!recipeId) return;
    setMap((prev) => {
      const out = { ...prev, [recipeId]: [] };
      try {
        localStorage.setItem(KEY, JSON.stringify(out));
      } catch {}
      return out;
    });
  }, [recipeId]);

  return { done, toggle, reset };
}
