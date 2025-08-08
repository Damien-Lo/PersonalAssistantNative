import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Or your preferred icon set
import MainPageSelector from "./MainPageSelector";

export default function CustomTabBar(props) {
  return (
    <View>
      <BottomTabBar {...props} />
      <MainPageSelector scale={0.75} />
    </View>
  );
}
