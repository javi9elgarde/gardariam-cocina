/** Libro completo: 40 páginas renderizadas en /cocina/libro/NN.jpg */

export const BOOK_PAGES = 40;

export function pageSrc(i: number): string {
  return `/cocina/libro/${String(i).padStart(2, "0")}.jpg`;
}

/** Versión de alta resolución (1791×2494), se carga solo al ampliar */
export function pageSrcHD(i: number): string {
  return `/cocina/libro-hd/${String(i).padStart(2, "0")}.jpg`;
}

export const COVER_SRC = "/cocina/portada.jpg";
export const COVER_SRC_HD = "/cocina/libro-hd/portada.jpg";

export interface BookSection {
  id: string;
  label: string;
  emoji: string;
  page: number;
}

export const BOOK_SECTIONS: BookSection[] = [
  { id: "portada", label: "Portada", emoji: "📖", page: 0 },
  { id: "indice", label: "Índice", emoji: "🔖", page: 3 },
  { id: "entrantes", label: "Entrantes", emoji: "🥗", page: 4 },
  { id: "principales", label: "Principales", emoji: "🍗", page: 12 },
  { id: "postres", label: "Postres", emoji: "🍰", page: 30 },
  { id: "retos", label: "Retos", emoji: "⭐", page: 39 },
];

/** ¿qué receta se está viendo en estas páginas? (para la ficha resumen) */
export function recipeIdForPage(...pages: number[]): string | null {
  const entries = Object.entries(RECIPE_PAGE).sort((a, b) => b[1] - a[1]);
  for (const p of pages) {
    const hit = entries.find(([, start]) => p === start || p === start + 1);
    if (hit) return hit[0];
  }
  return null;
}

/** receta -> primera página en el libro */
export const RECIPE_PAGE: Record<string, number> = {
  "panceta-puerros": 5,
  focaccia: 6,
  "croquetas-cocido": 8,
  "croquetas-rotini": 10,
  risotto: 13,
  lasana: 14,
  "pollo-ajillo": 16,
  "pollo-curry": 18,
  "lentejas-curry": 20,
  "arroz-horno": 22,
  paella: 24,
  brioche: 26,
  "tortilla-caramelizada": 28,
  brownie: 31,
  "tarta-coulant": 32,
  "tarta-queso": 34,
  cookies: 36,
};
