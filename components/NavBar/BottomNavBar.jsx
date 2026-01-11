import { View, StyleSheet, Pressable } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";
import FriendsModal from "./FriendsModal";
import { COLORS } from "../../constants/colors";

/** 🔹 Altura base del navbar (sin safe area) */
export const BOTTOM_NAV_HEIGHT = 55;

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [showFriends, setShowFriends] = useState(false);
  const insets = useSafeAreaInsets();

  if (!currentUser) return null;

  const isActive = (path) => pathname === path;

  const iconColor = (active, pressed) => {
    if (pressed) return COLORS.primaryHover;
    if (active) return COLORS.primary;
    return COLORS.textPrimary;
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          height: BOTTOM_NAV_HEIGHT + insets.bottom,
        },
      ]}
    >
      {/* HOME */}
      <Pressable onPress={() => router.push("/")}>
        {({ pressed }) => (
          <FontAwesome
            name="home"
            size={22}
            color={iconColor(isActive("/"), pressed)}
          />
        )}
      </Pressable>

      {/* RANKS */}
      <Pressable onPress={() => router.push("/ranks")}>
        {({ pressed }) => (
          <FontAwesome5
            name="trophy"
            size={22}
            color={iconColor(isActive("/ranks"), pressed)}
          />
        )}
      </Pressable>

      {/* FRIENDS */}
      <Pressable onPress={() => setShowFriends(true)}>
        {({ pressed }) => (
          <FontAwesome5
            name="users"
            size={22}
            color={iconColor(showFriends, pressed)}
          />
        )}
      </Pressable>

      {/* PROFILE */}
      <Pressable
        onPress={() => router.push(`/profile/${currentUser.username}`)}
      >
        {({ pressed }) => (
          <FontAwesome
            name="user"
            size={22}
            color={iconColor(
              pathname.startsWith(`/profile/${currentUser.username}`),
              pressed
            )}
          />
        )}
      </Pressable>

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

    backgroundColor: COLORS.secondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.cancelButton,

    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    zIndex: 50,
  },
});

