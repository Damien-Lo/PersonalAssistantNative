// components/CreatableSelector.tsx
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Keyboard,
} from "react-native";

type Props = {
  options: { label: string; value: any }[];
  valueToSet: any | null;
  setValueFunc: Dispatch<SetStateAction<any>>;
  placeholder?: string;
};

export default function CreatableSelector({
  options,
  valueToSet,
  setValueFunc,
  placeholder = "Select or type…",
}: Props) {
  const textRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDataLabel, setSelectedDataLabel] = useState<string>("");

  const [query, setQuery] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<
    { label: string; value: any }[]
  >([]);

  useEffect(() => {
    if (query === "") {
      setFilteredOptions(options);
    } else {
      const matches = options.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOptions(matches);
    }
  }, [query]);

  return (
    <View className="relative bg-white w-full border h-full rounded-lg">
      {/* Text Input Field */}
      <View className="w-full h-full flex flex-row rounded-lg">
        <TextInput
          ref={textRef}
          className="p-2 text-lg w-[85%] bg-blue-200 h-full"
          value={query}
          placeholder={placeholder}
          onFocus={() => {
            setIsFocused(true);
            setFilteredOptions(options);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onChangeText={(e) => {
            setSelectedDataLabel(e);
            setQuery(e);
            setValueFunc(e);
          }}
        ></TextInput>
        <Pressable
          className="bg-red-200 right-0 absolute w-[15%] h-[100%] rounded-lg items-center justify-center border"
          onPress={() => {
            textRef.current?.blur();
          }}
        >
          <Text>✓</Text>
        </Pressable>
      </View>

      {isFocused && (
        <View
          className="bg-white w-full h-[200px] border"
          style={{ zIndex: 999, elevation: 10 }}
        >
          <FlatList
            data={filteredOptions}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setValueFunc(item.value);
                  setQuery(item.label);
                  textRef.current?.blur();
                }}
                style={{ paddingVertical: 10, paddingHorizontal: 14 }}
              >
                <Text>{item.label}</Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
}
