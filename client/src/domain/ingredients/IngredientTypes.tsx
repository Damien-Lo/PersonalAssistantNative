export type Ingredient = {
  _id: string;
  name: string;
  description: string;
  category: string;
  expiryDate: Date | null;
  brand: string;
  portionsAvaliable: number | null;
  portionUnit: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodium: number;
};

export type NewIngredient = Omit<Ingredient, "_id">;

export type IngredientEntry = {
  amount: number;
  ingredientObject: Ingredient;
};
