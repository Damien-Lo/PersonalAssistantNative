import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import MenuModule from '../../components/DiningPageComponents/MenuModule';

export default function SamplePage() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-6">
          <Text className="text-4xl font-bold text-gray-800">
            Welcome to the Dining Page
          </Text>

          <Text className="text-base text-gray-600">
            Explore menu options, reservations, and more.
          </Text>

          <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded-lg">
            <Text className="text-white text-center text-lg font-medium">
              View Menu
            </Text>
          </TouchableOpacity>
        </View>

        <MenuModule></MenuModule>



      </ScrollView>
    </SafeAreaView>
  );
}
