import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import CardNotification from "../Cards/CardNotification";

const NotificationsDropdown = ({ closeDropdown }) => {
  const { currentUser } = useAuth();
  const notifications = currentUser?.notifications || [];
  const router = useRouter();

  const handleGoToAll = () => {
    closeDropdown();
    router.push("/notifications");
  };

  return (
    <View style={styles.dropdown}>
      <Text style={styles.title}>Notificaciones</Text>

      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No tienes notificaciones</Text>
      ) : (
        <ScrollView
          style={{ maxHeight: 240 }}
          contentContainerStyle={{ paddingBottom: 4 }}
        >
          {notifications.slice(0, 3).map((n) => (
            <CardNotification
              key={n._id}
              notification={n}
              closeDropdown={closeDropdown}
            />
          ))}
        </ScrollView>
      )}

      <Pressable onPress={handleGoToAll} style={{ marginTop: 8 }}>
        <Text style={styles.viewAll}>Ver todas</Text>
      </Pressable>
    </View>
  );
};

export default NotificationsDropdown;

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    right: 0,
    marginTop: 8,
    width: 320,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 50,
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 16,
  },
  noNotifications: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
  viewAll: {
    color: "#3B82F6",
    textAlign: "center",
    fontSize: 14,
  },
});
