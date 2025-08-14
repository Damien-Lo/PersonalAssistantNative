import { Platform, Pressable, StyleSheet, View, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/NavTypes";
import { useState } from "react";
import MainPageSelector from "../../../shared/components/MainPageSelector";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../auth/state/AuthContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;
export default function HomePage() {
  const { user, login, register, logout, authFetch, refreshOnce, loading } =
    useAuth();
  const navigation = useNavigation<Nav>();
  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Centered content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-black dark:text-white mb-4">
          Home Page
        </Text>

        <Pressable
          onPress={() => navigation.navigate("SettingsPage")}
          className="bg-blue-500 px-4 py-2 rounded mb-4"
        >
          <Text className="text-white">Go to Settings</Text>
        </Pressable>

        <Pressable
          onPress={() => console.log(user)}
          className="bg-blue-500 px-4 py-2 rounded mb-4"
        >
          <Text className="text-white">Check User Email</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            logout();
            navigation.navigate("LoginPage");
          }}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white">Log Out</Text>
        </Pressable>
      </View>

      <MainPageSelector></MainPageSelector>
    </View>
  );
}
