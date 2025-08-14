import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../features/home/screens/HomePage";
import SamplePage from "../features/home/screens/SamplePage";
import DiningTabs from "./DiningTabs";
import AllIngredientsPage from "../features/dining/screens/AllIngredientsPage";
import { RootStackParamList } from "./NavTypes";
import DiningPage from "../features/dining/screens/DiningPage";
import AllDishesPage from "../features/dining/screens/AllDishesPage";
import LoginPage from "../features/auth/screens/LoginPage";
import CreateUserPage from "../features/auth/screens/CreateUserPage";
import SettingsPage from "../features/home/screens/SettingsPage";
import CalendarMainPage from "../features/calendar/screens/CalendarMainPage";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="CreateUserPage" component={CreateUserPage} />
      <Stack.Screen name="SettingsPage" component={SettingsPage} />
      <Stack.Screen name="HomePage" component={HomePage} />

      <Stack.Screen name="CalendarMainPage" component={CalendarMainPage} />

      <Stack.Screen name="DiningPage" component={DiningTabs} />
      <Stack.Screen name="AllIngredientsPage" component={AllIngredientsPage} />
      <Stack.Screen name="AllDishesPage" component={AllDishesPage} />
    </Stack.Navigator>
  );
}
