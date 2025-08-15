import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MainPageSelector from "../../../shared/components/MainPageSelector";
import { RootStackParamList } from "../../../navigation/NavTypes";
import { useAuth } from "../../auth/state/AuthContext";
import EventBox from "../components/EventBox";
import {
  CalendarEvent,
  UIWrappedEvent,
  VirtualCalendarEvent,
} from "../../../domain/calendar/CalendarTypes";
import { CalendarContext } from "../state/CalendarContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;
export default function CalendarMainPage() {
  //=====================================
  //              VARIABLES
  //=====================================

  //CONTEXTS
  const { user, login, register, logout, authFetch, refreshOnce, loading } =
    useAuth();

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
    normaliseDay,
  } = useContext(CalendarContext);

  //STATE VARIABLES
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [viewedDay, setViewedDay] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<
    CalendarEvent | VirtualCalendarEvent | null
  >(null);

  const [selectDayEvents, setSelectedDayEvents] = useState<UIWrappedEvent[]>(
    []
  );

  //SUPPORTING VARIABLES
  const navigation = useNavigation<Nav>();
  const [daysInWeek, setDaysInWeek] = useState<Date[]>([]);
  const [monthViewExpanded, setMonthViewExpanded] = useState<boolean>(false);
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const daysOfWeekLabels = ["M", "T", "W", "T", "F", "S", "S"];

  const demoEvent: CalendarEvent = {
    _id: "123",
    isRenderd: false,
    type: "Dining event",
    title: "Dinner Today",
    startDate: new Date(),
    endDate: new Date(),
    repeat: "none",
    repeatUntil: new Date(),
    repeatDays: [0, 1, 3, 4],
    skipRenderDays: [],
    description: "Description",
    meal: "Lunch",
    dishList: [],
  };

  //===========================
  //         FUNCTIONS
  //==========================
  useEffect(() => {
    setDaysInWeek(generateDaysInWeek(viewedDay));
    setSelectedDayEvents(getEventOfDay(selectedDay));
  }, [selectedDay, viewedDay, fullEventList]);

  const nextWeekButtonPressed = () => {
    const newViewDay = new Date(viewedDay);
    newViewDay.setDate(viewedDay.getDate() + 7);
    setViewedDay(newViewDay);
  };

  const prevWeekButtonPressed = () => {
    const newViewDay = new Date(viewedDay);
    newViewDay.setDate(viewedDay.getDate() - 7);
    setViewedDay(newViewDay);
  };

  //===========================
  //         UI Component
  //==========================

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Header Day Selector*/}
      <View className="w-full h-[20%] bg-blue-300 p-3 pt-[60px]">
        <View className="flex flex-row items-center w-full h-[40px]">
          <Text className="text-3xl font-bold">
            {monthLabels[viewedDay.getMonth()]}
          </Text>
          <Pressable
            className="bg-white w-[75px] h-[30px] items-center justify-center right-[50px] absolute"
            onPress={() => {
              setSelectedDay(new Date());
              setViewedDay(new Date());
            }}
          >
            <Text className="text-center text-xl">Today</Text>
          </Pressable>
          <Pressable className="bg-white w-[40px] h-[30px] items-center justify-center right-0 absolute">
            <Text className="text-center text-2xl"> 🔍</Text>
          </Pressable>
        </View>

        {/* Day Selector */}
        <View className="w-full mt-4 flex-row items-end">
          {/* Prev aligned with numbers */}
          <Pressable
            className="basis-0 grow h-12 items-center justify-center"
            onPress={prevWeekButtonPressed}
            hitSlop={8}
          >
            <Text>Prev</Text>
          </Pressable>

          {daysInWeek.map((date, idx) => {
            const active = date.toDateString() === selectedDay.toDateString();
            return (
              <Pressable
                key={date.toISOString()}
                onPress={() => setSelectedDay(date)}
                className="basis-0 grow items-center"
                hitSlop={8}
              >
                {/* weekday label with small gap */}
                <Text className=" text-neutral-600 mb-1">
                  {daysOfWeekLabels[idx]}
                </Text>

                {/* number pill only */}
                <View
                  className={`h-12 w-12 rounded-full items-center justify-center
            ${active ? "bg-blue-600" : "bg-transparent"}`}
                >
                  <Text
                    className={`font-semibold ${active ? "text-white" : "text-black"}`}
                  >
                    {date.getDate()}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          {/* Next aligned with numbers */}
          <Pressable
            className="basis-0 grow h-12 items-center justify-center"
            onPress={nextWeekButtonPressed}
            hitSlop={8}
          >
            <Text>Next</Text>
          </Pressable>
        </View>
      </View>

      {/* Centered content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-black dark:text-white mb-4">
          Main Calendar Page
        </Text>
        <View className="w-[200px] h-[75px]">
          <EventBox event={demoEvent}></EventBox>
        </View>
      </View>
      <MainPageSelector></MainPageSelector>
    </View>
  );
}
