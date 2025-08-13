import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../navigation/NavTypes";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginPage() {
  const { user, login, register, logout, authFetch, refreshOnce, loading } =
    useAuth();
  const navigation = useNavigation<Nav>();
  const [emailInput, setEmailInput] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginClicked = async () => {
    try {
      const user = await login(emailInput, password);
      if (user) {
        navigation.navigate("HomePage");
      }
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Please try again");
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Centered content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-black dark:text-white mb-4">
          Login Page
        </Text>
        <TextInput
          className="w-[300px] h-[50px] border rounded-full mb-4 p-2"
          placeholder="Enter Email"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(value) => {
            setEmailInput(value);
          }}
        ></TextInput>

        <TextInput
          className="w-[300px] h-[50px] border rounded-full mb-4 p-2"
          placeholder="Enter Password"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(value) => {
            setPassword(value);
          }}
        ></TextInput>

        <Pressable
          onPress={() => {
            loginClicked();
          }}
          className="bg-blue-500 px-4 py-2 rounded mb-4"
        >
          <Text className="text-white">Login</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("CreateUserPage")}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white">Create User</Text>
        </Pressable>
      </View>
    </View>
  );
}
