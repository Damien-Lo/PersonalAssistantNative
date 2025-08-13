import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import StackNavigator from "./navigation/StackNavigator";
import "./global.css";
import { CalendarProvider } from "./contexts/CalendarContext";
import { DishListProvider } from "./contexts/DishListContext";
import { IngredientListProvider } from "./contexts/IngredientListContext";
import { AuthProvider } from "./contexts/AuthContext";
import "react-native-gesture-handler";

export default function App() {
  return (
    <AuthProvider>
      <IngredientListProvider>
        <DishListProvider>
          <CalendarProvider>
            <NavigationContainer>
              <StackNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </CalendarProvider>
        </DishListProvider>
      </IngredientListProvider>
    </AuthProvider>
  );
}
