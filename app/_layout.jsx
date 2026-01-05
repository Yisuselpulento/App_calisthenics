import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";

import Toast from "react-native-toast-message";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <View style={{ flex: 1, backgroundColor: "#0c0a09" }}>
          <StatusBar style="light" backgroundColor="#0c0a09" />
          <Stack screenOptions={{ headerShown: false }} />

          {/* 🔔 Toast nativo */}
          <Toast position="bottom" />
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
