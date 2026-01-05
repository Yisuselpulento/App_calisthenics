import { View, StyleSheet } from "react-native";
import { Slot, usePathname } from "expo-router";
import { Video } from "expo-av";

import { useAuth } from "../../context/AuthContext";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer";
import BottomNavbar from "../../components/NavBar/BottomNavBar";

export default function TabsLayout() {
  const pathname = usePathname();
  const { viewedProfile } = useAuth();

  const isProfilePage = pathname?.startsWith("/profile/");
  const showVideo = isProfilePage && viewedProfile?.videoProfile?.url;

  return (
    <View style={styles.container}>
      {/* Video de fondo */}
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

      {/* Navbar */}
      <NavBar />

      {/* CONTENIDO REAL DE LA RUTA */}
      <View style={styles.main}>
        <Slot />
      </View>

      {/* Bottom Nav */}
      <BottomNavbar />

      {/* Footer */}
      <Footer pathname={pathname} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  main: {
    flex: 1,
  },
});
