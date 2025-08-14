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
import { IngredientContext } from "../state/IngredientContext";
import { DishContext } from "../state/DishContext";

export default function DiningPage() {
  const navigator = useNavigation();

  const {
    fullIngredientList,
    setFullIngredientList,
    createIngredient,
    editIngredient,
    deleteIngredient,
  } = useContext(IngredientContext);

  const { fullDishList, setFullDishList, createDish, editDish, deleteDish } =
    useContext(DishContext);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-6">
          <Text className="text-4xl font-bold text-gray-800">Dining Page</Text>

          <Text className="text-base text-gray-600">
            Explore menu options, reservations, and more.
          </Text>

          <Pressable
            className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => {
              console.log(fullDishList);
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
