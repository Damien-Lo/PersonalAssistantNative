import { Ingredient, IngredientEntry } from "../ingredients/IngredientTypes";

export type Dish = {
  _id: string;
  name: string;
  description: string | null;
  category: string;
  meals: string[];
  ingredientsList: IngredientEntry[];
  recipe: string | null;
  restaurant: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  fiber: number | null;
  sodium: number | null;
};

export type NewDish = Omit<Dish, "_id">;

export type DishByCategory = Record<string, Dish[]>;
