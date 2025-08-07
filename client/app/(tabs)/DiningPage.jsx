import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

const EventCard = ({ meal, onPress }) => (
  <Pressable
    className="bg-white border border-gray-300 rounded-xl my-2 py-6 items-center"
    onPress={onPress}
  >
    <Text className="text-gray-800 font-semibold text-base">No {meal} Events</Text>
    <Text className="text-gray-400 text-sm mt-1">Click To Make An Event</Text>
  </Pressable>
);

const NavButton = ({ title, onPress }) => (
  <Pressable
    onPress={onPress}
    className="bg-white border border-gray-300 py-3 px-4 rounded-full my-1 items-center"
  >
    <Text className="text-gray-700 font-medium text-base">{title}</Text>
  </Pressable>
);

export default function DiningPage() {
  const formattedDate = 'Wed Aug 06 2025'; // Replace with dynamic date if needed

  return (
    <View className="flex-1 bg-gray-100">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center bg-gray-800 p-4">
        <Text className="text-white text-lg font-semibold">Dining Page</Text>
        <Pressable onPress={() => {}}>
          <Text className="text-blue-300">Settings</Text>
        </Pressable>
      </View>

      {/* Date Header */}
      <View className="flex-row justify-center items-center bg-blue-500 py-2">
        <Pressable onPress={() => {}}>
          <Text className="text-white text-xl px-3">{'<'}</Text>
        </Pressable>
        <View className="items-center">
          <Text className="text-white font-medium text-base">{formattedDate}</Text>
          <Pressable onPress={() => {}}>
            <Text className="text-white text-xs underline">Go to Today</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => {}}>
          <Text className="text-white text-xl px-3">{'>'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Event Sections */}
        <EventCard meal="Breakfast" onPress={() => {}} />
        <EventCard meal="Lunch" onPress={() => {}} />
        <EventCard meal="Dinner" onPress={() => {}} />

        {/* Nutrition Summary */}
        <View className="flex-row justify-around my-6">
          {['0 cal', '0g protein', '0g carbs', '0g fats'].map((item, idx) => {
            const [val, label] = item.split(' ');
            return (
              <View key={idx} className="items-center">
                <Text className="text-lg font-bold">{val}</Text>
                <Text className="text-xs text-gray-500">{label}</Text>
              </View>
            );
          })}
        </View>

        {/* Navigation Buttons */}
        <NavButton title="All Dishes" onPress={() => {}} />
        <NavButton title="All Ingredients Stock" onPress={() => {}} />
        <NavButton title="Your 2 Week Plan" onPress={() => {}} />
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View className="flex-row justify-around bg-gray-200 py-3">
        <Pressable onPress={() => {}} className="px-4 py-2 bg-white rounded">
          <Text>Back</Text>
        </Pressable>
        <Pressable onPress={() => {}} className="px-4 py-2 bg-white rounded">
          <Text>Home</Text>
        </Pressable>
        <Pressable onPress={() => {}} className="px-4 py-2 bg-white rounded">
          <Text>Nav</Text>
        </Pressable>
        <Pressable onPress={() => {}} className="px-4 py-2 bg-red-500 rounded">
          <Text className="text-white">TEST</Text>
        </Pressable>
      </View>
    </View>
  );
}