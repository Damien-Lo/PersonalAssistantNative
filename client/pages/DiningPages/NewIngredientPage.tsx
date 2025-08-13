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

interface NewIngredientPageProps {
  passedCloseOverlay: () => void;
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

type IngredientByCategory = Record<string, Ingredient[]>;

const NewIngredientPage: React.FC<NewIngredientPageProps> = ({
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
  } = useContext(IngredientListContext);

  //STATE VARIABLES
  //Ingredeint Object Variables
  const [ingredientName, setIngredientName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string | null>("");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [brand, setBrand] = useState<string>("Generic");
  const [portionsAvaliable, setPortionsAvaliable] = useState<string | null>(
    null
  );
  const [portionUnit, setPortionUnit] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fats, setFats] = useState<string>("");
  const [fiber, setFiber] = useState<string>("");
  const [sodium, setSodium] = useState<string>("");

  //Supporting Variables
  const navigation = useNavigation<Nav>();
  const [categorisedIngredientDict, setCategorisedIngredientDict] =
    useState<IngredientByCategory>({});
  const [unitOptions, setUnitOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [brandOptions, setBrandOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: any }[]
  >([]);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(true);
  const [latestSetDate, setLatestSetDate] = useState<Date>(new Date());

  //=====================================
  //              FUNCTIONS
  //=====================================

  const testFunc = () => {
    // const newIngredient: NewIngredient = {
    //   name: ingredientName,
    //   description: description,
    //   category: category === null ? "Uncategorised" : category,
    //   expiryDate: expiryDate ? new Date(expiryDate) : null,
    //   brand: brand === null ? "Generic" : brand,
    //   portionsAvaliable:
    //     portionsAvaliable === null ? null : Number(portionsAvaliable),
    //   portionUnit: portionUnit,
    //   calories: isNaN(Number(calories)) ? 0 : Number(calories),
    //   protein: isNaN(Number(protein)) ? 0 : Number(protein),
    //   carbs: isNaN(Number(carbs)) ? 0 : Number(carbs),
    //   fats: isNaN(Number(fats)) ? 0 : Number(fats),
    //   fiber: isNaN(Number(fiber)) ? 0 : Number(fiber),
    //   sodium: isNaN(Number(sodium)) ? 0 : Number(sodium),
    // };

    // console.log(newIngredient);
    console.log("Test Clicked");
    console.log(brand);
  };

  //Navigate Functions

  /**
   * useEffect
   * Sets Categorised Ingredients and Unit typesList Upon First Render
   */
  useEffect(() => {
    // Group data by category
    const unitsSet: Set<string> = new Set();
    const brandsSet: Set<string> = new Set();
    const categoriesSet: Set<string> = new Set();
    const grouped = fullIngredientList.reduce<IngredientByCategory>(
      (acc, item) => {
        item.portionUnit == null ? null : unitsSet.add(item.portionUnit);
        brandsSet.add(item.brand);
        const cat: string = item.category ?? "Uncategorized";
        categoriesSet.add(cat);
        (acc[cat] ??= []).push(item);
        return acc;
      },
      {}
    );

    setCategorisedIngredientDict(grouped);
    setUnitOptions(
      Array.from(unitsSet, (item) => ({ label: item, value: item }))
    );
    setBrandOptions(
      Array.from(brandsSet, (item) => ({ label: item, value: item }))
    );
    setCategoryOptions(
      Array.from(categoriesSet, (item) => ({ label: item, value: item }))
    );
  }, []);

  /**
   * handleSave
   * POSTS the ingredient to db and updates local fullIngredeintsList, if page is called as overaly,
   * close overllay, if not return to main ingredient page
   */
  const handleSave = async () => {
    const newIngredient: NewIngredient = {
      name: ingredientName.trim(),
      description: description.trim(),
      category: category === null ? "Uncategorised" : category.trim(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      brand: brand === null ? "Generic" : brand.trim(),
      portionsAvaliable:
        portionsAvaliable === null ? null : Number(portionsAvaliable),
      portionUnit: portionUnit.trim(),
      calories: isNaN(Number(calories)) ? 0 : Number(calories),
      protein: isNaN(Number(protein)) ? 0 : Number(protein),
      carbs: isNaN(Number(carbs)) ? 0 : Number(carbs),
      fats: isNaN(Number(fats)) ? 0 : Number(fats),
      fiber: isNaN(Number(fiber)) ? 0 : Number(fiber),
      sodium: isNaN(Number(sodium)) ? 0 : Number(sodium),
    };

    console.log("Saving Ingredient:", newIngredient);

    createIngredient(newIngredient);
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
              New Ingredients Page
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
            <Text className="text-xl font-bold mb-2">Ingredient Name</Text>
            <TextInput
              className="border h-[40px] pl-4 rounded-xl"
              placeholder="Input the Ingredient name"
              value={ingredientName}
              onChangeText={(value) => {
                setIngredientName(value);
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

          {/* Brand */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Brand</Text>
            <View className="h-[50px]">
              <CreatableSelector
                options={Array.from(brandOptions)}
                valueToSet={brand}
                setValueFunc={setBrand}
                placeholder="Type or Select A Brand"
              />
            </View>
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

          {/* Portions Avaliable */}
          <View className="mb-4">
            <Text className="text-xl font-bold mb-2">Portions Available</Text>

            <View className="flex flex-row items-center h-[50px]">
              <TextInput
                className="border h-full w-[240px] mr-4 pl-2"
                placeholder=""
                keyboardType="decimal-pad"
                value={portionsAvaliable ? portionsAvaliable : ""}
                onChangeText={(value) => {
                  setPortionsAvaliable(value === "" ? null : value);
                }}
              />

              <View className="h-full w-[120px]">
                <CreatableSelector
                  options={Array.from(unitOptions)}
                  valueToSet={portionUnit}
                  setValueFunc={setPortionUnit}
                  placeholder="Type or Select A Unit"
                />
              </View>
            </View>
          </View>

          {/* Expiry Date */}
          <View className="mb-4 flex flex-row items-center h-[60px]">
            <Text className="text-xl font-bold">Expiry Date</Text>
            <View className="pl-4">
              {showDatePicker && (
                <DateTimePicker
                  value={expiryDate ?? new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setExpiryDate(selectedDate);
                      setLatestSetDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>
            <Switch
              className="absolute right-0"
              value={showDatePicker}
              onValueChange={() => {
                if (showDatePicker) {
                  setExpiryDate(null);
                } else {
                  setExpiryDate(latestSetDate);
                }
                setShowDatePicker(!showDatePicker);
              }}
            ></Switch>
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

export default NewIngredientPage;
