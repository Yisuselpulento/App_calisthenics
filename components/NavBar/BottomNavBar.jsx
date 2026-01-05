import { View, StyleSheet, Pressable } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FriendsModal from "./FriendsModal";

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [showFriends, setShowFriends] = useState(false);

  const isActive = (path) => pathname === path;

  if (!currentUser) return null;

  return (
    <View style={styles.container}>
      {/* HOME */}
      <Pressable onPress={() => router.push("/")}>
        <FontAwesome
          name="home"
          size={22}
          color={isActive("/") ? "#22C55E" : "#fff"}
        />
      </Pressable>

      {/* RANKS */}
      <Pressable onPress={() => router.push("/ranks")}>
        <FontAwesome5
          name="trophy"
          size={22}
          color={isActive("/ranks") ? "#22C55E" : "#fff"}
        />
      </Pressable>

      {/* FRIENDS */}
      <Pressable onPress={() => setShowFriends(true)}>
        <FontAwesome5
          name="users"
          size={22}
          color={showFriends ? "#22C55E" : "#fff"}
        />
      </Pressable>

      {/* PROFILE */}
      <Pressable
        onPress={() => router.push(`/profile/${currentUser.username}`)}
      >
        <FontAwesome
          name="user"
          size={22}
          color={
            pathname.startsWith(`/profile/${currentUser.username}`)
              ? "#22C55E"
              : "#fff"
          }
        />
      </Pressable>

      {/* MODAL */}
      <FriendsModal
        visible={showFriends}
        onClose={() => setShowFriends(false)}
        user={currentUser}
      />
    </View>
  );
};

export default BottomNavbar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: "#111827",
    borderTopWidth: 1,
    borderTopColor: "#374151",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 50,
  },
});
