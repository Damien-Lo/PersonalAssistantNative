import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/state/AuthContext";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/NavTypes";
import { useNavigation } from "@react-navigation/native";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SettingsPage = () => {
  const { user, logout, loading } = useAuth();
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState(user?.email ?? "");
  const [darkMode, setDarkMode] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  // determine if changes exist to enable "Save"
  const isDirty = useMemo(() => email !== (user?.email ?? ""), [email, user]);

  // fake loading UX on mount (optional)
  useEffect(() => {
    // preload toggles from user prefs if you have them
  }, []);

  const onClose = () => navigation.navigate("HomePage");

  const onSave = async () => {
    // TODO: call your backend to update account email
    // await authFetch('/api/me', { method: 'PATCH', body: JSON.stringify({ email }) })
    // Then refresh user state if needed:
    // await refreshOnce();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-5 pt-3 pb-2 border-b border-gray-200 bg-white">
          <View className="flex-row items-center">
            <Pressable
              onPress={onClose}
              className="w-10 h-10 rounded-full items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Close settings"
            >
              <Text className="text-gray-400 text-2xl">×</Text>
            </Pressable>
            <Text className="text-2xl font-extrabold text-gray-900 ml-1">
              Settings
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <ScrollView
            className="px-5 py-4"
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {/* Profile Card */}
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
              <View className="flex-row items-center">
                {/* Avatar */}
                <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center mr-3">
                  <Text className="text-indigo-700 font-bold text-lg">
                    {user?.email?.[0]?.toUpperCase() ?? "U"}
                  </Text>
                </View>

                {/* Email only */}
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">
                    {user?.email ?? "No email set"}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Your registered email
                  </Text>
                </View>
              </View>
            </View>

            {/* Account Section */}
            <Section title="Account">
              <Row>
                <Label text="Email" />
                <TextInput
                  className="flex-1 border border-gray-300 rounded-xl px-3 h-10 text-gray-800"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="you@example.com"
                />
              </Row>

              <Hint text="Use an email you check often. This is used for receipts and account recovery." />
            </Section>

            {/* Preferences Section */}
            <Section title="Preferences">
              <ToggleRow
                label="Dark Mode"
                value={darkMode}
                onValueChange={setDarkMode}
                hint="Use a darker theme to reduce eye strain."
              />
              <Divider />
              <ToggleRow
                label="Push Notifications"
                value={pushEnabled}
                onValueChange={setPushEnabled}
                hint="Get updates about important activity."
              />
            </Section>

            {/* Actions */}
            <View className="mt-6 gap-3">
              <Pressable
                disabled={!isDirty}
                onPress={onSave}
                className={`h-12 rounded-2xl items-center justify-center ${
                  isDirty ? "bg-indigo-600" : "bg-indigo-300"
                }`}
                accessibilityRole="button"
                accessibilityState={{ disabled: !isDirty }}
              >
                <Text className="text-white font-semibold text-base">
                  Save Changes
                </Text>
              </Pressable>

              <Pressable
                onPress={logout}
                className="h-12 rounded-2xl items-center justify-center bg-white border border-red-300"
                accessibilityRole="button"
              >
                <Text className="text-red-600 font-semibold text-base">
                  Sign Out
                </Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-xs text-gray-400">App v1.0.0</Text>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* ---------- Small UI helpers (same file) ---------- */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-5">
    <Text className="text-xs font-semibold text-gray-500 mb-2">
      {title.toUpperCase()}
    </Text>
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {children}
    </View>
  </View>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <View className="flex-row items-center gap-3">{children}</View>
);

const Label = ({ text }: { text: string }) => (
  <Text className="w-24 text-gray-600 font-medium">{text}</Text>
);

const Hint = ({ text }: { text: string }) => (
  <Text className="text-xs text-gray-500 mt-3">{text}</Text>
);

const Divider = () => <View className="h-px bg-gray-200 my-3" />;

const ToggleRow = ({
  label,
  value,
  onValueChange,
  hint,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  hint?: string;
}) => (
  <View>
    <View className="flex-row items-center justify-between">
      <Text className="text-gray-800 font-medium">{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
    {!!hint && <Text className="text-xs text-gray-500 mt-1">{hint}</Text>}
  </View>
);

export default SettingsPage;
