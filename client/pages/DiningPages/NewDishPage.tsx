import { useState, useEffect } from "react";
import { useContext } from "react";
import {
  Ingredient,
  IngredientListContext,
  NewIngredient,
} from "../../contexts/IngredientListContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/NavTypes";
import {
  SafeAreaFrameContext,
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import CreatableSelector from "../../components/HomeComponents/CreatableSelector";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dish, DishListContext, NewDish } from "../../contexts/DishListContext";
import { MultiSelect } from "react-native-element-dropdown";
import CustomMultiSelect from "../../components/HomeComponents/MultiSelect";

interface NewDishPageProps {
  passedCloseOverlay: () => void;
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

type DishByCategory = Record<string, Dish[]>;

const NewDishPage: React.FC<NewDishPageProps> = ({ passedCloseOverlay }) => {
  //=====================================
  //              VARIABLES
  //=====================================

  //CONTEXTS
  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientListContext);

  const { fullDishList, setFullDishList, createDish, editDish, deleteDish } =
    useContext(DishListContext);

  //STATE VARIABLES
  //Dish Object Variables
  const [dishName, setDishName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string | null>("");
  const [meals, setMeals] = useState<string[] | null>(null);
  const [ingredientList, setIngredientList] = useState<
    | [
        {
          ingredientObject: Ingredient;
          amount: number;
        },
      ]
    | null
  >(null);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<string | null>(null);
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fats, setFats] = useState<string>("");
  const [fiber, setFiber] = useState<string>("");
  const [sodium, setSodium] = useState<string>("");

  //Supporting Variables
  const navigation = useNavigation<Nav>();
  const [categorisedDishDict, setCategorisedDishDict] =
    useState<DishByCategory>({});
  const [fullIngredeintsListDictionary, setFullIngredientListDictionary] =
    useState<Map<Ingredient, string>>(new Map());
  const [knownMeals, setKnownMeals] = useState<Set<string>>(
    new Set(["Breakfast", "Lunch", "Dinner", "Snack"])
  );
  const [knownRestaurants, setKnownRestuaruants] = useState<Set<string>>(
    new Set()
  );
  const [knownCategories, setKnwonCategories] = useState<Set<string>>(
    new Set()
  );
  const [currentlySelectedIngredient, setCurrentlySelectedIngredient] =
    useState<Ingredient | null>(null);
  const [
    currentlySelectedIngredientAmount,
    setCurrentlySelectedIngredientAmount,
  ] = useState<number>(0);
  //=====================================
  //              FUNCTIONS
  //=====================================

  const testFunc = () => {
    console.log(meals);
  };

  //Navigate Functions

  /**
   * useEffect
   * Sets Categorised Ingredients and Unit typesList Upon First Render
   */
  useEffect(() => {
    // Group data by category
    const categoriesSet: Set<string> = new Set();
    const mealSet: Set<string> = new Set();
    const restaurantSet: Set<string> = new Set();
    const grouped = fullDishList.reduce<DishByCategory>((acc, item) => {
      item.meals
        ? item.meals.forEach((item) => {
            mealSet.add(item);
          })
        : null;
      item.restaurant ? restaurantSet.add(item.restaurant) : null;
      const cat: string = item.category ?? "Uncategorized";
      categoriesSet.add(cat);
      (acc[cat] ??= []).push(item);
      return acc;
    }, {});

    setCategorisedDishDict(grouped);
    setKnownMeals(mealSet);
    setKnownRestuaruants(restaurantSet);
    setKnwonCategories(categoriesSet);
  }, []);

  useEffect(() => {
    const map = new Map<Ingredient, string>();

    fullIngredientList.forEach((ingredientObject) => {
      map.set(ingredientObject.name, ingredientObject);
    });

    setFullIngredientListDictionary(map);
  }, [fullIngredientList]);

  /**
   * handleSave
   * POSTS the ingredient to db and updates local fullIngredeintsList, if page is called as overaly,
   * close overllay, if not return to main ingredient page
   */
  const handleSave = async () => {
    const newDish: NewDish = {
      name: dishName,
      description: description,
      category: category === null ? "Uncategorised" : category,
      meals: meals ? meals : [],
      ingredientsList: ingredientList ? ingredientList : [],
      recipe: recipe,
      restaurant: restaurant,
      calories: isNaN(Number(calories)) ? 0 : Number(calories),
      protein: isNaN(Number(protein)) ? 0 : Number(protein),
      carbs: isNaN(Number(carbs)) ? 0 : Number(carbs),
      fats: isNaN(Number(fats)) ? 0 : Number(fats),
      fiber: isNaN(Number(fiber)) ? 0 : Number(fiber),
      sodium: isNaN(Number(sodium)) ? 0 : Number(sodium),
    };

    console.log("Saving Dish:", newDish);

    createDish(newDish);
  };

  //=====================================
  //              UI COMPONENTS
  //=====================================

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 p-2">
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
            <Text className="text-xl font-bold text-center">New Dish Page</Text>
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

          {/* Ingredient Name */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Dish Name</Text>
            <TextInput
              className="border h-[40px] pl-4 rounded-xl"
              placeholder="Input the Ingredient name"
              value={dishName}
              onChangeText={(value) => {
                setDishName(value);
              }}
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Description</Text>
            <TextInput
              className="border h-[100px] pl-4 pt-4 rounded-xl"
              placeholder="Add a Description"
              value={description}
              multiline={true}
              onChangeText={(value) => {
                setDescription(value);
              }}
            ></TextInput>
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Category</Text>
            <View className="">
              <CreatableSelector
                options={Array.from(knownCategories)}
                value={category}
                onSelect={(v) => setCategory(v)}
                onCreate={(v) => {
                  setKnwonCategories((prev) => new Set(prev).add(v));
                }}
                placeholder="Select or type a brand"
              />
            </View>
          </View>

          {/* Meals */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Meals</Text>
            <View className="">
              <CustomMultiSelect
                options={Array.from(knownMeals)}
                setFunc={setMeals}
                placeholder="Select Appropriate Meals"
              ></CustomMultiSelect>
            </View>
          </View>

          {/* Restaurant */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Restaurant</Text>
            <View className="">
              <CreatableSelector
                options={Array.from(knownRestaurants)}
                value={restaurant}
                onSelect={(v) => setRestaurant(v)}
                onCreate={(v) => {
                  setKnownRestuaruants((prev) => new Set(prev).add(v));
                }}
                placeholder="Select or type a brand"
              />
            </View>
          </View>

          {/* Ingredients */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Ingredients</Text>
            <View className="flex flex-row w-[65%] items-center">
              <CreatableSelector
                options={Array.from(
                  Object.values(fullIngredeintsListDictionary)
                )}
                value={currentlySelectedIngredient}
                onSelect={(v) => setCurrentlySelectedIngredient(v)}
                onCreate={(v) => {
                  setKnownRestuaruants((prev) => new Set(prev).add(v));
                }}
                placeholder="Select or type an Ingredient to Add"
              />
              <TextInput
                className="border ml-2 w-[60px] h-[50px] rounded-lg p-2"
                keyboardType="decimal-pad"
              ></TextInput>
              <Pressable
                className="bg-blue-200 w-[60px] h-[50px] rounded-lg items-center justify-center ml-2"
                onPress={() => {}}
              >
                <Text>Add</Text>
              </Pressable>
            </View>
          </View>

          {/* Nutrition Information */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">
              Nutrition Info Per Portion
            </Text>
            <View className="space-y-4">
              {/* Row 1 */}
              <View className="flex flex-row justify-between mb-3">
                <View className="w-[30%]">
                  <Text className="text-lg">Calories</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={calories}
                    onChangeText={(value) => {
                      setCalories(value);
                    }}
                  />
                </View>
                <View className="w-[30%]">
                  <Text className="text-lg">Protein (g)</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={protein}
                    onChangeText={(value) => {
                      setProtein(value);
                    }}
                  />
                </View>
                <View className="w-[30%]">
                  <Text className="text-lg">Carbs (g)</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={carbs}
                    onChangeText={(value) => {
                      setCarbs(value);
                    }}
                  />
                </View>
              </View>

              {/* Row 2 */}
              <View className="flex flex-row justify-between">
                <View className="w-[30%]">
                  <Text className="text-lg">Fats (g)</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={fats}
                    onChangeText={(value) => {
                      setFats(value);
                    }}
                  />
                </View>
                <View className="w-[30%]">
                  <Text className="text-lg">Fiber (g)</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={fiber}
                    onChangeText={(value) => {
                      setFiber(value);
                    }}
                  />
                </View>
                <View className="w-[30%]">
                  <Text className="text-lg">Sodium (mg)</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={sodium}
                    onChangeText={(value) => {
                      setSodium(value);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          {/* Buffer Space */}
          {true && <View className="w-full h-[300px]"></View>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewDishPage;
