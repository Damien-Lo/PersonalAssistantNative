import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { IngredientContext } from "../state/IngredientContext";
import { DishContext } from "../state/DishContext";
import MonthView from "../../calendar/components/MonthView";
import DateSelectHeader from "../../calendar/components/DateSelectHeader";
import MenuSection from "../components/MenuSection";
import { CalendarEvent } from "../../../domain/calendar/CalendarTypes";
import { CalendarContext } from "../../calendar/state/CalendarContext";

export default function DiningPage() {
  //===========================
  //         VARIABLES
  //==========================
  const navigator = useNavigation();

  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientContext);

  const { fullDishList, setFullDishList, createDish, editDish, deleteDish } =
    useContext(DishContext);

  const {
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
  } = useContext(CalendarContext);

  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [viewedDay, setViewedDay] = useState<Date>(new Date());

  const [breakfastEvents, setBreakfastEvents] = useState<CalendarEvent[]>([]);
  const [lunchEvents, setLunchEvents] = useState<CalendarEvent[]>([]);
  const [dinnerEvents, setDinnerEvents] = useState<CalendarEvent[]>([]);

  //===========================
  //         FUNCTIONS
  //==========================

  const testFunc = () => [console.log(dinnerEvents)];

  useEffect(() => {
    let breakfastEvents: CalendarEvent[] = [];
    let lunchEvents: CalendarEvent[] = [];
    let dinnerEvents: CalendarEvent[] = [];

    fullEventList.forEach((event) => {
      if (event.meal === "Breakfast") {
        breakfastEvents.push(event);
      }
      if (event.meal === "Lunch") {
        lunchEvents.push(event);
      }
      if (event.meal === "Dinner") {
        dinnerEvents.push(event);
      }
    });

    setBreakfastEvents(breakfastEvents);
    setLunchEvents(lunchEvents);
    setDinnerEvents(dinnerEvents);
  }, [fullEventList]);

  //===========================
  //         UI
  //==========================
  return (
    <View className="flex-1 bg-white dark:bg-black">
      <DateSelectHeader
        viewedDay={viewedDay}
        setViewedDay={setViewedDay}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        testFunc={testFunc}
      />

      {/*MENU*/}
      <View className="w-full h-[460px] items-center p-[5px]">
        <View className="w-[95%] h-[150px]">
          <MenuSection eventList={breakfastEvents} />
        </View>
        <View className="w-[95%] h-[150px]">
          <MenuSection eventList={lunchEvents} />
        </View>
        <View className="w-[95%] h-[150px]">
          <MenuSection eventList={dinnerEvents} />
        </View>
      </View>

      {/*NUTRITIION*/}
      <View className="w-full h-[200px] bg-orange-200"></View>
    </View>
  );
}
