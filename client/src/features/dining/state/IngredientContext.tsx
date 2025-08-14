import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "../../auth/state/AuthContext";
import {
  Ingredient,
  NewIngredient,
} from "../../../domain/ingredients/IngredientTypes";

//=================================================================
//              INTERFACES AND TYPES
//=================================================================

export type IngredientContextType = {
  fullIngredientList: Ingredient[];
  setFullIngredientList: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  createIngredient: (newIngredient: NewIngredient) => Promise<void>;
  editIngredient: (
    id: string,
    updatedFields: Partial<Ingredient>
  ) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
};

//=================================================================
//              CONTEXTS
//=================================================================
export const IngredientContext = createContext<IngredientContextType>(
  {} as IngredientContextType
);

//=================================================================
//              PROVIDER
//=================================================================
export const IngredientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  //=====================================
  //              Variables
  //=====================================
  const [fullIngredientList, setFullIngredientList] = useState<Ingredient[]>(
    []
  );

  const { user, authFetch } = useAuth();

  //=====================================
  //              Functions
  //=====================================
  useEffect(() => {
    if (!user) {
      setFullIngredientList([]);
      return;
    }

    let alive = true;
    (async () => {
      const res = await authFetch("/api/ingredients");
      const data = res.ok ? await res.json() : [];
      if (alive) setFullIngredientList(data);
    })();

    return () => {
      alive = false;
    };
  }, [user?.id]);

  /**
   * createIngredient
   * POSTS a ingredient to the db and updates local fullIngredientList
   */
  const createIngredient = async (
    newIngredient: NewIngredient
  ): Promise<void> => {
    try {
      const res = await authFetch("/api/ingredients", {
        method: "POST",
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
      const res = await authFetch(`/api/ingredients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      const updatedIngredient = await res.json();
      console.log("Retrieved Updated Ingredient:");
      console.log(updatedIngredient);
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
      await authFetch(`/api/ingredients/${id}`, {
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
    <IngredientContext.Provider
      value={{
        fullIngredientList,
        setFullIngredientList,
        createIngredient,
        editIngredient,
        deleteIngredient,
      }}
    >
      {children}
    </IngredientContext.Provider>
  );
};
