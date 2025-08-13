import React, { createContext, useState, useEffect } from "react";
import { Ingredient } from "./IngredientListContext";
import { useAuth } from "./AuthContext";

//=================================================================
//              INTERFACES AND TYPES
//=================================================================
export interface Dish {
  _id: string;
  name: string;
  description: string | null;
  category: string;
  meals: string[];
  ingredientsList: {
    ingredientObject: Ingredient;
    amount: number;
  }[];
  recipe: string | null;
  restaurant: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  fiber: number | null;
  sodium: number | null;
}

export type NewDish = Omit<Dish, "_id">;

interface DishListContextType {
  fullDishList: Dish[];
  setFullDishList: React.Dispatch<React.SetStateAction<Dish[]>>;
  createDish: (newDish: NewDish) => Promise<void>;
  editDish: (id: string, updatedFields: Partial<Dish>) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
}

//=================================================================
//              CONTEXTS
//=================================================================
export const DishListContext = createContext<DishListContextType>(
  {} as DishListContextType
);

//=================================================================
//              PROVIDER
//=================================================================
export const DishListProvider: React.FC<React.PropsWithChildren> = ({
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
      const res = await authFetch("/api/dishes");
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

  //=====================================
  //              Return
  //=====================================
  return (
    <DishListContext.Provider
      value={{
        fullDishList,
        setFullDishList,
        createDish,
        editDish,
        deleteDish,
      }}
    >
      {children}
    </DishListContext.Provider>
  );
};

/**
const{
    fullDishList,
    setFullDishList,
    createDish,
    editDish,
    deleteDish
} = useContext(DishListContext)
 */
