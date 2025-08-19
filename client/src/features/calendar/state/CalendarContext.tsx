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
import { DishContext } from "../../dining/state/DishContext";
import { IngredientContext } from "../../dining/state/IngredientContext";
import { useAuth } from "../../auth/state/AuthContext";
import { Dish, NewDish } from "../../../domain/dishes/DishTypes";
import { IngredientListEntry } from "../../../domain/ingredients/IngredientTypes";
import {
  CalendarEvent,
  NewCalendarEvent,
  UIWrappedEvent,
  VirtualCalendarEvent,
} from "../../../domain/calendar/CalendarTypes";

//=================================================================
//              INTERFACES AND TYPES
//=================================================================

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
  formatDateToYYYMMDD: (date: Date) => string;
  removeIngredientsOfEventFromStock: (event: CalendarEvent) => void;
  getStartOfWeek: (date: Date) => Date;
  generateDaysInWeek: (date: Date) => Date[];
  wrapForUI: (event: CalendarEvent, isVirtual: boolean) => UIWrappedEvent;
  getEventOfDay: (date: Date) => UIWrappedEvent[];
  normaliseDay: (date: Date) => Date;
  updateEventsWithDish: (dish_id: string, updatedDish: NewDish) => void;
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

  const updateEventsWithDish = (dish_id: string, updatedDish: NewDish) => {
    // const changedDishes = [];
    setFullEventList((prev) =>
      prev.map((event) => {
        const usesDish = event.dishList.some(
          (entry) => entry.dishObject._id === dish_id
        );
        if (!usesDish) return event;

        const newDishList = event.dishList.map((entry) =>
          entry.dishObject._id === dish_id
            ? {
                ...entry,
                dishObject: {
                  ...updatedDish,
                  _id: dish_id,
                },
              }
            : entry
        );

        const newEvent = {
          ...event,
          dishList: newDishList,
        };

        //Update Backend Too
        editCalendarEvent(event._id, newEvent);
        // changedDishes.push(newDish);
        return newEvent;
      })
    );
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

  //SUPPORTING FUNCTIONS

  const getEventOfDay = (date: Date) => {
    const normalisedTargetDate = normaliseDay(date);
    const daysEvent: UIWrappedEvent[] = fullEventList.reduce<UIWrappedEvent[]>(
      (acc, event) => {
        const eventNormalisedStartDate = normaliseDay(
          new Date(event.startDate)
        );
        const targetWeekDay = normalisedTargetDate.getDay() % 7;
        const repeatEndDate = event.repeatUntil
          ? new Date(event.repeatUntil)
          : null;

        // If Day is Before Stary Date or is explicity excluded don't add to acc
        if (
          normalisedTargetDate.getTime() < eventNormalisedStartDate.getTime() ||
          event.skipRenderDays.includes(normalisedTargetDate)
        ) {
          return acc;
        }

        // If Day is Directly equal to start date no matter (after first check) what add to acc
        if (
          normalisedTargetDate.getTime() === eventNormalisedStartDate.getTime()
        ) {
          acc.push(wrapForUI(event, false));
          return acc;
        }

        //For Repeating Events
        if (event.repeat != "none") {
          //If Repeat Forever, Add
          if (repeatEndDate === null) {
            acc.push(wrapForUI(event, true));
            return acc;
          }

          //If Repeat Daily and Below end date add
          if (
            event.repeat === "daily" &&
            normalisedTargetDate.getTime() < repeatEndDate.getTime()
          ) {
            acc.push(wrapForUI(event, true));
            return acc;
          }
          // If repeat weekly and weekdays are included in specified repeat days add
          else if (
            event.repeat === "weekly" &&
            normalisedTargetDate.getTime() < repeatEndDate.getTime() &&
            event.repeatDays.includes(targetWeekDay)
          ) {
            acc.push(wrapForUI(event, true));
            return acc;
          }
          // If Repeat Monltyh and same date number add
          else if (
            event.repeat === "monthly" &&
            normalisedTargetDate.getTime() < repeatEndDate.getTime() &&
            normalisedTargetDate.getDate() ===
              eventNormalisedStartDate.getDate()
          ) {
            acc.push(wrapForUI(event, true));
            return acc;
          }
        }

        //Else Return
        return acc;
      },
      []
    );

    return daysEvent;
  };

  const wrapForUI = (event: CalendarEvent, isVirtual: boolean) => {
    const virtualEvent: UIWrappedEvent = {
      eventObject: event,
      isVirtual: isVirtual,
      _baseID: event._id,
      _wrapID: isVirtual ? `virtual_${event._id}` : event._id,
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

      dish.ingredientsList.forEach((ing_dict: IngredientListEntry) => {
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
      });
    });
  };

  const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const generateDaysInWeek = (date: Date) => {
    const base = getStartOfWeek(date);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(base);
      nextDate.setDate(base.getDate() + i);
      days.push(nextDate);
    }

    return days;
  };

  const normaliseDay = (date: Date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
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
        wrapForUI,
        formatDateToYYYMMDD,
        removeIngredientsOfEventFromStock,
        getStartOfWeek,
        generateDaysInWeek,
        getEventOfDay,
        normaliseDay,
        updateEventsWithDish,
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
    formatDateToYYYMMDD,
    removeIngredientsOfEventFromStock,
    getStartOfWeek,
    generateDaysInWeek,
    getEventOfDay,
    updateEventsWithDish
} = useContext(CalendarContext)
*/
