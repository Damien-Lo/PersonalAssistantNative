import { Platform, Pressable, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import '../global.css';



import { useNavigation } from '@react-navigation/native';

export default function HomePage() {
  const navigation = useNavigation();
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

      {/* FAB and radial menu */}
      <View className="absolute bottom-5 left-0 right-0 items-center">
        {/* Floating Button */}
        <Pressable
          onPress={() => setMenuVisible(!menuVisible)}
          className="w-[100px] h-[100px] bg-blue-500 rounded-full items-center justify-center shadow-lg z-10"
        >
          <Text className="text-white text-2xl">+</Text>
        </Pressable>

        {/* Radial Buttons */}
        {menuVisible && (
          <View className="absolute bottom-[0px] w-full h-[200px] items-center justify-center ">
            {/* Wrapper is relative so child buttons can use absolute */}
            <View className="relative w-full h-full">
              {/* Left Bubble */}
              <Pressable
                onPress={() => {setMenuVisible(false)}}
                className="absolute left-[70px] -translate-x-1/2 bottom-0 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
              >
                <Text>🏠</Text>
              </Pressable>

              {/* Center Bubble */}
              <Pressable
                onPress={() => {setMenuVisible(false)}}
                className="absolute left-1/4 -translate-x-1/2 translate-y-1/2 top-0 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
              >
                <Text>🍴</Text>
              </Pressable>

              {/* Right Bubble */}
              <Pressable
                onPress={() => {navigation.navigate('Dining'); setMenuVisible(false)}}
                className="absolute left-1/2 -translate-x-1/2 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
              >
                <Text>D</Text>
              </Pressable>

              <Pressable
                onPress={() => {setMenuVisible(false)}}
                className="absolute left-3/4 -translate-x-1/2 translate-y-1/2 top-0 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
              >
                <Text>⚙️</Text>
              </Pressable>

              <Pressable
                onPress={() => {setMenuVisible(false)}}
                className="absolute right-[70px] translate-x-1/2 bottom-0 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
              >
                <Text>🏠</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View> 

    </View>
  );
}
