import { Text, View } from "react-native";
import { CalendarEvent } from "../../../domain/calendar/CalendarTypes";

type EventBoxProps = {
  event: CalendarEvent;
};

const EventBox: React.FC<EventBoxProps> = ({ event }) => {
  return (
    <View className="w-full h-full rounded-lg bg-yellow-500 p-2 shadow-sm border-gray-100">
      <Text className="text-white font-bold">{event.title}</Text>
    </View>
  );
};

export default EventBox;
