// components/MonthView.tsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { CalendarContext } from "../state/CalendarContext";

type MonthViewProps = {
  referenceDate: Date; // initial month to show
  selectedDate?: Date | null; // highlight this date (unchanged by nav)
  onSelectDate?: (d: Date) => void; // called when a day is tapped
};

export default function MonthView({
  referenceDate,
  selectedDate = null,
  onSelectDate,
}: MonthViewProps) {
  const { getStartOfWeek, generateDaysInWeek, normaliseDay } =
    useContext(CalendarContext);

  // Internal month being viewed (does not change selectedDate)
  const [viewMonth, setViewMonth] = useState<Date>(
    () => new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
  );

  // If parent changes referenceDate (e.g., user selected a date elsewhere), sync view
  useEffect(() => {
    setViewMonth(
      new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
    );
  }, [referenceDate]);

  // Build 6 rows × 7 cols starting from the Monday of the first visible week
  const weeks = useMemo(() => {
    const gridStart = getStartOfWeek(new Date(viewMonth)); // Monday 00:00
    const out: Date[][] = [];
    for (let w = 0; w < 6; w++) {
      const weekStart = new Date(gridStart);
      weekStart.setDate(gridStart.getDate() + w * 7);
      out.push(generateDaysInWeek(weekStart).map(normaliseDay));
    }
    return out;
  }, [viewMonth, getStartOfWeek, generateDaysInWeek, normaliseDay]);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const today = useMemo(() => normaliseDay(new Date()), [normaliseDay]);
  const monthIndex = viewMonth.getMonth();

  const monthLabel = useMemo(
    () =>
      viewMonth.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
    [viewMonth]
  );

  const goPrev = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
    );
  const goNext = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
    );

  return (
    <View className="w-full h-full px-2">
      {/* Header: month label + arrows */}
      <View className="flex-row items-center justify-between mb-1">
        <Pressable onPress={goPrev} hitSlop={8}>
          <Text className="text-xl text-black">‹</Text>
        </Pressable>
        <Text className="text-black font-semibold">{monthLabel}</Text>
        <Pressable onPress={goNext} hitSlop={8}>
          <Text className="text-xl text-black">›</Text>
        </Pressable>
      </View>

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

      {/* Grid */}
      <View className="flex-1">
        {weeks.map((week, ri) => (
          <View key={ri} className="flex-row flex-1">
            {week.map((date) => {
              const key = date.toISOString();
              const inMonth = date.getMonth() === monthIndex;
              const isToday = sameDay(date, today);
              const isSelected = !!selectedDate && sameDay(date, selectedDate);

              return (
                <Pressable
                  key={key}
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
                      borderColor: "#ef4444",
                      opacity: inMonth ? 1 : 0.4,
                    }}
                  >
                    <Text className={isSelected ? "text-white" : "text-black"}>
                      {date.getDate()}
                    </Text>
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
