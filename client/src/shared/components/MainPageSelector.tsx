import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/NavTypes";
import { View, Text } from "react-native";
import { Pressable } from "react-native";
import { useState } from "react";

type Props = {
  scale?: number;
  mainButtonFunction?: () => void;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MainPageSelector({
  scale = 1,
  mainButtonFunction,
}: Props) {
  const navigation = useNavigation<Nav>();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ transform: [{ scale }] }}>
      <View className="absolute bottom-5 left-0 right-0 items-center">
        <Pressable
          onPress={() => {
            setMenuVisible((v) => !v);
            if (mainButtonFunction) mainButtonFunction();
            else console.log("No Main Button Function Passed");
          }}
          className="w-[100px] h-[100px] bg-blue-500 rounded-full items-center justify-center shadow-lg z-10"
        >
          <Text className="text-white text-2xl">+</Text>
        </Pressable>

        {menuVisible && (
          <View className="absolute bottom-[0px] w-full h-[200px] items-center justify-center">
            <View className="relative w-full h-full">
              <Pressable
                className="absolute left-[70px] -translate-x-1/2 bottom-0 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
                onPress={() => {
                  navigation.navigate("HomePage");
                  setMenuVisible(false);
                }}
              >
                <Text>🏠</Text>
              </Pressable>

              <Pressable
                className="absolute left-1/4 -translate-x-1/2 translate-y-1/2 top-0 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
                onPress={() => {
                  navigation.navigate("DiningPage");
                  setMenuVisible(false);
                }}
              >
                <Text>🍴</Text>
              </Pressable>

              <Pressable
                className="absolute left-1/2 -translate-x-1/2 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
                onPress={() => {
                  navigation.navigate("CalendarFullViewPage");
                  setMenuVisible(false);
                }}
              >
                <Text>C</Text>
              </Pressable>

              <Pressable
                className="absolute left-3/4 -translate-x-1/2 translate-y-1/2 top-0 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
                onPress={() => setMenuVisible(false)}
              >
                <Text>⚙️</Text>
              </Pressable>

              <Pressable
                className="absolute right-[70px] translate-x-1/2 bottom-0 w-[70px] h-[70px] bg-white rounded-full shadow items-center justify-center"
                onPress={() => setMenuVisible(false)}
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
