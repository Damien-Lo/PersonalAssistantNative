import React, { createContext, useState, useEffect } from "react";

//=================================================================
//              INTERFACES AND TYPES
//=================================================================
export interface Ingredient {
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
}

export type NewIngredient = Omit<Ingredient, "_id">;

interface IngredientListContextType {
  fullIngredientList: Ingredient[];
  setFullIngredientList: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  createIngredient: (newIngredient: NewIngredient) => Promise<void>;
  editIngredient: (
    id: string,
    updatedFields: Partial<Ingredient>
  ) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
}

//=================================================================
//              CONTEXTS
//=================================================================
export const IngredientListContext = createContext<IngredientListContextType>(
  {} as IngredientListContextType
);

//=================================================================
//              PROVIDER
//=================================================================
export const IngredientListProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  //=====================================
  //              Variables
  //=====================================
  const [fullIngredientList, setFullIngredientList] = useState<Ingredient[]>(
    []
  );

  //=====================================
  //              Functions
  //=====================================
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch("http://192.168.1.83:4000/api/ingredients");
        const data: Ingredient[] = await res.json();
        setFullIngredientList(data);
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      }
    };
    fetchIngredients();
  }, []);

  /**
   * createIngredient
   * POSTS a ingredient to the db and updates local fullIngredientList
   */
  const createIngredient = async (
    newIngredient: NewIngredient
  ): Promise<void> => {
    try {
      const res = await fetch("http://192.168.1.83:4000/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIngredient),
      });
      const savedIngredient: Ingredient = await res.json();
      setFullIngredientList((prev) => [...prev, savedIngredient]);
    } catch (error) {
      console.error("Failed to create ingredient:", error);
    }
  };

  /**
   * editIngredient
   * PATCHES an ingredient in db and replaces ingredient in fullIngredientList
   */
  const editIngredient = async (
    id: string,
    updatedFields: Partial<Ingredient>
  ): Promise<void> => {
    try {
      const res = await fetch(
        `http://192.168.1.83:4000/api/ingredients/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        }
      );
      const updatedIngredient: Ingredient = await res.json();
      setFullIngredientList((prev) =>
        prev.map((ing) => (ing._id === id ? updatedIngredient : ing))
      );
    } catch (error) {
      console.error("Failed to edit ingredient:", error);
    }
  };

  /**
   * deleteIngredient
   * DELETE a ingredient from db and from fullIngredientList
   */
  const deleteIngredient = async (id: string): Promise<void> => {
    try {
      await fetch(`http://192.168.1.83:4000/api/ingredients/${id}`, {
        method: "DELETE",
      });
      setFullIngredientList((prev) => prev.filter((ing) => ing._id !== id));
    } catch (error) {
      console.error("Failed to delete ingredient:", error);
    }
  };

  //=====================================
  //              Return
  //=====================================
  return (
    <IngredientListContext.Provider
      value={{
        fullIngredientList,
        setFullIngredientList,
        createIngredient,
        editIngredient,
        deleteIngredient,
      }}
    >
      {children}
    </IngredientListContext.Provider>
  );
};
