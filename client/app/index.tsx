import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Text, View } from "react-native";

export default function HomePage() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl text-black dark:text-white">
        Home Page
      </Text>

      <Pressable
        onPress={() => router.push('/SamplePage')}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        <Text className="text-white">Go to Settings</Text>
      </Pressable>
    </View>
  );
}
