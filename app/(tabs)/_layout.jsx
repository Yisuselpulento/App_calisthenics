import { View, StyleSheet } from "react-native";
import { Slot, usePathname } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
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
  const videoUri = isProfilePage
    ? viewedProfile?.videoProfile?.url ?? null
    : null;

  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (!player) return;
    if (videoUri) {
      player.replace(videoUri);
      player.play();
    } else {
      player.pause();
    }
  }, [player, videoUri]);

  return (
    <View style={styles.container}>
      {/* 🎥 Video de fondo */}
      {videoUri && (
        <View style={StyleSheet.absoluteFill}>
          <VideoView
            style={StyleSheet.absoluteFill}
            player={player}
            contentFit="cover"
            nativeControls={false}
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
