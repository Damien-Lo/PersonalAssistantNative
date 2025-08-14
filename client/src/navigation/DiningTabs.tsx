import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiningPage from "../features/dining/screens/DiningPage";
import AllIngredientsPage from "../features/dining/screens/AllIngredientsPage";
import CustomTabBar from "../shared/components/CustomTabBar";
import AllDishesPage from "../features/dining/screens/AllDishesPage";

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
