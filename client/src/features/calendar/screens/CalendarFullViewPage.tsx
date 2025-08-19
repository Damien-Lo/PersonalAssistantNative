import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Modal,
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
  PlacedUIEvent,
  UIWrappedEvent,
  VirtualCalendarEvent,
} from "../../../domain/calendar/CalendarTypes";
import { CalendarContext } from "../state/CalendarContext";
import NewCalendarEventPage from "./NewCalendarEventPage";
import EditCalendarEventPage from "./EditCalendarEventPage";
import MonthView from "../components/MonthView";
import DateSelectHeader from "../components/DateSelectHeader";

type Nav = NativeStackNavigationProp<RootStackParamList>;
export default function CalendarFullViewPage() {
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
    wrapForUI,
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
  const [selectedEvent, setSelectedEvent] = useState<UIWrappedEvent | null>(
    null
  );

  const [selectedDayEvents, setSelectedDayEvents] = useState<UIWrappedEvent[]>(
    []
  );

  const [eventGroups, setEventGroups] = useState<PlacedUIEvent[][]>([]);

  //SUPPORTING VARIABLES
  const navigation = useNavigation<Nav>();
  const [currentTime, setCurrentTime] = useState(new Date());

  const [showNewEventOverlay, setShowNewEventOverlay] =
    useState<boolean>(false);
  const CELL_HEIGHT = 100;
  const pxPerHour = CELL_HEIGHT;
  const pxPerMin = pxPerHour / 60;

  const minutesFromMidnight =
    currentTime.getHours() * 60 + currentTime.getMinutes();
  const top = (minutesFromMidnight / 60) * pxPerHour;

  //===========================
  //         FUNCTIONS
  //==========================

  const testFunc = () => {
    console.log(selectedDay);
  };

  /**
   * useEffect
   * Updates the current time (and current time line every minute)
   */
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  /**
   * useEffect
   * Loads events when new day is seleceted
   */
  useEffect(() => {
    setSelectedDayEvents(getEventOfDay(selectedDay));
    console.log(getEventOfDay(selectedDay));
  }, [selectedDay, viewedDay, fullEventList]);

  /**
   * useEffect
   * Generates UI event element positions for currentDay's Event
   */
  useEffect(() => {
    const placeColumns = (group: UIWrappedEvent[]): PlacedUIEvent[] => {
      // when each column becomes free (ms)
      const colEnd: number[] = [];
      // ensure group is start-time sorted
      const g = [...group].sort(
        (a, b) =>
          new Date(a.eventObject.startDate).getTime() -
          new Date(b.eventObject.startDate).getTime()
      );

      const placed: (UIWrappedEvent & { col: number })[] = [];
      for (const ev of g) {
        const s = new Date(ev.eventObject.startDate).getTime();
        const e = new Date(ev.eventObject.endDate).getTime();
        // first free column or new one
        let col = colEnd.findIndex((t) => t <= s);
        if (col === -1) {
          col = colEnd.length;
          colEnd.push(e);
        } else {
          colEnd[col] = e;
        }
        placed.push({ ...ev, col });
      }
      const totalCols = colEnd.length;
      return placed.map((p) => ({ ...p, cols: totalCols }));
    };
    const sorted = [...selectedDayEvents].sort(
      (a, b) =>
        new Date(a.eventObject.startDate).getTime() -
        new Date(b.eventObject.startDate).getTime()
    );

    const groups: UIWrappedEvent[][] = [];
    let current: UIWrappedEvent[] = [];
    let windowEnd = -Infinity;

    for (const ev of sorted) {
      const s = new Date(ev.eventObject.startDate).getTime();
      const e = new Date(ev.eventObject.endDate).getTime();
      if (!current.length) {
        current = [ev];
        windowEnd = e;
      } else if (s < windowEnd) {
        current.push(ev);
        windowEnd = Math.max(windowEnd, e); // extend window by later END
      } else {
        groups.push(current);
        current = [ev];
        windowEnd = e;
      }
    }
    if (current.length) groups.push(current);

    const placedGroups = groups.map(placeColumns);
    setEventGroups(placedGroups);
  }, [selectedDayEvents]);

  useEffect(() => {
    setViewedDay(selectedDay);
  }, [selectedDay]);

  //===========================
  //         UI Component
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
      <ScrollView className="w-full h-[50px] border relative">
        {/* Fixed background time labels */}
        {Array.from({ length: 25 }, (_, i) => i).map((hour) => (
          <View key={hour} style={{ height: CELL_HEIGHT }} className="relative">
            <Text
              className="absolute left-0 w-12 pr-2 text-xs text-right text-neutral-600 top-1/2 -translate-y-1/2"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {`${hour.toString().padStart(2, "0")}:00`}
            </Text>
            <View className="absolute left-12 right-0 top-1/2 -translate-y-1/2 h-px bg-gray-300" />
          </View>
        ))}

        {/* Event Container */}
        <View
          className="absolute left-[45px] w-[88%]"
          style={{ height: CELL_HEIGHT * 24, top: CELL_HEIGHT / 2 }}
        >
          {eventGroups.flatMap((group, gIdx) =>
            group.map((e, idx) => {
              const start = new Date(e.eventObject.startDate);
              const end = new Date(e.eventObject.endDate);

              const top =
                (start.getHours() * 60 + start.getMinutes()) * pxPerMin;
              const height = Math.max(
                10,
                ((end.getTime() - start.getTime()) / 60000) * pxPerMin
              );

              const widthPct = 100 / e.cols;
              const leftPct = e.col * widthPct;

              return (
                <Pressable
                  key={e.eventObject._id ?? `${gIdx}-${idx}`}
                  className="absolute rounded-md overflow-hidden bg-gray-300"
                  style={{
                    top,
                    height,
                    width: `${widthPct}%`,
                    left: `${leftPct}%`,
                  }}
                  onPress={() => {
                    setSelectedEvent(e);
                  }}
                >
                  <EventBox event={e.eventObject} />
                </Pressable>
              );
            })
          )}
        </View>
        {/* Current Time Line */}
        {normaliseDay(selectedDay).getTime() ===
          normaliseDay(new Date()).getTime() && (
          <View
            className="absolute left-12 right-0 flex flex-row items-center justify-center"
            style={{ top }}
          >
            <View className="absolute left-0 w-2 h-2 rounded-full bg-red-500 -translate-x-1/2 top-[-2px]" />
            <View className="ml-2 h-[2px] bg-red-500 w-full " />
          </View>
        )}
      </ScrollView>

      {/* New Button*/}
      <Pressable
        className="w-[120px] h-[50px] bg-gray-400 absolute right-5 bottom-5 rounded-full items-center justify-center"
        onPress={() => {
          setShowNewEventOverlay(true);
        }}
      >
        <Text className="text-lg font-bold">New</Text>
      </Pressable>

      <Modal
        visible={showNewEventOverlay}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewEventOverlay(false)}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setShowNewEventOverlay(false)}
        />

        {/* Sheet content */}
        <View className="absolute bottom-0 left-[2.5%] right-0 h-[95%] w-[95%] bg-white rounded-t-2xl p-4">
          <NewCalendarEventPage
            passedCloseOverlay={() => setShowNewEventOverlay(false)}
          />
        </View>
      </Modal>

      <Modal
        visible={selectedEvent != null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedEvent(null)}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setSelectedEvent(null)}
        />

        {/* Sheet content */}
        <View className="absolute bottom-0 left-[2.5%] right-0 h-[95%] w-[95%] bg-white rounded-t-2xl p-4">
          {selectedEvent && (
            <EditCalendarEventPage
              selectedDay={selectedDay}
              passedEvent={selectedEvent}
              passedCloseOverlay={() => setSelectedEvent(null)}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
