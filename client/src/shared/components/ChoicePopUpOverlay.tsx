import { Pressable, Text, View } from "react-native";

type ChoicePopUpModuleProps = {
  header: string;
  description: string;
  options: {
    label: string;
    bgColour: string;
    fontColour: string;
    function: (...args: any[]) => any;
  }[];
  closeOverlay: () => void;
};

export default function ChoicePopUpOverlay({
  header,
  description,
  options,
  closeOverlay,
}: ChoicePopUpModuleProps) {
  return (
    <View className="absolute bottom-[40%] left-[10%] right-0 h-[25%] w-[80%] bg-white rounded-2xl p-4 items-center justify-center pt-10">
      <View className="w-full items-center">
        <Text className="text-2xl font-bold mb-2">{header}</Text>
        <Text className="text-center">{description}</Text>
      </View>
      {/* Options */}
      <View className="flex-1 mt-6">
        <View className="flex-row flex-wrap justify-between">
          {options.map((optionEntry, idx) => (
            <Pressable
              key={idx}
              className={`w-[45%] h-[50px] ${optionEntry.bgColour} items-center justify-center m-2 rounded-full`}
              onPress={() => {
                optionEntry.function();
                closeOverlay();
              }}
            >
              <Text className={`${optionEntry.fontColour}`}>
                {optionEntry.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
