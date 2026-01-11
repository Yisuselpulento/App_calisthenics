import { View, Text, Pressable, StyleSheet } from "react-native";
import { Slot, useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Spinner from "../../../../components/Spinner/Spinner";


export default function ProfileLayout() {
  const { username } = useLocalSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { viewedProfile, loadProfile, profileLoading } = useAuth();

  useEffect(() => {
    if (username) {
      loadProfile(username);
    }
  }, [username]);

  if (profileLoading || !viewedProfile) {
    return (
      <View style={styles.loader}>
        <Spinner size={48} />
      </View>
    );
  }

  const isActive = (route) => pathname === route;

  return (
    <View style={styles.container}>
      {/* 🔹 Navbar interna */}
      <View style={styles.navbar}>
        <Tab
          label="Perfil"
          active={isActive(`/profile/${username}`)}
          onPress={() => router.push(`/profile/${username}`)}
        />
        <Tab
          label="Skills"
          active={isActive(`/profile/${username}/skills`)}
          onPress={() => router.push(`/profile/${username}/skills`)}
        />
        <Tab
          label="Historial"
          active={isActive(`/profile/${username}/historial`)}
          onPress={() => router.push(`/profile/${username}/historial`)}
        />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

/* 🔹 Tab reutilizable */
function Tab({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tab,
        active && styles.tabActive,
      ]}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#facc15", // amarillo
  },
  tabText: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#facc15",
  },
  content: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
