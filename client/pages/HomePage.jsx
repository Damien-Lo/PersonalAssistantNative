import { Platform, Pressable, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import '../global.css';
import MainPageSelector from '../components/HomeComponents/MainPageSelector';



import { useNavigation } from '@react-navigation/native';

export default function HomePage() {
  const navigator = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  
  return (
    <View className="flex-1 bg-white dark:bg-black">

      {/* Centered content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-black dark:text-white mb-4">
          Home Page
        </Text>

        <Pressable
          onPress={() => console.log("")}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white">Go to Settings</Text>
        </Pressable>
      </View>

      <MainPageSelector></MainPageSelector>

    </View>
  );
}
