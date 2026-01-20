import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

import { markNotificationAsReadService } from "../../Services/notificationFetching";
import { respondChallengeService } from "../../Services/challengeFetching";

const CardNotification = ({ notification, closeDropdown }) => {
  const { currentUser, updateCurrentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const handleMarkRead = async () => {
    if (loading) return;
    setLoading(true);

    const res = await markNotificationAsReadService(notification._id);

    if (res?.success && res.user) {
      updateCurrentUser(res.user); // 🔥 CLAVE
    }

    setLoading(false);
  };

  const handleChallengeResponse = async (accepted) => {
    const action = accepted ? "accept" : "reject";
    setActionLoading(action);

    const res = await respondChallengeService({
      challengeId: notification.challenge,
      accepted,
    });

    if (res?.success && res.user) {
      updateCurrentUser(res.user); // 🔥 CLAVE
      closeDropdown();
    }

    setActionLoading(null);
  };

  const isChallenge = Boolean(notification.challenge);

  return (
    <View
      style={[
        styles.card,
        notification.read ? styles.read : styles.unread,
      ]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.message}>{notification.message}</Text>
          <Text style={styles.date}>
            {new Date(notification.createdAt).toLocaleString()}
          </Text>
        </View>

        {!notification.read && !isChallenge && (
          <Pressable onPress={handleMarkRead} disabled={loading}>
            <Text style={styles.markRead}>
              {loading ? "..." : "Marcar"}
            </Text>
          </Pressable>
        )}
      </View>

      {isChallenge && !notification.read && (
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, styles.accept]}
            disabled={actionLoading !== null}
            onPress={() => handleChallengeResponse(true)}
          >
            <Text style={styles.actionText}>
              {actionLoading === "accept" ? "Aceptando..." : "Aceptar"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, styles.reject]}
            disabled={actionLoading !== null}
            onPress={() => handleChallengeResponse(false)}
          >
            <Text style={styles.actionText}>
              {actionLoading === "reject" ? "Rechazando..." : "Rechazar"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CardNotification;

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  read: {
    backgroundColor: "#292524",
  },
  unread: {
    backgroundColor: "#57534d",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  message: {
    color: "#fff",
    fontSize: 14,
  },
  date: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  markRead: {
    color: "#3B82F6",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  accept: {
    backgroundColor: "#16A34A",
  },
  reject: {
    backgroundColor: "#DC2626",
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
  },
});
