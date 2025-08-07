import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useColorScheme } from '@/hooks/useColorScheme';

import 'react-native-reanimated';
import '../global.css';

import { CalendarProvider } from '../contexts/CalendarContext';
import { DishListProvider } from '../contexts/DishListContext';
import { IngredientListProvider } from '@/contexts/IngredientListContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
      <IngredientListProvider>
        <DishListProvider>
          <CalendarProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="SamplePage" options={{ headerShown: false }} />
            </Stack>
          </CalendarProvider>
        </DishListProvider>
      </IngredientListProvider>
  );
}
