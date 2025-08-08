import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { IngredientListContext } from "../../contexts/IngredientListContext";
import { DishListContext } from "../../contexts/DishListContext";

export default function AllDishPage() {
  const navigator = useNavigation();

  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientListContext);

  const { fullDishList, setFullDishList, createDish, editDish, deleteDish } =
    useContext(DishListContext);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-6">
          <Text className="text-4xl font-bold text-gray-800">
            All Dish Page
          </Text>

          <Text className="text-base text-gray-600">
            Explore menu options, reservations, and more.
          </Text>

          <Pressable
            className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => {
              console.log(fullDishList);
              console.log("\n");
              console.log(fullDishList[0].ingredientsList);
            }}
          >
            <Text className="text-white text-center text-lg font-medium">
              View Dishes
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
