export interface Recipe {
  id: string;
  title: string;
  photoUrl: string; // ilustración de la tarjeta
  pages: string[]; // páginas ilustradas del libro (imágenes)
  category: string;
  rating: number;
  prepMinutes: number;
  persons: number;
  favorite: boolean;
  // Campos antiguos (compatibilidad; ya no se usan en la vista)
  ingredients?: string[];
  tools?: string[];
  steps?: string[];
}

export const EMPTY_RECIPE: Omit<Recipe, "id"> = {
  title: "",
  photoUrl: "",
  pages: [],
  category: "",
  rating: 5,
  prepMinutes: 30,
  persons: 2,
  favorite: false,
};

export interface Category {
  id: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "Entrantes", emoji: "🥗" },
  { id: "Carnes", emoji: "🍗" },
  { id: "Pasta", emoji: "🍝" },
  { id: "Arroces", emoji: "🥘" },
  { id: "Pescados", emoji: "🐟" },
  { id: "Vegetarianas", emoji: "🥦" },
  { id: "Postres", emoji: "🍰" },
  { id: "Desayunos", emoji: "🍳" },
  { id: "Salsas y bases", emoji: "🥣" },
  { id: "Bebidas", emoji: "🥤" },
];
