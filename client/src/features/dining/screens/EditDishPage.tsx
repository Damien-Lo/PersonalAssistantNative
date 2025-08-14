import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dish, DishContext, NewDish } from "../state/DishContext";
import { RootStackParamList } from "../../../navigation/NavTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import CreatableSelector from "../../../shared/components/CreatableSelector";
import CustomMultiSelect from "../../../shared/components/CustomMultiSelect";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Ingredient, IngredientContext } from "../state/IngredientContext";

interface EditDishPageProps {
  passedDish: Dish;
  passedCloseOverlay: () => void;
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

type DishByCategory = Record<string, Dish[]>;

const EditDishPage: React.FC<EditDishPageProps> = ({
  passedDish,
  passedCloseOverlay,
}) => {
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
  } = useContext(IngredientContext);

  const { fullDishList, setFullDishList, createDish, editDish, deleteDish } =
    useContext(DishContext);

  //STATE VARIABLES
  //Dish Object Variables
  const [dishName, setDishName] = useState<string>(
    passedDish.name ? passedDish.name : ""
  );
  const [description, setDescription] = useState<string>(
    passedDish.description ? passedDish.description : ""
  );
  const [category, setCategory] = useState<string | null>(
    passedDish.category ? passedDish.category : ""
  );
  const [meals, setMeals] = useState<string[]>(passedDish.meals ?? []);
  const [ingredientsList, setIngredientsList] = useState<
    {
      ingredientObject: Ingredient;
      amount: number;
    }[]
  >(passedDish.ingredientsList ? passedDish.ingredientsList : []);
  const [recipe, setRecipe] = useState<string | null>(
    passedDish.recipe ? passedDish.recipe : ""
  );
  const [restaurant, setRestaurant] = useState<string | null>(
    passedDish.restaurant ? passedDish.restaurant : ""
  );
  const [calories, setCalories] = useState<number>(
    passedDish.calories ? passedDish.calories : 0
  );
  const [protein, setProtein] = useState<number>(
    passedDish.protein ? passedDish.protein : 0
  );
  const [carbs, setCarbs] = useState<number>(
    passedDish.carbs ? passedDish.carbs : 0
  );
  const [fats, setFats] = useState<number>(
    passedDish.fats ? passedDish.fats : 0
  );
  const [fiber, setFiber] = useState<number>(
    passedDish.fiber ? passedDish.fiber : 0
  );
  const [sodium, setSodium] = useState<number>(
    passedDish.sodium ? passedDish.sodium : 0
  );

  //Supporting Variables
  const navigation = useNavigation<Nav>();
  const [categorisedDishDict, setCategorisedDishDict] =
    useState<DishByCategory>({});
  const [fullIngredeintsListDictionary, setFullIngredientListDictionary] =
    useState<Map<Ingredient, string>>(new Map());
  const [mealOptions, setMealOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [restaurantOptions, setRestaurantOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [ingredientOptions, setIngredientOptions] = useState<
    { label: string; value: Ingredient }[]
  >([]);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient | null>(
    null
  );
  const [currentIngredientAmount, setCurrentIngredientAmount] =
    useState<number>(1);
  //=====================================
  //              FUNCTIONS
  //=====================================

  const testFunc = () => {
    console.log(ingredientsList);
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
    setMealOptions(
      Array.from(mealSet, (item) => ({ label: item, value: item }))
    );
    setRestaurantOptions(
      Array.from(restaurantSet, (item) => ({ label: item, value: item }))
    );
    setCategoryOptions(
      Array.from(categoriesSet, (item) => ({ label: item, value: item }))
    );
  }, []);

  useEffect(() => {
    const ingOption: { label: string; value: Ingredient }[] = [];
    fullIngredientList.forEach((ing) => {
      ingOption.push({ label: ing.name, value: ing });
    });
    setIngredientOptions(ingOption);
  }, [fullIngredientList]);

  /**
   * handleSave
   * POSTS the ingredient to db and updates local fullIngredeintsList, if page is called as overaly,
   * close overllay, if not return to main ingredient page
   */
  const handleSave = async () => {
    const updatedFields = {
      name: dishName,
      description: description,
      category: category === null ? "Uncategorised" : category,
      meals: meals ? meals : [],
      ingredientsList: ingredientsList ? ingredientsList : [],
      recipe: recipe,
      restaurant: restaurant,
      calories: isNaN(Number(calories)) ? 0 : Number(calories),
      protein: isNaN(Number(protein)) ? 0 : Number(protein),
      carbs: isNaN(Number(carbs)) ? 0 : Number(carbs),
      fats: isNaN(Number(fats)) ? 0 : Number(fats),
      fiber: isNaN(Number(fiber)) ? 0 : Number(fiber),
      sodium: isNaN(Number(sodium)) ? 0 : Number(sodium),
    };

    console.log("Saving Dish:", updatedFields);

    editDish(passedDish._id, updatedFields);
  };

  const handleDelete = async () => {
    deleteDish(passedDish._id);
  };

  const computeTotals = (list: typeof ingredientsList) => {
    return list.reduce(
      (acc, { ingredientObject: ing, amount }) => {
        const a = Number(amount) || 0;
        acc.calories += a * (ing.calories ?? 0);
        acc.protein += a * (ing.protein ?? 0);
        acc.carbs += a * (ing.carbs ?? 0);
        acc.fats += a * (ing.fats ?? 0);
        acc.fiber += a * (ing.fiber ?? 0);
        acc.sodium += a * (ing.sodium ?? 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sodium: 0 }
    );
  };

  useEffect(() => {
    autoFillNutritionInfo();
  }, [ingredientsList]);

  const addIngredient = () => {
    if (!currentIngredient) return;

    setIngredientsList((prev) => {
      const idx = prev.findIndex(
        (e) => e.ingredientObject._id === currentIngredient._id
      );
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          amount:
            Number(next[idx].amount) + Number(currentIngredientAmount || 0),
        };
        return next;
      }
      return [
        ...prev,
        {
          ingredientObject: currentIngredient,
          amount: Number(currentIngredientAmount || 0),
        },
      ];
    });

    setCurrentIngredient(null);
    setCurrentIngredientAmount(1);
  };

  const removeIngredient = (ing: Ingredient) => {
    setIngredientsList((prev) =>
      prev.filter((item) => item.ingredientObject._id !== ing._id)
    );
  };

  const autoFillNutritionInfo = () => {
    const t = computeTotals(ingredientsList);
    setCalories(t.calories);
    setProtein(t.protein);
    setCarbs(t.carbs);
    setFats(t.fats);
    setFiber(t.fiber);
    setSodium(t.sodium);
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
            <Text className="text-xl font-bold text-center">
              Edit Dish Page
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
            <View className="h-[50px]">
              <CreatableSelector
                options={Array.from(categoryOptions)}
                valueToSet={category}
                setValueFunc={setCategory}
                placeholder="Type or Select A Category"
              />
            </View>
          </View>

          {/* Meals */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Meals</Text>
            <View className="h-[50px]">
              <CustomMultiSelect
                options={Array.from(mealOptions)}
                valueToSet={meals ?? []}
                setValueFunc={setMeals}
                placeholder="Type or Select Appropiate Meals"
              />
            </View>
          </View>

          {/* Restaurant */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Brand</Text>
            <View className="h-[50px]">
              <CreatableSelector
                options={Array.from(restaurantOptions)}
                valueToSet={restaurant}
                setValueFunc={setRestaurant}
                placeholder="Type or Select A Brand"
              />
            </View>
          </View>

          {/* Ingredients */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Ingredients</Text>
            <View className="flex flex-row w-[65%] items-center mb-4">
              <View className="h-[50px]">
                <CreatableSelector
                  options={Array.from(ingredientOptions)}
                  valueToSet={currentIngredient}
                  setValueFunc={setCurrentIngredient}
                  placeholder="Type or Select An Ingredient"
                />
              </View>
              <TextInput
                className="border ml-2 w-[60px] h-[50px] rounded-lg p-2"
                keyboardType="decimal-pad"
                value={String(currentIngredientAmount)}
                onChangeText={(value) => {
                  setCurrentIngredientAmount(Number(value));
                }}
              ></TextInput>
              <View className="ml-2">
                <Text>{currentIngredient?.portionUnit}</Text>
              </View>
              <Pressable
                className="bg-blue-200 w-[60px] h-[50px] rounded-lg items-center justify-center ml-2"
                onPress={() => {
                  addIngredient();
                }}
              >
                <Text>Add</Text>
              </Pressable>
            </View>
            <FlatList
              data={ingredientsList}
              renderItem={({ item }) => (
                <View className="w-full h-[40px] p-2 flex-row flex">
                  <Pressable
                    className="bg-red-200 h-[30px] w-[30px] rounded-full items-center justify-center mr-2"
                    onPress={() => {
                      removeIngredient(item.ingredientObject);
                    }}
                  >
                    <Text>X</Text>
                  </Pressable>
                  <Text className="text-center text-lg">
                    {item.amount}
                    {item.ingredientObject.portionUnit}{" "}
                    {item.ingredientObject.name}
                  </Text>
                </View>
              )}
            ></FlatList>
          </View>

          {/* Nutrition Information */}
          <View className="mb-4">
            <View className="flex flex-row w-full mb-4 items-center">
              <Text className="text-xl font-bold mb-2 text-center">
                Nutrition Info Per Portion
              </Text>
              <Pressable
                className="items-center justify-center bg-blue-400 w-[80px] h-[30px] rounded-full absolute right-0"
                onPress={() => {
                  autoFillNutritionInfo();
                }}
              >
                <Text>Autofill</Text>
              </Pressable>
            </View>

            <View className="space-y-4">
              {/* Row 1 */}
              <View className="flex flex-row justify-between mb-3">
                <View className="w-[30%]">
                  <Text className="text-lg">Calories</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={String(calories)}
                    onChangeText={(value) => {
                      setCalories(Number(value));
                    }}
                  />
                </View>
                <View className="w-[30%]">
                  <Text className="text-lg">Protein (g)</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={String(protein)}
                    onChangeText={(value) => {
                      setProtein(Number(value));
                    }}
                  />
                </View>
                <View className="w-[30%]">
                  <Text className="text-lg">Carbs (g)</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={String(carbs)}
                    onChangeText={(value) => {
                      setCarbs(Number(value));
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
                    value={String(fats)}
                    onChangeText={(value) => {
                      setFats(Number(value));
                    }}
                  />
                </View>
                <View className="w-[30%]">
                  <Text className="text-lg">Fiber (g)</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={String(fiber)}
                    onChangeText={(value) => {
                      setFiber(Number(value));
                    }}
                  />
                </View>
                <View className="w-[30%]">
                  <Text className="text-lg">Sodium (mg)</Text>
                  <TextInput
                    className="border w-full h-[40px] rounded px-2"
                    keyboardType="decimal-pad"
                    value={String(sodium)}
                    onChangeText={(value) => {
                      setSodium(Number(value));
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          {/* Delete */}
          <View className="w-full items-center justify-center mt-5">
            <Pressable
              className="bg-red-300 w-[150px] h-[50px] rounded-full items-center justify-center"
              onPress={() => {
                handleDelete();
                passedCloseOverlay();
              }}
            >
              <Text className="text-lg">Delete</Text>
            </Pressable>
          </View>

          {/* Buffer Space */}
          {true && <View className="w-full h-[300px]"></View>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditDishPage;
