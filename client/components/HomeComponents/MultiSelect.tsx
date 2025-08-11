import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

type CustomMultiSelectProps = {
  options: string[];
  setFunc: (values: string[]) => void; // lift selection to parent
  placeholder?: string;
};

export default function CustomMultiSelect({
  options,
  setFunc,
  placeholder = "",
}: CustomMultiSelectProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [formattedData, setFormattedData] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    setFormattedData(options.map((item) => ({ label: item, value: item })));
  }, [options]);

  return (
    <View>
      <MultiSelect
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
          paddingHorizontal: 12,
        }}
        placeholderStyle={{ color: "#999" }}
        inputSearchStyle={{ height: 40 }}
        iconStyle={{ width: 20, height: 20 }}
        data={formattedData}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={selectedItems}
        onChange={(selected: string[]) => {
          setSelectedItems(selected);
          setFunc(selected);
        }}
        search
        searchPlaceholder="Search…"
        renderSelectedItem={(item, unSelect) => (
          <View
            key={item.value}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 6,
              paddingHorizontal: 10,
              margin: 4,
              borderRadius: 16,
              backgroundColor: "#e5e7eb",
            }}
          >
            <Text>{item.label}</Text>
            <Text
              onPress={() => {
                const val = String(item.value);
                const next = selectedItems.filter((v) => v !== val);
                setSelectedItems(next);
                setFunc(next);
                unSelect?.(item);
              }}
              style={{ marginLeft: 8 }}
            >
              ✕
            </Text>
          </View>
        )}
        containerStyle={{ borderRadius: 12, elevation: 6 }}
        selectedStyle={{ borderRadius: 12 }}
      />
    </View>
  );
}
