export interface Recipe {
  id: string;
  title: string;
  photoUrl: string;
  ingredients: string[];
  steps: string[];
  prepMinutes: number;
  category: string;
  rating: number;
}

export const EMPTY_RECIPE: Omit<Recipe, "id"> = {
  title: "",
  photoUrl: "",
  ingredients: [],
  steps: [],
  prepMinutes: 0,
  category: "",
  rating: 3,
};
