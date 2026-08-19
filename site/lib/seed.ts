import { RECIPE_PAGE } from "./book";
import type { Recipe } from "./types";

/** Iconos 1:1 disponibles (public/cocina/iconos/<id>.jpg) */
const HAS_ICON = new Set<string>([
  "panceta-puerros",
  "focaccia",
  "croquetas-cocido",
  "croquetas-rotini",
  "risotto",
  "lasana",
  "pollo-ajillo",
  "pollo-curry",
  "lentejas-curry",
  "arroz-horno",
  "paella",
  "brioche",
  "tortilla-caramelizada",
  "brownie",
  "tarta-coulant",
  "tarta-queso",
  "cookies",
  "salsa-ajoyaki",
]);

/** Recetas del libro (páginas ilustradas ya finales). Se muestran siempre;
 *  cualquier edición del admin (Firestore) con el mismo id las sobrescribe. */
interface Seed {
  id: string;
  title: string;
  category: string;
  prepMinutes: number;
  persons: number;
  pages2: boolean;
  /** orden en la lista cuando no tiene página propia (permite decimales) */
  orden?: number;
  /** páginas del libro a mostrar, si no son las suyas propias */
  paginas?: string[];
}

const S: Seed[] = [
  { id: "panceta-puerros", title: "Pan Ceporros", category: "Entrantes", prepMinutes: 90, persons: 4, pages2: false },
  { id: "focaccia", title: "Focacciamo", category: "Entrantes", prepMinutes: 90, persons: 4, pages2: true },
  { id: "croquetas-cocido", title: "Croquetas de Cocido", category: "Entrantes", prepMinutes: 60, persons: 4, pages2: true },
  { id: "croquetas-rotini", title: "Croquetini Rotini", category: "Entrantes", prepMinutes: 45, persons: 2, pages2: true },
  { id: "risotto", title: "Risotto a la Milanesa", category: "Arroces", prepMinutes: 35, persons: 2, pages2: false },
  { id: "lasana", title: "Lasaña Deconstruida", category: "Pasta", prepMinutes: 60, persons: 4, pages2: true },
  { id: "pollo-ajillo", title: "Pollo al Ajillo", category: "Carnes", prepMinutes: 35, persons: 6, pages2: true },
  { id: "pollo-curry", title: "Pollo al Curry", category: "Carnes", prepMinutes: 35, persons: 2, pages2: true },
  { id: "lentejas-curry", title: "Lentejas al Curry", category: "Vegetarianas", prepMinutes: 40, persons: 4, pages2: true },
  { id: "arroz-horno", title: "Arroz al Horno", category: "Arroces", prepMinutes: 60, persons: 4, pages2: true },
  { id: "paella", title: "Paella Valenciana", category: "Arroces", prepMinutes: 70, persons: 6, pages2: true },
  { id: "brioche", title: "Brioche de Costillas", category: "Carnes", prepMinutes: 120, persons: 8, pages2: true },
  { id: "tortilla-caramelizada", title: "Tortilla de Cebolla Caramelizada", category: "Entrantes", prepMinutes: 150, persons: 6, pages2: true },
  { id: "brownie", title: "Brownie Express", category: "Postres", prepMinutes: 5, persons: 1, pages2: false },
  { id: "tarta-coulant", title: "Tarta Coulant", category: "Postres", prepMinutes: 50, persons: 6, pages2: true },
  { id: "tarta-queso", title: "Tarta de Queso de Mery", category: "Postres", prepMinutes: 60, persons: 8, pages2: true },
  { id: "cookies", title: "Cookies Blanditas", category: "Postres", prepMinutes: 30, persons: 4, pages2: true },
  // La salsa vive dentro de la página del Brioche, pero tiene ficha propia
  {
    id: "salsa-ajoyaki",
    title: "Salsa Ajoyaki",
    category: "Salsas y bases",
    prepMinutes: 45,
    persons: 4,
    pages2: false,
    orden: 26.5,
    paginas: ["/cocina/paginas/brioche-1.jpg"],
  },
];

/** Orden = el mismo que en el libro físico (por número de página) */
const posicion = (r: Seed) => r.orden ?? RECIPE_PAGE[r.id] ?? 999;
const BOOK_ORDER: string[] = [...S].sort((a, b) => posicion(a) - posicion(b)).map((r) => r.id);

export const SEED_RECIPES: Recipe[] = S.map((r) => ({
  id: r.id,
  title: r.title,
  photoUrl: r.paginas ? `/cocina/iconos/${r.id}.jpg` : `/cocina/paginas/${r.id}-card.jpg`,
  iconUrl: HAS_ICON.has(r.id) ? `/cocina/iconos/${r.id}.jpg` : "",
  bookPage: RECIPE_PAGE[r.id] ?? (r.orden !== undefined ? Math.floor(r.orden) : undefined),
  sortIndex: BOOK_ORDER.indexOf(r.id),
  pages:
    r.paginas ??
    (r.pages2
      ? [`/cocina/paginas/${r.id}-0.jpg`, `/cocina/paginas/${r.id}-1.jpg`]
      : [`/cocina/paginas/${r.id}-0.jpg`]),
  category: r.category,
  rating: 5,
  prepMinutes: r.prepMinutes,
  persons: r.persons,
  favorite: false,
}));
