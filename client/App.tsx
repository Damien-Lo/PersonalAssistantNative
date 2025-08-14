import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import StackNavigator from "./src/navigation/StackNavigator";
import "./global.css";
import { CalendarProvider } from "./src/features/calendar/state/CalendarContext";
import { DishProvider } from "./src/features/dining/state/DishContext";
import { IngredientProvider } from "./src/features/dining/state/IngredientContext";
import { AuthProvider } from "./src/features/auth/state/AuthContext";
import "react-native-gesture-handler";

export default function App() {
  return (
    <AuthProvider>
      <IngredientProvider>
        <DishProvider>
          <CalendarProvider>
            <NavigationContainer>
              <StackNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </CalendarProvider>
        </DishProvider>
      </IngredientProvider>
    </AuthProvider>
  );
}
