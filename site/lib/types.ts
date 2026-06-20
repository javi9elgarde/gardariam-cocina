export interface Recipe {
  id: string;
  title: string;
  photoUrl: string;
  ingredients: string[];
  tools: string[];
  steps: string[];
  prepMinutes: number;
  category: string;
  rating: number;
}

export const EMPTY_RECIPE: Omit<Recipe, "id"> = {
  title: "",
  photoUrl: "",
  ingredients: [],
  tools: [],
  steps: [],
  prepMinutes: 0,
  category: "",
  rating: 3,
};
