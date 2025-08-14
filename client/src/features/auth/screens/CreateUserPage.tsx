import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../../navigation/NavTypes";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { useAuth } from "../state/AuthContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CreateUserPage() {
  const { user, login, register, logout, authFetch, refreshOnce, loading } =
    useAuth();

  const navigation = useNavigation<Nav>();
  const [emailInput, setEmailInput] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const createUserClicked = async () => {
    try {
      await register(emailInput, password);
      navigation.navigate("HomePage");
    } catch (e: any) {
      Alert.alert("Regristration failed", e?.message ?? "Please try again");
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Centered content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-black dark:text-white mb-4">
          Create User Page
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
            createUserClicked();
          }}
          className="bg-blue-500 px-4 py-2 rounded mb-4"
        >
          <Text className="text-white">Create User</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("LoginPage")}
          className="px-4 py-2 rounded w-[50px] h-[50px] items-center justify-center absolute top-10 left-5"
        >
          <Text className="text-gray-400 text-xl">X</Text>
        </Pressable>
      </View>
    </View>
  );
}
