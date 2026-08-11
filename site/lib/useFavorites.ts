"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "gardariam_cocina_favoritas_v1";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

/**
 * Favoritas por dispositivo (localStorage).
 * Los invitados no pueden escribir en Firestore (solo el admin), así que
 * cada persona guarda sus propias favoritas en su móvil/ordenador.
 */
export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => setFavs(read()), []);

  const isFav = useCallback((id: string) => favs.includes(id), [favs]);

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { favs, isFav, toggle };
}
