import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/NavTypes";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { DishContext } from "../../dining/state/DishContext";
import { useNavigation } from "@react-navigation/native";
import { Dish, DishListEntry } from "../../../domain/dishes/DishTypes";
import CreatableSelector from "../../../shared/components/CreatableSelector";
import { CalendarContext } from "../state/CalendarContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  CalendarEvent,
  NewCalendarEvent,
  UIWrappedEvent,
} from "../../../domain/calendar/CalendarTypes";

interface EditCalendarEventProps {
  selectedDay: Date;
  passedEvent: UIWrappedEvent;
  passedCloseOverlay: () => void;
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

const EditCalendarEventPage: React.FC<EditCalendarEventProps> = ({
  selectedDay,
  passedEvent,
  passedCloseOverlay,
}) => {
  //=====================================
  //              VARIABLES
  //=====================================

  //CONTEXTS
  const {
    fullDishList,
    setFullDishList,
    createDish,
    editDish,
    deleteDish,
    updateDishesWithIngredient,
    calculateNutrition,
  } = useContext(DishContext);

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
  //Event Object Variables
  const [type, setType] = useState<string>(passedEvent.eventObject.type ?? "");
  const [title, setTitle] = useState<string>(
    passedEvent.eventObject.title ?? ""
  );
  const [description, setDescription] = useState<string>(
    passedEvent.eventObject.description ?? ""
  );
  const [startDate, setStartDate] = useState<Date>(
    passedEvent.eventObject.startDate
      ? new Date(passedEvent.eventObject.startDate)
      : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    passedEvent.eventObject.endDate
      ? new Date(passedEvent.eventObject.endDate)
      : new Date()
  );
  const [repeat, setRepeat] = useState<string>(
    passedEvent.eventObject.repeat ?? "none"
  );
  const [repeatUntil, setRepeatUntil] = useState<Date | null>(
    passedEvent.eventObject.repeatUntil
      ? new Date(passedEvent.eventObject.repeatUntil)
      : new Date()
  );
  const [repeatDays, setRepeatDays] = useState<number[]>(
    passedEvent.eventObject.repeatDays ?? []
  );
  const [skipRenderDays, setSkipRenderDays] = useState<Date[]>(
    passedEvent.eventObject.skipRenderDays ?? []
  );
  const [attendees, setAttendees] = useState<string>(
    passedEvent.eventObject.attendees ?? ""
  );

  const [meal, setMeal] = useState<string | null>(
    passedEvent.eventObject.meal ?? null
  );
  const [dishList, setDishList] = useState<DishListEntry[]>(
    passedEvent.eventObject.dishList ?? []
  );

  //Supporting Variables
  const navigation = useNavigation<Nav>();
  const [typeOptions, setTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [dishOptions, setDishOptions] = useState<
    { label: string; value: Dish }[]
  >([]);
  const [currentDish, setCurrentDish] = useState<Dish | null>(null);

  const originalStartDate: Date = passedEvent.eventObject.startDate;

  const [latestRepeatUntilDate, setLatestRepeatUntilDate] = useState<Date>(
    passedEvent.eventObject.repeatUntil
      ? new Date(passedEvent.eventObject.repeatUntil)
      : new Date()
  );

  const [mealOptions, setMealOptions] = useState<
    { label: string; value: string }[]
  >([]);

  //=====================================
  //              FUNCTIONS
  //=====================================

  const testFunc = () => {
    console.log(skipRenderDays);
  };

  useEffect(() => {
    const eventTypeOption: { label: string; value: string }[] = [];
    calendarEventTypes.forEach((type) => {
      eventTypeOption.push({ label: type, value: type });
    });
    setTypeOptions(eventTypeOption);

    const dishOption: { label: string; value: Dish }[] = [];
    const mealSet = new Set<string>();
    fullDishList.forEach((dish) => {
      dishOptions.push({ label: dish.name, value: dish });

      dish.meals.forEach((meal) => mealSet.add(meal));
    });

    setDishOptions(dishOptions);
    setMealOptions([...mealSet].map((meal) => ({ label: meal, value: meal })));
  }, [fullDishList]);

  const removeIngredient = (dishEntry: DishListEntry) => {
    const newDishList = dishList.filter(
      (item) => item.dishObject._id != dishEntry.dishObject._id
    );
    setDishList(newDishList);
  };

  const changeLogStatus = (dishEntry: DishListEntry) => {
    setDishList((prev) =>
      prev.map((item) =>
        String(item.dishObject._id) === String(dishEntry.dishObject._id)
          ? { ...item, loggedStatus: !item.loggedStatus }
          : item
      )
    );
  };

  const repeatDaysClicked = (idx: number) => {
    setRepeatDays((prev) =>
      prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
    );
  };

  const handleSave = async () => {
    const newEvent: NewCalendarEvent = {
      type: type,
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      repeat: repeat,
      repeatUntil: repeatUntil,
      repeatDays: repeatDays,
      skipRenderDays: skipRenderDays,
      attendees: attendees,
      meal: meal,
      dishList: dishList,
    };

    if (!passedEvent.isVirtual) {
      editCalendarEvent(passedEvent.eventObject._id, newEvent);
    } else {
      const editedOriginal = {
        ...passedEvent.eventObject,
        skipRenderDays: [
          ...(passedEvent.eventObject.skipRenderDays || []),
          normaliseDay(selectedDay),
        ],
      };

      editCalendarEvent(passedEvent.eventObject._id, editedOriginal);
      createCalendarEvent(newEvent);
    }
  };

  //=====================================
  //              UI ELEMENTS
  //=====================================
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 p-1">
          {/* Header Bar */}
          <View className="flex flex-row justify-between items-center mb-2">
            <Pressable
              className="flex items-center justify-center pr-4"
              onPress={() => {
                console.log("Test");
              }}
            >
              <Text
                className="text-red-500"
                onPress={() => {
                  testFunc();
                }}
              >
                Test
              </Text>
            </Pressable>
            <Pressable
              className="flex items-center justify-center"
              onPress={() => {
                passedCloseOverlay();
              }}
            >
              <Text className="text-red-500">Cancel</Text>
            </Pressable>
            <Text className="text-xl font-bold text-center">
              Edit Events Page {passedEvent.isVirtual ? "(Virtual)" : ""}
            </Text>
            <Pressable
              className="flex items-center justify-center"
              onPress={() => {
                handleSave();
                passedCloseOverlay();
              }}
            >
              <Text className="text-blue-500 ">Save</Text>
            </Pressable>
          </View>

          {passedEvent.isVirtual && (
            <View className="w-full h-[5-px] mb-5 items-center justify-center">
              <Text className="text-sm text-center">
                Original Event on :{" "}
                {new Date(passedEvent.eventObject.startDate).toDateString()}
              </Text>
            </View>
          )}

          {/* Event Type */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Event Type</Text>
            <View className="w-full h-[50px]">
              <CreatableSelector
                options={typeOptions}
                valueToSet={type}
                setValueFunc={setType}
              ></CreatableSelector>
            </View>
          </View>

          {/* Meal */}
          {type === "Dining Event" && (
            <View className="mb-4">
              <Text className="text-xl font-bold mb-2">Meal</Text>
              <View className="w-full h-[50px]">
                <CreatableSelector
                  options={mealOptions}
                  valueToSet={meal}
                  setValueFunc={setMeal}
                ></CreatableSelector>
              </View>
            </View>
          )}

          {/* Event Title */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Event Title</Text>
            <TextInput
              className="border h-[40px] pl-4 rounded-xl"
              placeholder="Input the Event Title"
              value={title}
              onChangeText={(value) => {
                setTitle(value);
              }}
            />
          </View>

          {/* Event Start and End Date */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Start Date and Time</Text>
            <View className="flex flex-row">
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, picked) => {
                  if (!picked) return;
                  setStartDate((prev) => {
                    const next = new Date(prev); // keep hours/min/sec/ms
                    next.setFullYear(
                      picked.getFullYear(),
                      picked.getMonth(),
                      picked.getDate()
                    );
                    return next;
                  });
                }}
              />
              <DateTimePicker
                value={startDate}
                mode="time"
                display="default"
                onChange={(event, picked) => {
                  if (!picked) return;
                  setStartDate((prev) => {
                    const next = new Date(prev);
                    next.setHours(
                      picked.getHours(),
                      picked.getMinutes(),
                      picked.getSeconds?.() ?? 0,
                      picked.getMilliseconds?.() ?? 0
                    );
                    return next;
                  });
                }}
              />
            </View>
            <Text className="text-xl font-bold mt-4 mb-2">
              End Date and Time
            </Text>
            <View className="flex flex-row">
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, picked) => {
                  if (!picked) return;
                  setEndDate((prev) => {
                    const next = new Date(prev);
                    next.setFullYear(
                      picked.getFullYear(),
                      picked.getMonth(),
                      picked.getDate()
                    );
                    return next;
                  });
                }}
              />
              <DateTimePicker
                value={endDate}
                mode="time"
                display="default"
                onChange={(event, picked) => {
                  if (!picked) return;
                  setEndDate((prev) => {
                    const next = new Date(prev); // keep Y/M/D
                    next.setHours(
                      picked.getHours(),
                      picked.getMinutes(),
                      picked.getSeconds?.() ?? 0,
                      picked.getMilliseconds?.() ?? 0
                    );
                    return next;
                  });
                }}
              />
            </View>
          </View>

          {/* Event Description */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Event Description</Text>
            <TextInput
              className="border h-[100px] pl-4 rounded-xl"
              multiline={true}
              placeholder="Add A Description"
              value={description}
              onChangeText={(value) => {
                setDescription(value);
              }}
            />
          </View>

          {/* Event Repeat */}
          <View className="flex flex-row items-start gap-4">
            {/* Repeat Selector */}
            <View className="mb-4 w-[40%]">
              <Text className="mb-2 text-xl font-bold">Repeat</Text>
              <View className="h-[50px] w-full">
                <CreatableSelector
                  options={[
                    { label: "none", value: "none" },
                    { label: "daily", value: "daily" },
                    { label: "weekly", value: "weekly" },
                    { label: "monthly", value: "monthly" },
                  ]}
                  placeholder="Select an option"
                  valueToSet={repeat}
                  setValueFunc={setRepeat}
                />
              </View>
            </View>

            {/* Repeat Until + Switch */}
            {repeat !== "none" && (
              <View className="flex-1">
                {/* Switch row */}
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-xl font-bold">Repeat Forever</Text>
                  <Switch
                    value={repeatUntil === null}
                    onValueChange={() => {
                      if (repeatUntil === null) {
                        setRepeatUntil(latestRepeatUntilDate);
                      } else {
                        setRepeatUntil(null);
                      }
                    }}
                  />
                </View>

                {/* Date picker (disabled when forever) */}
                <View
                  className={`${repeatUntil === null ? "opacity-50" : ""} flex flex-row items-center`}
                  pointerEvents={repeatUntil === null ? "none" : "auto"}
                >
                  <Text className="mb-2 text-xl font-bold w-[60px] text-center">
                    Repeat Until
                  </Text>
                  <DateTimePicker
                    value={latestRepeatUntilDate ?? new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, picked) => {
                      if (!picked) return;
                      setRepeatUntil(picked);
                      setLatestRepeatUntilDate(picked);
                    }}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Repeat Weekly Selector*/}
          {repeat === "weekly" && (
            <View className="w-full bg-gray-200 rounded-full px-5 py-2">
              <View className="flex-row items-center justify-center gap-x-3">
                {["M", "Tu", "W", "Th", "F", "Sat", "Sun"].map((day, idx) => {
                  const selected = repeatDays.includes((idx + 1) % 7);
                  return (
                    <Pressable
                      key={day}
                      onPress={() => repeatDaysClicked((idx + 1) % 7)}
                      className={`w-[45px] h-[45px] items-center justify-center rounded-full
                      ${selected ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                      <Text
                        className={`${selected ? "text-white font-semibold" : "text-black"}`}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Attendees */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Attendees</Text>
            <TextInput
              className="border h-[40px] pl-4 rounded-xl"
              placeholder="Input the Event Attendees"
              value={attendees}
              onChangeText={(value) => {
                setAttendees(value);
              }}
            />
          </View>

          {/* DishList */}
          {type === "Dining Event" && (
            <View>
              <View className="w-full flex flex-row mb-4">
                <View className="w-[80%] h-[50px]">
                  <CreatableSelector
                    options={dishOptions}
                    valueToSet={currentDish}
                    setValueFunc={setCurrentDish}
                    placeholder="Select Dishes to Add"
                  />
                </View>
                <Pressable
                  className="bg-blue-400 ml-3 w-[60px] items-center justify-center rounded-lg"
                  onPress={() => {
                    if (currentDish) {
                      setDishList((prev) => [
                        ...prev,
                        { dishObject: currentDish, loggedStatus: false },
                      ]);
                      setCurrentDish(null);
                    }
                  }}
                >
                  <Text>Add</Text>
                </Pressable>
              </View>
              <Text className="text-lg font-bold">Dishes:</Text>
              <FlatList
                data={dishList}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View className="w-full h-[40px] p-2 flex-row flex relative items-center">
                    <Pressable
                      className="bg-red-200 h-[30px] w-[30px] rounded-full items-center justify-center mr-2"
                      onPress={() => {
                        removeIngredient(item);
                      }}
                    >
                      <Text>X</Text>
                    </Pressable>
                    <Text className="text-center text-lg">
                      {`${item.dishObject.name} (${item.dishObject.calories} cal)`}
                    </Text>
                    <Pressable
                      className={`absolute right-0 w-[90px] h-[30px] rounded-full items-center justify-center ${item.loggedStatus ? "bg-green-300 " : "bg-red-300"}`}
                      onPress={() => {
                        changeLogStatus(item);
                      }}
                    >
                      <Text>
                        {item.loggedStatus ? "Logged " : "Not Logged"}
                      </Text>
                    </Pressable>
                  </View>
                )}
              ></FlatList>
            </View>
          )}

          <View className="w-full items-center justify-center">
            <Pressable
              className="items-center justify-center w-[250px] h-[50px] rounded-full bg-red-300"
              onPress={() => {
                deleteCalendarEvent(passedEvent.eventObject._id);
                passedCloseOverlay();
              }}
            >
              <Text className="text-xl font-bold">Delete</Text>
            </Pressable>
          </View>

          {/* Buffer Space */}
          {true && <View className="w-full h-[300px]"></View>}

          {/*End */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditCalendarEventPage;
