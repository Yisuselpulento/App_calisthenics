import { View, StyleSheet } from "react-native";
import { Slot, usePathname } from "expo-router";
import { Video } from "expo-av";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";
import NavBar from "../../components/NavBar/NavBar";
import BottomNavbar, {
  BOTTOM_NAV_HEIGHT,
} from "../../components/NavBar/BottomNavBar";

export default function TabsLayout() {
  const pathname = usePathname();
  const { viewedProfile } = useAuth();
  const insets = useSafeAreaInsets();

  const isProfilePage = pathname?.startsWith("/profile/");
  const showVideo = isProfilePage && viewedProfile?.videoProfile?.url;

  return (
    <View style={styles.container}>
      {/* 🎥 Video de fondo */}
      {showVideo && (
        <View style={StyleSheet.absoluteFill}>
          
          <Video
            source={{ uri: viewedProfile.videoProfile.url }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            isLooping
            shouldPlay
            isMuted
          />
          <View style={styles.overlay} />
        </View>
      )}

      {/* ✅ SAFE AREA REAL */}
      <SafeAreaView style={styles.safe} edges={["top"]}>
        {/* 🔝 Navbar */}
        <NavBar />

        {/* 🧠 CONTENIDO REAL */}
        <View
          style={[
            styles.main,
            {
              paddingBottom:
                BOTTOM_NAV_HEIGHT + insets.bottom,
            },
          ]}
        >
          <Slot />
        </View> 
      </SafeAreaView>
      <BottomNavbar />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0a09",

  },
  safe: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  main: {
    flex: 1,
  },
});
