import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/NavTypes";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
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
import { NewCalendarEvent } from "../../../domain/calendar/CalendarTypes";

interface NewCalendarEventProps {
  passedCloseOverlay: () => void;
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

const NewCalendarEventPage: React.FC<NewCalendarEventProps> = ({
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
  } = useContext(CalendarContext);

  //STATE VARIABLES
  //Event Object Variables
  const [type, setType] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [repeat, setRepeat] = useState<string>("none");
  const [repeatUntil, setRepeatUntil] = useState<Date | null>(null);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [skipRenderDays, setSkipRenderDays] = useState<Date[]>([]);
  const [attendees, setAttendees] = useState<string>("");

  const [meal, setMeal] = useState<string | null>(null);
  const [dishList, setDishList] = useState<DishListEntry[]>([]);

  //Supporting Variables
  const navigation = useNavigation<Nav>();
  const [typeOptions, setTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [dishOptions, setDishOptions] = useState<
    { label: string; value: Dish }[]
  >([]);
  const [currentDish, setCurrentDish] = useState<Dish | null>(null);

  //=====================================
  //              FUNCTIONS
  //=====================================

  const testFunc = () => {
    console.log(dishList);
  };

  useEffect(() => {
    const eventTypeOption: { label: string; value: string }[] = [];
    calendarEventTypes.forEach((type) => {
      eventTypeOption.push({ label: type, value: type });
    });
    setTypeOptions(eventTypeOption);

    const dishOption: { label: string; value: Dish }[] = [];
    fullDishList.forEach((dish) => {
      dishOption.push({ label: dish.name, value: dish });
    });
    setDishOptions(dishOption);
  }, [fullDishList]);

  const removeIngredient = (dishEntry: DishListEntry) => {
    const newDishList = dishList.filter(
      (item) => item.dishObject._id != dishEntry.dishObject._id
    );
    setDishList(newDishList);
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
      meal: meal,
      dishList: dishList,
    };
    createCalendarEvent(newEvent);
  };

  //=====================================
  //              UI ELEMENTS
  //=====================================
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 p-1">
          {/* Header Bar */}
          <View className="flex flex-row justify-between items-center mb-6">
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
              New Events Page
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
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Repeat</Text>
            <View className="w-full h-[50px]">
              <CreatableSelector
                options={[
                  { label: "none", value: "none" },
                  { label: "daily", value: "daily" },
                  { label: "weekly", value: "weekly" },
                  { label: "monthly", value: "monthly" },
                ]}
                placeholder="Select A Option"
                valueToSet={repeat}
                setValueFunc={setRepeat}
              ></CreatableSelector>
            </View>
          </View>

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
                  <View className="w-full h-[40px] p-2 flex-row flex">
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
                  </View>
                )}
              ></FlatList>
            </View>
          )}

          {/* Buffer Space */}
          {true && <View className="w-full h-[300px]"></View>}

          {/*End */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewCalendarEventPage;
