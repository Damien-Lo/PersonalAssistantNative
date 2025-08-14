import { Platform, Pressable, StyleSheet, View, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MainPageSelector from "../../../shared/components/MainPageSelector";
import { RootStackParamList } from "../../../navigation/NavTypes";
import { useAuth } from "../../auth/state/AuthContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;
export default function CalendarMainPage() {
  const { user, login, register, logout, authFetch, refreshOnce, loading } =
    useAuth();
  const navigation = useNavigation<Nav>();
  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Centered content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-black dark:text-white mb-4">
          Main Calendar Page
        </Text>
      </View>

      <MainPageSelector></MainPageSelector>
    </View>
  );
}
