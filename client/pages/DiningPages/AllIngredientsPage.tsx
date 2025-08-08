import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  SectionList,
} from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  IngredientListContext,
  Ingredient,
} from "../../contexts/IngredientListContext";

export default function AllIngredientsPage() {
  const navigator = useNavigation();

  //=====================================
  //              VARIABLES
  //=====================================

  type IngredientByCategory = Record<string, Ingredient[]>;

  //CONTEXTS
  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientListContext);

  //SUPPORTING VARIABLES
  const [categorisedIngredientDict, setCategorisedIngredientDict] =
    useState<IngredientByCategory>({});
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const expandedRef = useRef(new Set());

  //=====================================
  //              FUNCTIONS
  //=====================================
  const testFunc = () => {
    console.log("Button Clicked");
  };

  /**
   * closeIngredientDetailOverlay
   */
  const closeIngredientDetailOverlay = () => {
    setSelectedIngredient(null);
  };

  /**
   * useEffect
   * Categorise Ingredient Categories on render
   */
  useEffect(() => {
    const grouped = fullIngredientList.reduce<IngredientByCategory>(
      (acc, item) => {
        const cat: string = item.category ?? "Uncategorized";
        (acc[cat] ??= []).push(item); // same as: if (!acc[cat]) acc[cat] = []; acc[cat].push(item);
        return acc;
      },
      {}
    );
    setCategorisedIngredientDict(grouped);
  }, [fullIngredientList]);

  /**
   * itrIngredientCount
   * Change ingredient portionsAvaliable by itr amount
   * @param {*} ingredient Ingredient Editted
   * @param {*} itr Iterated Amount
   */
  const itrIngredientCount = (ingredient: Ingredient, itr: number) => {
    const ingredient_id = ingredient._id;
    const updatedIngredient = {
      ...ingredient,
      portionsAvaliable: ingredient.portionsAvaliable + itr,
    };

    editIngredient(ingredient_id, updatedIngredient);
  };

  //=====================================
  //              UI COMPONENTS
  //=====================================

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-6">
          <Text className="text-4xl font-bold text-gray-800">
            All Ingredients Page
          </Text>

          <Text className="text-base text-gray-600">
            Explore menu options, reservations, and more.
          </Text>

          <Pressable
            className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => {
              console.log(fullIngredientList);
            }}
          >
            <Text className="text-white text-center text-lg font-medium">
              View Ingredients
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={() => {}} className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white">Go to Home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
