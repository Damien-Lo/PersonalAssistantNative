import { Pressable, Text, View } from "react-native";
import { CalendarEvent } from "../../../domain/calendar/CalendarTypes";
import { useContext, useEffect, useState } from "react";
import { Dish, DishListEntry } from "../../../domain/dishes/DishTypes";
import { CalendarContext } from "../../calendar/state/CalendarContext";
import { DishContext } from "../state/DishContext";

type MenuSectionProps = {
  eventList: CalendarEvent[];
};

const MenuSection: React.FC<MenuSectionProps> = ({ eventList }) => {
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

  const {
    fullDishList,
    setFullDishList,
    createDish,
    editDish,
    deleteDish,
    updateDishesWithIngredient,
    calculateNutrition,
    deleteDishesWithIngredient,
  } = useContext(DishContext);

  const [iterList, setItrList] = useState<
    { dishEntry: DishListEntry | null; eventObject: CalendarEvent | null }[]
  >([]);
  const [showAddEventDisplay, setShowEventDisplay] = useState<boolean>(
    () => eventList.length === 0
  );
  const [dishPointer, setDishPointer] = useState(0);

  useEffect(() => {
    if (eventList.length === 0) {
      setShowEventDisplay(true);
      return;
    }

    const list: {
      dishEntry: DishListEntry | null;
      eventObject: CalendarEvent | null;
    }[] = [];
    eventList.forEach((event) => {
      event.dishList.forEach((dishEntry) => {
        list.push({ dishEntry: dishEntry, eventObject: event });
      });
    });
    list.push({ dishEntry: null, eventObject: null });

    setItrList(list);
    setShowEventDisplay(false);
  }, [eventList, fullEventList, fullDishList]);

  const itrLeft = () => {
    if (dishPointer === 0) {
      setDishPointer(iterList.length - 1);
    } else {
      setDishPointer(dishPointer - 1);
    }
    console.log(dishPointer);
  };

  const itrRight = () => {
    console.log("Clicked");
    if (dishPointer === iterList.length - 1) {
      setDishPointer(0);
    } else {
      setDishPointer(dishPointer + 1);
    }
    console.log(dishPointer);
  };

  return (
    <View className="w-full h-full bg-white border items-center p-2">
      {/* If No Events are Shown*/}
      {showAddEventDisplay && (
        <View className="items-center w-full h-full">
          <Text className="text-xl font-bold">No Events</Text>
          {/* Center Section*/}
          <View className="flex flex-row w-full h-[110px] justify-center">
            {/* Left Button */}
            <Pressable className="w-[5%] h-full items-center justify-center">
              <Text className="text-left w-full">&lt;</Text>
            </Pressable>
            {/* Description */}
            <View className="w-[90%] h-full">
              <View className="w-full h-[75%] items-center justify-center">
                <Text className="text-center">
                  Click to Add A New Meal Event
                </Text>
              </View>
              <View className="absolute bottom-0 w-full">
                <View className="flex flex-row justify-between p-2 mt-2">
                  <Text>Cal: {"40"}cal</Text>
                  <Text>Protein: {"24"}g</Text>
                  <Text>Carbs: {"12"}g</Text>
                  <Text>Fats: {"5"}g </Text>
                </View>
              </View>
            </View>
            {/* Right Button */}
            <Pressable className=" w-[5%] h-full items-center justify-center">
              <Text className="text-right w-full">&gt;</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* If Events are Present*/}
      {!showAddEventDisplay && (
        <View className="items-center w-full h-full">
          <Text className="text-xl font-bold">
            {iterList[dishPointer].eventObject === null
              ? "Add Meal Event"
              : iterList[dishPointer].eventObject.title}
          </Text>
          {/* Center Section*/}
          <View className="flex flex-row w-full h-[110px] justify-center">
            {/* Left Button */}
            <Pressable
              className="w-[5%] h-full items-center justify-center"
              onPress={() => {
                itrLeft();
              }}
            >
              <Text className="text-left w-full">&lt;</Text>
            </Pressable>
            {/* Description */}
            <View className="w-[90%] h-full">
              <View className="w-full h-[75%] items-center justify-center">
                <Text className="text-center text-lg">
                  {iterList[dishPointer].eventObject === null
                    ? "Click to Add A New Meal Event"
                    : iterList[dishPointer].dishEntry?.dishObject.name}
                </Text>
                <Text className="text-center">
                  {iterList[dishPointer].eventObject === null
                    ? ""
                    : iterList[dishPointer].dishEntry?.dishObject.description}
                </Text>
              </View>
              <View className="absolute bottom-0 w-full">
                {iterList[dishPointer].dishEntry !== null && (
                  <View className="flex flex-row justify-between p-2 mt-2">
                    <Text className="text-sm">
                      Cal:
                      {iterList[dishPointer].dishEntry?.dishObject.calories}
                      cal
                    </Text>
                    <Text className="text-sm">
                      Protein:{" "}
                      {iterList[dishPointer].dishEntry?.dishObject.protein}g
                    </Text>
                    <Text className="text-sm">
                      Carbs: {iterList[dishPointer].dishEntry?.dishObject.carbs}
                      g
                    </Text>
                    <Text className="text-sm">
                      Fats: {iterList[dishPointer].dishEntry?.dishObject.fats}
                      g{" "}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* Right Button */}
            <Pressable
              className=" w-[5%] h-full items-center justify-center"
              onPress={() => itrRight()}
            >
              <Text className="text-right w-full">&gt;</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default MenuSection;
