import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Toast from "react-native-toast-message";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar
          style="light"
          translucent
          backgroundColor="transparent"
        />

        <Stack screenOptions={{ headerShown: false }} />

        <Toast position="bottom" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
