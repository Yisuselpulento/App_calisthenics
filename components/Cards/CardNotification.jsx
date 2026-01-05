import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
// Reemplaza los servicios según tu App
import { markNotificationAsReadService } from "../../Services/notificationFetching";
import { respondChallengeService } from "../../Services/challengeFetching";

const CardNotification = ({ notification, closeDropdown }) => {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // "accept" | "reject" | null

  const handleMarkRead = async () => {
    setLoading(true);
    const res = await markNotificationAsReadService(notification._id);
    if (!res.success) console.warn(res.message);
    setLoading(false);
  };

  const handleChallengeResponse = async (accepted) => {
    const action = accepted ? "accept" : "reject";
    setActionLoading(action);

    const res = await respondChallengeService({
      challengeId: notification.challenge,
      accepted,
    });

    if (!res.success) {
      console.warn(res.message);
      setActionLoading(null);
      return;
    }

    console.log(res.message);
    closeDropdown();
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
          <Pressable
            onPress={handleMarkRead}
            disabled={loading}
            style={{ padding: 4 }}
          >
            <Text style={styles.markReadText}>{loading ? "..." : "Marcar"}</Text>
          </Pressable>
        )}
      </View>

      {isChallenge && !notification.read && (
        <View style={{ marginTop: 8 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => handleChallengeResponse(true)}
              disabled={actionLoading !== null}
              style={[styles.challengeButton, styles.acceptButton]}
            >
              <Text style={styles.challengeButtonText}>
                {actionLoading === "accept" ? "Aceptando..." : "Aceptar"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleChallengeResponse(false)}
              disabled={actionLoading !== null}
              style={[styles.challengeButton, styles.rejectButton]}
            >
              <Text style={styles.challengeButtonText}>
                {actionLoading === "reject" ? "Rechazando..." : "Rechazar"}
              </Text>
            </Pressable>
          </View>

          {actionLoading && (
            <Text style={{ color: "#FACC15", fontSize: 12, marginTop: 4 }}>
              Procesando respuesta...
            </Text>
          )}
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
    backgroundColor: "#1F2937",
  },
  unread: {
    backgroundColor: "#374151",
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
  markReadText: {
    color: "#3B82F6",
    fontSize: 12,
  },
  challengeButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#16A34A",
  },
  rejectButton: {
    backgroundColor: "#DC2626",
  },
  challengeButtonText: {
    color: "#fff",
    fontSize: 12,
  },
});
