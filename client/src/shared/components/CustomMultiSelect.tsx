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
  valueToSet: string[];
  setValueFunc: Dispatch<SetStateAction<any>>;
  placeholder?: string;
};

export default function CustomMultiSelect({
  options,
  valueToSet,
  setValueFunc,
  placeholder = "Select or type…",
}: Props) {
  const textRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDataLabel, setSelectedDataLabel] = useState<string>("");

  const [localValueToSet, setLocalValueToSet] = useState<string[]>(valueToSet);

  const [query, setQuery] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<
    { label: string; value: any }[]
  >([]);

  useEffect(() => {
    if (query === "") {
      setFilteredOptions(options);
    } else {
      let matches = options.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );

      if (matches.length === 0) {
        matches = [{ label: query, value: query }];
      }

      setFilteredOptions(matches);
    }
  }, [query]);

  useEffect(() => {
    setValueFunc(localValueToSet);
  }, [localValueToSet]);

  return (
    <View className="relative bg-white w-full border h-full rounded-lg">
      {/* Text Input Field */}
      <View className="w-full h-full flex flex-row rounded-lg bg-blue-200">
        <View className="w-[85%] flex flex-row items-center flex-wrap">
          {valueToSet.map((value, idx) => (
            <View
              key={`${value}-${idx}`}
              className="w-[90px] h-[30px] items-center justify-center rounded-full bg-gray-200 flex flex-row mr-2"
            >
              <Pressable
                className="mr-2 items-center bg-gray-400 w-[15px] h-[15px] rounded-full justify-center"
                onPress={() => {
                  setLocalValueToSet((prev) =>
                    prev.filter(
                      (item) => item?.toLowerCase() !== value?.toLowerCase()
                    )
                  );
                }}
              >
                <Text className="text-center">x</Text>
              </Pressable>
              <Text>{value}</Text>
            </View>
          ))}

          <TextInput
            ref={textRef}
            className="p-2 text-lg flex-1 bg-blue-200 h-full"
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
            }}
          />
        </View>

        <Pressable
          className="bg-red-200 right-0 absolute w-[15%] h-[100%] rounded-lg items-center justify-center border"
          onPress={() => {
            if (isFocused) {
              textRef.current?.blur();
              setIsFocused(false);
            } else {
              textRef.current?.focus();
              setIsFocused(true);
            }
          }}
        >
          <Text>▽</Text>
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
                  setLocalValueToSet((prev: any) => [...prev, item.value]);
                  setQuery("");
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
