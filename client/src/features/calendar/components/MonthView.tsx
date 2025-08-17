// components/MonthView.tsx
import React, { useContext, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { CalendarContext } from "../state/CalendarContext";

type MonthViewProps = {
  referenceDate: Date; // which month to show
  selectedDate?: Date | null; // highlight this date if provided
  onSelectDate?: (d: Date) => void; // callback when a day is tapped
};

export default function MonthView({
  referenceDate,
  selectedDate = null,
  onSelectDate,
}: MonthViewProps) {
  const { getStartOfWeek, generateDaysInWeek, normaliseDay } =
    useContext(CalendarContext);

  // Build 6 rows × 7 cols grid for the month
  const weeks = useMemo(() => {
    const monthStart = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      1
    );
    const gridStart = getStartOfWeek(monthStart); // Monday 00:00
    const out: Date[][] = [];
    for (let w = 0; w < 6; w++) {
      const weekStart = new Date(gridStart);
      weekStart.setDate(gridStart.getDate() + w * 7);
      out.push(generateDaysInWeek(weekStart).map(normaliseDay));
    }
    return out;
  }, [referenceDate, getStartOfWeek, generateDaysInWeek, normaliseDay]);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const today = useMemo(() => normaliseDay(new Date()), [normaliseDay]);
  const monthIndex = referenceDate.getMonth();

  return (
    <View className="w-full h-full px-2">
      {/* Weekday headers (Mon → Sun) */}
      <View className="flex-row justify-between mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <Text
            key={i}
            className="w-[14.2857%] text-center text-xs text-black font-bold"
          >
            {d}
          </Text>
        ))}
      </View>

      {/* Grid (fills remaining height) */}
      <View className="flex-1">
        {weeks.map((week, ri) => (
          <View key={ri} className="flex-row flex-1">
            {week.map((date, ci) => {
              const inMonth = date.getMonth() === monthIndex;
              const isToday = sameDay(date, today);
              const isSelected = !!selectedDate && sameDay(date, selectedDate);

              return (
                <Pressable
                  key={`${ri}-${ci}`}
                  className="flex-1 items-center justify-center"
                  hitSlop={6}
                  onPress={() => onSelectDate?.(date)}
                >
                  <View
                    className={`items-center justify-center rounded-full ${
                      isSelected ? "bg-blue-500" : "bg-transparent"
                    }`}
                    style={{
                      width: 28,
                      height: 28,
                      borderWidth: isToday && !isSelected ? 1.5 : 0,
                      borderColor: "#ef4444", // ring for today if not selected
                      opacity: inMonth ? 1 : 0.4, // dim out-of-month
                    }}
                  >
                    <Text className={"text-black"}>{date.getDate()}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
