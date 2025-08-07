/**
 * CalendarContextProvider
 * 
 * Provides acess variables and functions to interact with the calendar
 * 
 * VARIABLES
 * calendarEventList: local version of database all calendar events, loads ONCE when the context is loaded
 * calendarEventTypes: local version of all calendar event types, set to default as ['General Event', 'Dining Event', 'To Do Item']
 * 
 * FUNCTIONS
 * createCalendarEvent: POSTS a calendar event to the db and updates local calendarEventList
 *                     @param newEvent: JSON dict following CalendarEvent model
 * editCalendarEvent: PATCHES a calendar event in db and replaces event in calendarEventList
 *                     @param updatedFields JSON dict following CalendarEvent model
 *                     @param id ID of the event to be patched
 * deleteCalendarEvent: DELETE a calendar event from db and from calendarEventList
 *                     @param id ID of event to be deleted
 */


import { createContext, useState, useEffect, useContext } from "react";
import { DishListContext } from "./DishListContext";
import { IngredientListContext } from "./IngredientListContext";

export const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    //=====================================
    //              Variabes
    //=====================================
    const [calendarEventList, setCalendarEventList] = useState([])
    const [calendarEventTypes, setCalendarEventTypes] = useState(['General Event', 'Dining Event', 'To Do Item'])

    const {
        fullDishList,
        setFullDishList,
        createDish,
        editDish,
        deleteDish
    } = useContext(DishListContext)

    const {
        fullIngredientList,
        setFullIngredientList,
        createIngredient,
        editIngredient,
        deleteIngredient
    } = useContext(IngredientListContext)



    //=====================================
    //              Functions
    //=====================================
    useEffect(() => {
        const fetchCalendarEvents = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/calendarEvents");
                const data = await res.json();
                setCalendarEventList(data);
            } catch (error) {
                console.error("Failed to fetch calendar events:", error);
            }
        };

        fetchCalendarEvents();
    }, []);

    useEffect(() => {

    })



    /**
     * createCalendarEvent
     * POSTS a calendar event to the db and updates local calendarEventList
     * 
     * @param {*} newEvent JSON dict following CalendarEvent model
     */
    const createCalendarEvent = async (newEvent) => {
        console.log("Create Event Triggered")
        try {
            const res = await fetch("http://localhost:4000/api/calendarEvents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent),
            });
            const savedEvent = await res.json();
            setCalendarEventList((prev) => [...prev, savedEvent]);
        } catch (error) {
            console.error("Failed to create calendar event:", error);
        }
    };


    /**
     * editCalendarEvent
     * PATCHES a calendar event in db and replaces event in calendarEventList
     * @param {*} id ID of the event to be patched
     * @param {*} updatedFields JSON dict following CalendarEvent model
     */
    const editCalendarEvent = async (id, updatedFields) => {
        const originalEvent = calendarEventList.find((event) => { return event._id === id })

        //If we are editing an event that repeats and it is not the base event (the start time is the same)
        if (originalEvent.repeat != "none") {

        }

        const areEqual = Object.keys(updatedFields).every(key => {
            return updatedFields[key] === originalEvent[key];
        });

        try {
            const res = await fetch(`http://localhost:4000/api/calendarEvents/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFields),
            });
            const updatedEvent = await res.json();
            setCalendarEventList((prev) =>
                prev.map((event) => (event._id === id ? updatedEvent : event))
            );
        } catch (error) {
            console.error("Failed to edit calendar event:", error);
        }
    };

    /**
     * deleteCalendarEvent
     * DELETE a calendar event from db and from calendarEventList
     * @param {*} id ID of event to be deleted
     */
    const deleteCalendarEvent = async (id) => {
        try {
            await fetch(`http://localhost:4000/api/calendarEvents/${id}`, {
                method: "DELETE",
            });
            setCalendarEventList((prev) => prev.filter((event) => event._id !== id));
        } catch (error) {
            console.error("Failed to delete calendar event:", error);
        }
    };

    const createVirtualEvent = (event) => {
        const virtualEvent = {
            ...event,
            isVirtual: true,
            _refid: event._id,
            _id: `${event._id}_ghost_${event.startDate}`
        };

        return virtualEvent;
    };

    const formatDateToYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const removeIngredientsOfEventFromStock = (event_id) => {
        const dishList = calendarEventList.find((event) => event._id === event_id)?.dishList;
        if (!dishList) return;

        dishList.forEach((dish_id) => {
            const dish = fullDishList.find((dish) => dish._id === dish_id);
            if (!dish) return;

            dish.ingredientList.forEach((ing_dict) => {
                const ingredient = fullIngredientList.find((ing) => ing._id === ing_dict.ingredient_id);
                if (!ingredient) return;

                const updatedIngredient = {
                    ...ingredient,
                    portionsAvaliable: ingredient.portionsAvaliable - ing_dict.amount,
                };

                editIngredient(ingredient._id, updatedIngredient);
            });
        });
    };




    //=====================================
    //              Return
    //=====================================

    return (
        <CalendarContext.Provider
            value={{
                calendarEventList,
                setCalendarEventList,
                calendarEventTypes,
                setCalendarEventTypes,
                createCalendarEvent,
                editCalendarEvent,
                deleteCalendarEvent,
                createVirtualEvent,
                formatDateToYYYMMDD,
                removeIngredientsOfEventFromStock,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};


/*
const{
    calendarEventList,
    setCalendarEventList,
    calendarEventTypes,
    setCalendarEventTypes,
    createCalendarEvent,
    editCalendarEvent,
    deleteCalendarEvent,
    createVirtualEvent,
    formatDateToYYYMMDD,
    removeIngredientsOfEventFromStock
} = useContext(CalendarContext)
*/