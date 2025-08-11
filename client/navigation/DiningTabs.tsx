import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiningPage from "../pages/DiningPages/DiningPage";
import AllIngredientsPage from "../pages/DiningPages/AllIngredientsPage"; // Example second tab
import CustomTabBar from "../components/HomeComponents/CustomTabBar";
import AllDishesPage from "../pages/DiningPages/AllDishesPage";

const Tab = createBottomTabNavigator();

export default function DiningTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Dining" component={DiningPage} />
      <Tab.Screen name="Dishes" component={AllDishesPage} />
      <Tab.Screen
        name="Placeholder"
        component={() => null}
        options={{ tabBarButton: () => null }}
      />

      <Tab.Screen name="Ingredients" component={AllIngredientsPage} />
      <Tab.Screen name="Statistics" component={AllIngredientsPage} />
    </Tab.Navigator>
  );
}
