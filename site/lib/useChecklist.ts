"use client";

import { useCallback, useEffect, useState } from "react";

type Map = Record<string, number[]>;

function read(key: string): Map {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}") as Map;
  } catch {
    return {};
  }
}

/** Lista marcable por receta, guardada en el dispositivo. */
export function useChecklist(storageKey: string, recipeId: string | null) {
  const [map, setMap] = useState<Map>({});

  useEffect(() => setMap(read(storageKey)), [storageKey]);

  const done = recipeId ? (map[recipeId] ?? []) : [];

  const write = useCallback(
    (next: Map) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    },
    [storageKey],
  );

  const toggle = useCallback(
    (i: number) => {
      if (!recipeId) return;
      setMap((prev) => {
        const cur = prev[recipeId] ?? [];
        const next = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i];
        return write({ ...prev, [recipeId]: next });
      });
    },
    [recipeId, write],
  );

  const clear = useCallback(() => {
    if (!recipeId) return;
    setMap((prev) => write({ ...prev, [recipeId]: [] }));
  }, [recipeId, write]);

  return { done, toggle, clear };
}
