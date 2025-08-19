import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import { CalendarContext } from "../state/CalendarContext";
import MonthView from "./MonthView";

type DateSelectHeaderProps = {
  viewedDay: Date;
  setViewedDay: React.Dispatch<React.SetStateAction<Date>>;
  selectedDay: Date;
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
  testFunc: () => void;
};

const DateSelectHeader: React.FC<DateSelectHeaderProps> = ({
  viewedDay,
  setViewedDay,
  selectedDay,
  setSelectedDay,
  testFunc,
}) => {
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
  const [expandMonthView, setExpandMonthView] = useState<boolean>(false);

  const [daysInWeek, setDaysInWeek] = useState<Date[]>([]);

  useEffect(() => {
    setDaysInWeek(generateDaysInWeek(viewedDay));
  }, [selectedDay, viewedDay]);

  /**
   * shiftWeekForward
   * Shift the week bar forward a week
   */
  const shiftWeekForward = () => {
    setViewedDay((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  /**
   * shiftWeekBackward
   * Shift the week bar backward a week
   */
  const shiftWeekBackward = () => {
    setViewedDay((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  return (
    <View className="w-full bg-blue-300 p-3 pt-[45px] items-center">
      <View className="flex flex-row items-center w-full h-[35px]">
        <Text className="text-3xl font-bold">
          {monthLabels[viewedDay.getMonth()]}
        </Text>
        <Pressable
          className="bg-white w-[75px] h-[25px] items-center justify-center right-[50px] absolute"
          onPress={() => {
            setSelectedDay(new Date());
            setViewedDay(new Date());
          }}
        >
          <Text className="text-center text-lg">Today</Text>
        </Pressable>

        <Pressable
          className="bg-white w-[75px] h-[25px] items-center justify-center right-[200px] absolute"
          onPress={() => {
            testFunc();
          }}
        >
          <Text className="text-center text-lg">Test</Text>
        </Pressable>
        <Pressable className="bg-white w-[40px] h-[25px] items-center justify-center right-0 absolute">
          <Text className="text-center text-lg">🔍</Text>
        </Pressable>
      </View>

      {/* Day Selector */}
      {!expandMonthView && (
        <View className="w-full mt-3 flex-row items-end">
          {/* Prev aligned with numbers */}
          <Pressable
            className="basis-0 grow h-12 items-center justify-center"
            onPress={() => shiftWeekBackward()}
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
            onPress={() => shiftWeekForward()}
            hitSlop={8}
          >
            <Text>Next</Text>
          </Pressable>
        </View>
      )}

      {/* Expanded Month View */}
      <View className="w-full items-center mt-2">
        {expandMonthView && (
          <View className="w-full h-[220px]">
            <MonthView
              referenceDate={viewedDay}
              selectedDate={selectedDay} // highlighted day
              onSelectDate={(d) => setSelectedDay(d)}
            />
          </View>
        )}

        <Pressable
          className="w-[100px] h-[15px] items-center"
          onPress={() => setExpandMonthView((v) => !v)}
        >
          <Text className="text-center"> -- </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DateSelectHeader;
