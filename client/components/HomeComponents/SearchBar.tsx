// components/SearchBar.tsx
import React, { useMemo, useRef } from "react";
import { View, TextInput, Pressable, Text, TextInputProps } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  /** debounce input in ms (0 to disable) */
  debounceMs?: number;
} & Omit<TextInputProps, "value" | "onChangeText" | "placeholder">;

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search…",
  onClear,
  debounceMs = 0,
  ...inputProps
}: Props) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useMemo(() => {
    if (!debounceMs) return onChangeText;
    return (text: string) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => onChangeText(text), debounceMs);
    };
  }, [onChangeText, debounceMs]);

  const clear = () => {
    onClear?.();
    onChangeText(""); // ensure parent state resets even if onClear not provided
  };

  return (
    <View className="flex-row items-center rounded-xl bg-gray-100 px-3 py-2 h-[60px] w-full">
      <Text className="mr-2">🔍</Text>
      <TextInput
        className="flex-1 text-base"
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        {...inputProps}
      />
      {value.length > 0 && (
        <Pressable
          onPress={clear}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          className="ml-2"
        >
          <Text>✕</Text>
        </Pressable>
      )}
    </View>
  );
}
