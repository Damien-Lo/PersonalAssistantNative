import { Text, View } from "react-native";
import { CalendarEvent } from "../../../domain/calendar/CalendarTypes";
import { useEffect, useState } from "react";

type EventBoxProps = {
  event: CalendarEvent;
};

const EventBox: React.FC<EventBoxProps> = ({ event }) => {
  const [diningListString, setDiningListString] = useState<string>("");
  const [bgColour, setBgColour] = useState<string>("bg-gray-500");

  useEffect(() => {
    if (event.type === "Dining Event") {
      setBgColour("bg-yellow-500");
      const str = event.dishList
        .map((dishEntry) => dishEntry.dishObject.name)
        .join(", ");
      setDiningListString(str);
    }
  }, [event]);

  return (
    <View
      className={`w-full h-full rounded-lg ${bgColour} p-2 shadow-sm border-gray-100`}
    >
      <Text className="text-white font-bold">{event.title}</Text>
      {event.type === "Dining Event" && (
        <Text className="text-white">{diningListString}</Text>
      )}
    </View>
  );
};

export default EventBox;
