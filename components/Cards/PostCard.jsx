import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import VideoPlayer from "../VideoPlayer";

export default function PostCard({ activity, activeVideoId }) {
  const router = useRouter();
  const { user, type, message, createdAt, metadata } = activity;

  // 👉 SOLO este post puede reproducir video
  const isActive = activity._id === activeVideoId;

  const formattedDate = new Date(createdAt).toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getRoute = () => {
    switch (type) {
      case "NEW_COMBO":
        return `/profile/${user.username}/combos/${metadata?.comboId}`;
      case "NEW_SKILL":
        return `/profile/${user.username}/skill/${metadata?.userSkillVariantId}`;
      default:
        return `/profile/${user.username}`;
    }
  };

  const getDescription = () => {
    switch (type) {
      case "NEW_COMBO":
        return `${message} 💥`;
      case "MATCH_WIN":
        return "ha ganado una batalla 🏆";
      case "MATCH_LOSS":
        return "ha perdido una batalla ⚔️";
      case "NEW_TEAM":
        return `ha creado un team ${metadata?.teamName || "???"} 👥`;
      default:
        return message;
    }
  };

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(getRoute())}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.user}>
          <Image
            source={{ uri: user.avatar?.url }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{user.username}</Text>
        </View>

        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      {/* MENSAJE */}
      <Text style={styles.message}>{getDescription()}</Text>

      {/* VIDEO (solo si está activo) */}
      {metadata?.videoUrl && (
        <VideoPlayer
          src={metadata.videoUrl}
          shouldPlay={isActive}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1917",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  username: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  date: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  message: {
    color: "#E5E7EB",
    fontSize: 13,
    marginBottom: 6,
  },
});
