import { createContext, useState, useEffect, useContext } from "react";

export const DishListContext = createContext();

export const DishListProvider = ({ children }) => {

    //=====================================
    //              Variabes
    //=====================================
    const [fullDishList, setFullDishList] = useState([]);

    //=====================================
    //              Functions
    //=====================================
    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/dishes");
                const data = await res.json();
                setFullDishList(data);
            } catch (error) {
                console.error("Failed to fetch dishes:", error);
            }
        };
        fetchDishes();
    }, []);



    /**
     * createDish
     * POSTS a dish to the db and updates local fullDishList
     * 
     * @param {*} newDish JSON dict following Dish model
     */
    const createDish = async (newDish) => {
        try {
            const res = await fetch("http://localhost:4000/api/dishes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDish),
            });
            const savedDish = await res.json();
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
    const editDish = async (id, updatedFields) => {
        try {
            const res = await fetch(`http://localhost:4000/api/dishes/${id}`, {
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
    const deleteDish = async (id) => {
        try {
            await fetch(`http://localhost:4000/api/dishes/${id}`, {
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
            }}>
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