import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { CasualSocketProvider } from "../context/CasualSocketContext";
import { RankedSocketProvider } from "../context/RankedSocketContext";
import { toastConfig } from "../components/toast/ToastConfig";

/* 🔔 CONFIGURACIÓN GLOBAL DE NOTIFICACIONES */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, 
    shouldShowList: true, 
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    // 🔔 Notificación recibida con la app abierta
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log("📩 Notificación recibida:", notification);
      });

    // 👉 Usuario toca la notificación
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log("👉 Notificación tocada:", response);
        // aquí luego puedes navegar con expo-router
      });

    return () => {
      // ✅ API CORRECTA (expo-notifications actual)
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SocketProvider>
          <CasualSocketProvider>
            <RankedSocketProvider>
              <StatusBar style="light" />
              <View style={styles.container}>
                {/* 🧭 Navegación */}
                <Stack screenOptions={{ headerShown: false }} />

                {/* 🔔 Toast global */}
                <Toast config={toastConfig} position="bottom" />
              </View>
            </RankedSocketProvider>
          </CasualSocketProvider>
        </SocketProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0a09",
  },
});
