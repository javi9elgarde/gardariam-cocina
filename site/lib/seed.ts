import type { Recipe } from "./types";

/** Recetas del libro (páginas ilustradas ya finales). Se muestran siempre;
 *  cualquier edición del admin (Firestore) con el mismo id las sobrescribe. */
interface Seed {
  id: string;
  title: string;
  category: string;
  prepMinutes: number;
  persons: number;
  pages2: boolean;
}

const S: Seed[] = [
  { id: "panceta-puerros", title: "Panceta con Puerros", category: "Entrantes", prepMinutes: 45, persons: 4, pages2: false },
  { id: "focaccia", title: "Focaccia", category: "Entrantes", prepMinutes: 90, persons: 4, pages2: true },
  { id: "croquetas-cocido", title: "Croquetas de Cocido", category: "Entrantes", prepMinutes: 60, persons: 4, pages2: true },
  { id: "croquetas-rotini", title: "Croquetini Rotini", category: "Entrantes", prepMinutes: 45, persons: 2, pages2: true },
  { id: "risotto", title: "Risotto", category: "Arroces", prepMinutes: 35, persons: 2, pages2: false },
  { id: "lasana", title: "Lasaña Deconstruida", category: "Pasta", prepMinutes: 60, persons: 4, pages2: true },
  { id: "pollo-ajillo", title: "Pollo al Ajillo", category: "Carnes", prepMinutes: 35, persons: 6, pages2: true },
  { id: "pollo-curry", title: "Pollo al Curry", category: "Carnes", prepMinutes: 35, persons: 2, pages2: true },
  { id: "lentejas-curry", title: "Lentejas al Curry", category: "Vegetarianas", prepMinutes: 40, persons: 4, pages2: true },
  { id: "arroz-horno", title: "Arroz al Horno", category: "Arroces", prepMinutes: 60, persons: 4, pages2: true },
  { id: "paella", title: "Paella", category: "Arroces", prepMinutes: 50, persons: 4, pages2: true },
  { id: "brioche", title: "Brioche", category: "Desayunos", prepMinutes: 120, persons: 6, pages2: true },
  { id: "tortilla-caramelizada", title: "Tortilla de Cebolla Caramelizada", category: "Entrantes", prepMinutes: 40, persons: 4, pages2: true },
  { id: "brownie", title: "Brownie", category: "Postres", prepMinutes: 40, persons: 6, pages2: false },
  { id: "tarta-coulant", title: "Tarta Coulant", category: "Postres", prepMinutes: 30, persons: 4, pages2: true },
  { id: "tarta-queso", title: "Tarta de Queso Mery", category: "Postres", prepMinutes: 60, persons: 6, pages2: true },
  { id: "cookies", title: "Cookies de Chocolate", category: "Postres", prepMinutes: 30, persons: 4, pages2: true },
];

export const SEED_RECIPES: Recipe[] = S.map((r) => ({
  id: r.id,
  title: r.title,
  photoUrl: `/cocina/paginas/${r.id}-card.jpg`,
  pages: r.pages2
    ? [`/cocina/paginas/${r.id}-0.jpg`, `/cocina/paginas/${r.id}-1.jpg`]
    : [`/cocina/paginas/${r.id}-0.jpg`],
  category: r.category,
  rating: 5,
  prepMinutes: r.prepMinutes,
  persons: r.persons,
  favorite: false,
}));
