import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import StackNavigator from './navigation/StackNavigator';
import './global.css';
import { CalendarProvider } from './contexts/CalendarContext';
import { DishListProvider } from './contexts/DishListContext';
import { IngredientListProvider } from './contexts/IngredientListContext';

export default function App() {
  return (
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
  );
}
