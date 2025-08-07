import { createContext, useState, useEffect } from "react";

export const IngredientListContext = createContext();

export const IngredientListProvider = ({ children }) => {
    //=====================================
    //              Variabes
    //=====================================
    const [fullIngredientList, setFullIngredientList] = useState([]);


    //=====================================
    //              Functions
    //=====================================
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/ingredients");
                const data = await res.json();
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
     * 
     * @param {*} newIngredient JSON dict following Ingredient model
     */
    const createIngredient = async (newIngredient) => {
        try {
            const res = await fetch("http://localhost:4000/api/ingredients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newIngredient),
            });
            const savedIngredient = await res.json();
            setFullIngredientList((prev) => [...prev, savedIngredient]);
        } catch (error) {
            console.error("Failed to create ingredient:", error);
        }
    };


    /**
     * editIngredient
     * PATCHES an ingredient in db and replaces ingredient in fullIngredientList
     * @param {*} id ID of the ingredient to be patched
     * @param {*} updatedFields JSON dict following Ingredient model
     */
    const editIngredient = async (id, updatedFields) => {
        try {
            const res = await fetch(`http://localhost:4000/api/ingredients/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFields),
            });
            const updatedIngredient = await res.json();
            setFullIngredientList((prev) =>
                prev.map((ing) => (ing._id === id ? updatedIngredient : ing))
            );
        } catch (error) {
            console.error("Failed to edit ingredient:", error);
        }
    };

    /**
     * deleteIngredient
     * DELETE a ingredeint from db and from fullIngredientList
     * @param {*} id ID of ingredient to be deleted
     */
    const deleteIngredient = async (id) => {
        try {
            await fetch(`http://localhost:4000/api/ingredients/${id}`, {
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
            }}>
            {children}
        </IngredientListContext.Provider>
    );
};



/**
const{
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient
} = useContext(IngredientListContext)
 */