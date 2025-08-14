import React from "react";
import { View } from "react-native";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MainPageSelector from "./MainPageSelector";

export default function CustomTabBar(props: BottomTabBarProps) {
  return (
    <View>
      <BottomTabBar {...props} />
      <MainPageSelector scale={0.75} />
    </View>
  );
}
