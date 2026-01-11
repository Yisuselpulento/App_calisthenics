import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";

import {
  getUserNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
} from "../../Services/notificationFetching";

import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner/Spinner";

export default function Notifications() {
  const { updateCurrentUser } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const res = await getUserNotificationsService();

    if (res?.success) {
      setNotifications(res.notifications);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id) => {
    const res = await markNotificationAsReadService(id);

    if (res?.success) {
      setNotifications(res.user.notifications);
      updateCurrentUser(res.user);
    }
  };

  const handleMarkAll = async () => {
    const res = await markAllNotificationsAsReadService();

    if (res?.success) {
      setNotifications(res.user.notifications);
      updateCurrentUser(res.user);
    }
  };

  /* 🔄 Loading */
  if (loading) {
    return (
      <View style={styles.loader}>
        <Spinner size={32} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tus notificaciones</Text>

        {notifications.length > 0 && (
          <Pressable onPress={handleMarkAll}>
            <Text style={styles.markAll}>Marcar todas</Text>
          </Pressable>
        )}
      </View>

      {/* Sin notificaciones */}
      {notifications.length === 0 ? (
        <Text style={styles.empty}>
          No tienes notificaciones todavía 📭
        </Text>
      ) : (
        <View style={styles.list}>
          {notifications.map((n) => (
            <View
              key={n._id}
              style={[
                styles.card,
                n.read ? styles.cardRead : styles.cardUnread,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.message}>{n.message}</Text>
                <Text style={styles.date}>
                  {new Date(n.createdAt).toLocaleString()}
                </Text>
              </View>

              {!n.read && (
                <Pressable onPress={() => handleMarkRead(n._id)}>
                  <Text style={styles.markOne}>Marcar</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  markAll: {
    fontSize: 13,
    color: "#60a5fa",
  },
  empty: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    gap: 12,
  },
  cardUnread: {
    backgroundColor: "#44403c",
  },
  cardRead: {
    backgroundColor: "#292524",
  },
  message: {
    color: "#fff",
    fontSize: 14,
  },
  date: {
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 4,
  },
  markOne: {
    fontSize: 12,
    color: "#60a5fa",
  },
});

