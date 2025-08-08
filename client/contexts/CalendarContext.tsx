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
import { Dish, DishListContext } from "./DishListContext";
import { Ingredient, IngredientListContext } from "./IngredientListContext";

//=================================================================
//              INTERFACES AND TYPES
//=================================================================
export interface CalendarEvent {
  _id: string;
  isRenderd: boolean;
  type: string;
  title: string;
  startDate: Date;
  endDate: Date;
  repeat: string;
  repeatUntil: Date;
  repeatDays: number[];
  skipRenderDays: Date[];
  description: string;
  meal: string;
  dishList: {
    dishObject: Dish;
    loggedStatus: boolean;
  }[];
}

export type NewCalendarEvent = Omit<CalendarEvent, "_id">;

export type VirtualCalendarEvent = Omit<CalendarEvent, "_id"> & {
  _id: string;
  isVirtual: boolean;
  _refid: CalendarEvent["_id"];
};

interface CalendarContextType {
  fullEventList: CalendarEvent[];
  setFullEventList: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  calendarEventTypes: string[];
  setCalendarEventTypes: React.Dispatch<React.SetStateAction<string[]>>;
  createCalendarEvent: (newEvent: NewCalendarEvent) => Promise<void>;
  editCalendarEvent: (
    id: string,
    updatedFields: Partial<Event>
  ) => Promise<void>;
  deleteCalendarEvent: (id: string) => Promise<void>;
  createVirtualEvent: (event: CalendarEvent) => VirtualCalendarEvent;
  formatDateToYYYMMDD: (date: Date) => string;
  removeIngredientsOfEventFromStock: (event: CalendarEvent) => void;
}

//=================================================================
//              CONTEXTS
//=================================================================
export const CalendarContext = createContext<CalendarContextType>(
  {} as CalendarContextType
);

//=================================================================
//              PROVIDER
//=================================================================
export const CalendarProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  //=====================================
  //              Variabes
  //=====================================
  const [fullEventList, setFullEventList] = useState<CalendarEvent[]>([]);
  const [calendarEventTypes, setCalendarEventTypes] = useState<string[]>([
    "General Event",
    "Dining Event",
    "To Do Item",
  ]);

  const { fullDishList, setFullDishList, createDish, editDish, deleteDish } =
    useContext(DishListContext);

  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientListContext);

  //=====================================
  //              Functions
  //=====================================
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/calendarEvents");
        const data = await res.json();
        setFullEventList(data);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      }
    };

    fetchCalendarEvents();
  }, []);

  useEffect(() => {});

  /**
   * createCalendarEvent
   * POSTS a calendar event to the db and updates local calendarEventList
   *
   * @param {*} newEvent JSON dict following CalendarEvent model
   */
  const createCalendarEvent = async (newEvent: NewCalendarEvent) => {
    console.log("Create Event Triggered");
    try {
      const res = await fetch("http://localhost:4000/api/calendarEvents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      const savedEvent = await res.json();
      setFullEventList((prev) => [...prev, savedEvent]);
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
  const editCalendarEvent = async (
    id: string,
    updatedFields: Partial<CalendarEvent>
  ) => {
    const originalEvent = fullEventList.find((event) => {
      return event._id === id;
    });

    if (!originalEvent) {
      console.log("Failed to find original event to edit");
      return;
    }

    //TODO:
    //If we are editing an event that repeats and it is not the base event (the start time is the same)
    // if (originalEvent.repeat != "none") {
    // }

    // const areEqual = Object.keys(updatedFields).every((key) => {
    //   return updatedFields[key] === originalEvent[key];
    // });

    try {
      const res = await fetch(
        `http://localhost:4000/api/calendarEvents/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        }
      );
      const updatedEvent = await res.json();
      setFullEventList((prev) =>
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
  const deleteCalendarEvent = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/api/calendarEvents/${id}`, {
        method: "DELETE",
      });
      setFullEventList((prev) => prev.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Failed to delete calendar event:", error);
    }
  };

  const createVirtualEvent = (event: CalendarEvent) => {
    const virtualEvent = {
      ...event,
      isVirtual: true,
      _refid: event._id,
      _id: `${event._id}_ghost_${event.startDate}`,
    };

    return virtualEvent;
  };

  const formatDateToYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const removeIngredientsOfEventFromStock = (event: CalendarEvent) => {
    const dishList = fullEventList.find(
      (eventSearch) => eventSearch._id === event._id
    )?.dishList;
    if (!dishList) return;

    dishList.forEach((dishEntry) => {
      const dish = fullDishList.find(
        (dish) => dish._id === dishEntry.dishObject._id
      );
      if (!dish) return;

      dish.ingredientsList.forEach(
        (ing_dict: { ingredientObject: Ingredient; amount: number }) => {
          const ingredient = fullIngredientList.find(
            (ing) => ing._id === ing_dict.ingredientObject._id
          );
          if (!ingredient) return;

          const updatedIngredient = {
            ...ingredient,
            portionsAvaliable: ingredient.portionsAvaliable - ing_dict.amount,
          };

          editIngredient(ingredient._id, updatedIngredient);
        }
      );
    });
  };

  //=====================================
  //              Return
  //=====================================

  return (
    <CalendarContext.Provider
      value={{
        fullEventList,
        setFullEventList,
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
    fullEventList,
    setFullEventList,
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
