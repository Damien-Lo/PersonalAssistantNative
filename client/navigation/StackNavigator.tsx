import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../pages/HomePage";
import SamplePage from "../pages/SamplePage";
import DiningTabs from "./DiningTabs";
import AllIngredientsPage from "../pages/DiningPages/AllIngredientsPage";
import { RootStackParamList } from "./NavTypes";
import DiningPage from "../pages/DiningPages/DiningPage";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="DiningPage" component={DiningTabs} />
      <Stack.Screen name="Ingredients" component={AllIngredientsPage} />
    </Stack.Navigator>
  );
}
