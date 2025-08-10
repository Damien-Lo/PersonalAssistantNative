// components/CreatableSelector.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Keyboard,
} from "react-native";

type Props = {
  options: string[];
  value: string | null;
  onSelect: (value: string) => void;
  onCreate: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function CreatableSelector({
  options,
  value,
  onSelect,
  onCreate,
  placeholder = "Select or type…",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value ? value : "");

  const normalized = useMemo(() => options.map((o) => o.trim()), [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalized;
    return normalized.filter((o) => o.toLowerCase().includes(q));
  }, [normalized, query]);

  const exactMatch = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q.length > 0 && normalized.some((o) => o.toLowerCase() === q);
  }, [normalized, query]);

  const showCreate = query.trim().length > 0 && !exactMatch;

  const pick = (v: string) => {
    onSelect(v);
    setQuery(v);
    setOpen(false);
    Keyboard.dismiss();
  };

  const create = () => {
    const v = query.trim();
    if (!v) return;
    onCreate(v);
    onSelect(v);
    setOpen(false);
    Keyboard.dismiss();
  };

  const displayText = query.length > 0 ? query : "";

  return (
    <View className="relative bg-white w-full">
      {/* Input */}
      <Pressable
        className={`border rounded-xl px-3 h-[50px] justify-center ${disabled ? "opacity-50" : ""}`}
        onPress={() => !disabled && setOpen(true)}
      >
        <TextInput
          editable={!disabled}
          value={displayText}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChangeText={(t) => {
            setQuery(t);
            if (!open) setOpen(true);
          }}
          className="text-base h-full"
          style={{
            textAlignVertical: "center", // centers vertically on Android
            paddingVertical: 0, // prevents extra top/bottom padding
          }}
        />
      </Pressable>

      {/* Backdrop to close dropdown */}
      {open && (
        <Pressable
          className="absolute -left-5 -right-5 -top-5 -bottom-5"
          onPress={() => setOpen(false)}
        />
      )}

      {/* Dropdown panel */}
      {open && (
        <View
          className="absolute left-0 right-0 top-[48px] bg-white border rounded-xl shadow max-h-[220px] overflow-hidden"
          style={{ zIndex: 999, elevation: 10 }}
        >
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => pick(item)}
                className="px-3 py-2 active:bg-gray-100"
              >
                <Text>{item}</Text>
              </Pressable>
            )}
            ListFooterComponent={
              showCreate ? (
                <Pressable
                  onPress={create}
                  className="px-3 py-3 border-t bg-gray-50 active:bg-gray-100"
                >
                  <Text className="font-semibold">+ Add “{query.trim()}”</Text>
                </Pressable>
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
}
