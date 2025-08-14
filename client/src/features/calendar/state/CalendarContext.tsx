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
import { Dish, DishContext } from "../../dining/state/DishContext";
import {
  Ingredient,
  IngredientContext,
} from "../../dining/state/IngredientContext";
import { useAuth } from "../../auth/state/AuthContext";

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

export type UIWrappedEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  data?: any;
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
  toUIEvent: (event: CalendarEvent) => UIWrappedEvent;
  getEventFromWrapper: (wrap: UIWrappedEvent) => CalendarEvent;
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

  const { user, authFetch } = useAuth();
  const [fullEventList, setFullEventList] = useState<CalendarEvent[]>([]);
  const [calendarEventTypes, setCalendarEventTypes] = useState<string[]>([
    "General Event",
    "Dining Event",
    "To Do Item",
  ]);

  const { fullDishList, setFullDishList, createDish, editDish, deleteDish } =
    useContext(DishContext);

  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientContext);

  //=====================================
  //              Functions
  //=====================================
  useEffect(() => {
    if (!user) {
      setFullEventList([]);
      return;
    }

    let alive = true;
    (async () => {
      const res = await authFetch("/api/calendarEvents");
      const data = res.ok ? await res.json() : [];
      if (alive) setFullEventList(data);
    })();

    return () => {
      alive = false;
    };
  }, [user?.id]);

  /**
   * createCalendarEvent
   * POSTS a calendar event to the db and updates local calendarEventList
   *
   * @param {*} newEvent JSON dict following CalendarEvent model
   */
  const createCalendarEvent = async (
    newEvent: NewCalendarEvent
  ): Promise<void> => {
    try {
      const res = await authFetch("/api/calendarEvents", {
        method: "POST",
        body: JSON.stringify(newEvent),
      });
      const savedEvent: CalendarEvent = await res.json();
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
  ): Promise<void> => {
    try {
      const res = await authFetch(`/api/calendarEvents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      const updatedEvent: CalendarEvent = await res.json();
      setFullEventList((prev) =>
        prev.map((event) => (event._id === id ? updatedEvent : event))
      );
    } catch (error) {
      console.error("Failed to edit event:", error);
    }
  };

  /**
   * deleteCalendarEvent
   * DELETE a calendar event from db and from calendarEventList
   * @param {*} id ID of event to be deleted
   */
  const deleteCalendarEvent = async (id: string): Promise<void> => {
    try {
      await authFetch(`/api/calendarEvents/${id}`, {
        method: "DELETE",
      });
      setFullEventList((prev) => prev.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Failed to delete event:", error);
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
            portionsAvaliable:
              ingredient.portionsAvaliable === null
                ? null
                : ingredient.portionsAvaliable - ing_dict.amount,
          };

          editIngredient(ingredient._id, updatedIngredient);
        }
      );
    });
  };

  const toUIEvent = (event: CalendarEvent): UIWrappedEvent => {
    return {
      id: event._id,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      color: "blue",
      data: event,
    };
  };

  const getEventFromWrapper = (wrap: UIWrappedEvent): CalendarEvent => {
    return wrap.data;
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
        toUIEvent,
        getEventFromWrapper,
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
    removeIngredientsOfEventFromStock,
    toUIEvent,
    getEventFromWrapper,
} = useContext(CalendarContext)
*/
