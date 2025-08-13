import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { ScrollView, Text, View } from "react-native";

const SettingsPage = () => {
  const { user, login, register, logout, authFetch, refreshOnce, loading } =
    useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 p-2">
          <Text>Settings Page</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsPage;
