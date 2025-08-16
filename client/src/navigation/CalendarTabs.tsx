import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CalendarFullViewPage from "../features/calendar/screens/CalendarFullViewPage";
import CustomTabBar from "../shared/components/CustomTabBar";
import CalendarSummaryPage from "../features/calendar/screens/CalendarSummaryPage";
const Tab = createBottomTabNavigator();

export default function CalendarTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Summary" component={CalendarSummaryPage} />
      <Tab.Screen name="Calendar" component={CalendarFullViewPage} />
      <Tab.Screen
        name="Placeholder"
        component={() => null}
        options={{ tabBarButton: () => null }}
      />

      <Tab.Screen name="Temp1" component={CalendarFullViewPage} />
      <Tab.Screen name="Temp2" component={CalendarFullViewPage} />
    </Tab.Navigator>
  );
}
