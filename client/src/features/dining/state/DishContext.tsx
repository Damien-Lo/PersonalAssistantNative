import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../../auth/state/AuthContext";
import {
  Ingredient,
  NewIngredient,
} from "../../../domain/ingredients/IngredientTypes";
import { Dish, NewDish } from "../../../domain/dishes/DishTypes";

//=================================================================
//              INTERFACES AND TYPES
//=================================================================

interface DishContextType {
  fullDishList: Dish[];
  setFullDishList: React.Dispatch<React.SetStateAction<Dish[]>>;
  createDish: (newDish: NewDish) => Promise<void>;
  editDish: (id: string, updatedFields: Partial<Dish>) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
  updateDishesWithIngredient: (
    ingredient_id: string,
    updatedIngredient: NewIngredient
  ) => void;
  deleteDishesWithIngredient: (ingredient_id: string) => void;
  calculateNutrition: (
    ingredientList: { amount: number; ingredientObject: Ingredient }[]
  ) => {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sodium: number;
  };
}

//=================================================================
//              CONTEXTS
//=================================================================
export const DishContext = createContext<DishContextType>(
  {} as DishContextType
);

//=================================================================
//              PROVIDER
//=================================================================
export const DishProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  //=====================================
  //              Variabes
  //=====================================
  const [fullDishList, setFullDishList] = useState<Dish[]>([]);
  const { user, authFetch } = useAuth();

  //=====================================
  //              Functions
  //=====================================
  useEffect(() => {
    if (!user) {
      setFullDishList([]);
      return;
    }

    let alive = true;
    (async () => {
      const res = await authFetch("/api/dishes/");
      const data = res.ok ? await res.json() : [];
      if (alive) setFullDishList(data);
    })();

    return () => {
      alive = false;
    };
  }, [user?.id]);

  /**
   * createDish
   * POSTS a dish to the db and updates local fullDishList
   *
   * @param {*} newDish JSON dict following Dish model
   */
  const createDish = async (newDish: NewDish): Promise<void> => {
    try {
      const res = await authFetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDish),
      });
      const savedDish: Dish = await res.json();
      setFullDishList((prev) => [...prev, savedDish]);
    } catch (error) {
      console.error("Failed to create dish:", error);
    }
  };

  /**
   * editDish
   * PATCHES a dish in db and replaces dish in fullDishList
   * @param {*} id ID of the dish to be patched
   * @param {*} updatedFields JSON dict following Dish model
   */
  const editDish = async (id: string, updatedFields: Partial<Dish>) => {
    try {
      const res = await authFetch(`/api/dishes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      const updatedDish = await res.json();
      setFullDishList((prev) =>
        prev.map((d) => (d._id === id ? updatedDish : d))
      );
    } catch (error) {
      console.error("Failed to edit dish:", error);
    }
  };

  /**
   * deleteDish
   * DELETE a dish from db and from fullDishList
   * @param {*} id ID of dish to be deleted
   */
  const deleteDish = async (id: string) => {
    try {
      await authFetch(`/api/dishes/${id}`, {
        method: "DELETE",
      });
      setFullDishList((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Failed to delete dish:", error);
    }
  };

  const updateDishesWithIngredient = (
    ingredient_id: string,
    updatedIngredient: NewIngredient
  ) => {
    // const changedDishes = [];
    setFullDishList((prev) =>
      prev.map((dish) => {
        const usesIngredient = dish.ingredientsList.some(
          (entry) => entry.ingredientObject._id === ingredient_id
        );
        if (!usesIngredient) return dish;

        const newIngredientList = dish.ingredientsList.map((entry) =>
          entry.ingredientObject._id === ingredient_id
            ? {
                ...entry,
                ingredientObject: {
                  ...updatedIngredient,
                  _id: ingredient_id,
                },
              }
            : entry
        );

        const newDish = {
          ...dish,
          ...calculateNutrition(newIngredientList),
          ingredientsList: newIngredientList,
        };

        //Update Backend Too
        editDish(newDish._id, newDish);
        // changedDishes.push(newDish);
        return newDish;
      })
    );
  };

  const deleteDishesWithIngredient = (ingredient_id: string) => {
    // const changedDishes = [];
    setFullDishList((prev) =>
      prev.map((dish) => {
        const usesIngredient = dish.ingredientsList.some(
          (entry) => entry.ingredientObject._id === ingredient_id
        );
        if (!usesIngredient) return dish;

        const newIngredientList = dish.ingredientsList.filter((entry) => {
          return entry.ingredientObject._id !== ingredient_id;
        });

        const newDish = {
          ...dish,
          ...calculateNutrition(newIngredientList),
          ingredientsList: newIngredientList,
        };

        //Update Backend Too
        editDish(newDish._id, newDish);
        // changedDishes.push(newDish);
        return newDish;
      })
    );
  };

  const calculateNutrition = (
    ingredientList: { amount: number; ingredientObject: Ingredient }[]
  ) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalFiber = 0;
    let totalSodium = 0;

    for (const ingredientEntry of ingredientList) {
      totalCalories +=
        (ingredientEntry.ingredientObject.calories || 0) *
        ingredientEntry.amount;
      totalProtein +=
        (ingredientEntry.ingredientObject.protein || 0) *
        ingredientEntry.amount;
      totalCarbs +=
        (ingredientEntry.ingredientObject.carbs || 0) * ingredientEntry.amount;
      totalFats +=
        (ingredientEntry.ingredientObject.fats || 0) * ingredientEntry.amount;
      totalFiber +=
        (ingredientEntry.ingredientObject.fiber || 0) * ingredientEntry.amount;
      totalSodium +=
        (ingredientEntry.ingredientObject.sodium || 0) * ingredientEntry.amount;
    }

    return {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats,
      fiber: totalFiber,
      sodium: totalSodium,
    };
  };

  //=====================================
  //              Return
  //=====================================
  return (
    <DishContext.Provider
      value={{
        fullDishList,
        setFullDishList,
        createDish,
        editDish,
        deleteDish,
        updateDishesWithIngredient,
        calculateNutrition,
        deleteDishesWithIngredient,
      }}
    >
      {children}
    </DishContext.Provider>
  );
};

/**
const{
    fullDishList,
    setFullDishList,
    createDish,
    editDish,
    deleteDish,
    updateDishesWithIngredient,
    calculateNutrition,
    deleteDishesWithIngredient,
} = useContext(DishListContext)
 */
