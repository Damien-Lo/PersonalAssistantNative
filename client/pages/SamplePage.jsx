import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Pressable} from "react-native";
import { useContext } from "react";
// import { IngredientListContext } from "../../contexts/IngredientListContext";

export default function SamplePage() {

//   const{
//     fullIngredientList,
//     setFullIngredientList,
//     createIngredient,
//     editIngredient,
//     deleteIngredient
// } = useContext(IngredientListContext)






  return (
    <SafeAreaView className="flex-1 bg-white" options={{ headerShown: false }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-6">
          <Text className="text-4xl font-bold text-gray-800">
            Welcome to the Dining Page
          </Text>

          <Text className="text-base text-gray-600">
            Explore menu options, reservations, and more.
          </Text>

          <Pressable className="mt-4 bg-blue-500 px-4 py-2 rounded-lg" onPress={() =>{console.log()}}>
            <Text className="text-white text-center text-lg font-medium">
              View Menu
            </Text>
          </Pressable>
        </View>

        <Pressable
                onPress={() => router.push('/')}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                <Text className="text-white">Go to Home</Text>
              </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
