import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import SearchBar from "./SearchBar";
import NotificationBadge from "./NotificationBadge";
import NotificationsDropdown from "./NotificationsDropdown";
import ButtonLogout from "./ButtonLogout";

const NavBar = () => {
  const { currentUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchWrapper}>
        <SearchBar />
      </View>

      {/* ICONOS */}
      <View style={styles.actions}>
        <View style={styles.relative}>
          <Pressable
          onPress={() => setShowDropdown((prev) => !prev)}
          style={({ pressed }) => [
            styles.iconButton,
            showDropdown && styles.activeButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <FontAwesome
            name="bell"
            size={22}
            color={showDropdown ? "#fff" : "#D1D5DB"}
          />
          <NotificationBadge count={currentUser?.notificationsCount} />
        </Pressable>

          {showDropdown && (
            <NotificationsDropdown
              closeDropdown={() => setShowDropdown(false)}
            />
          )}
        </View>

        <ButtonLogout />
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8, // ahora usamos padding vertical fijo
  },

  searchWrapper: {
    flex: 1,
    marginRight: 12,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  relative: {
    position: "relative",
  },

  iconButton: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: "#1C1917",
    justifyContent: "center",
    alignItems: "center",
  },

  activeButton: {
    backgroundColor: "#3B82F6",
  },
});
