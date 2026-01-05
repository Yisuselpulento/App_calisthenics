import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function UserItem({ user, isFollowing, onToggleFollow }) {
  const { followLoading } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.user}
        onPress={() => router.push(`/profile/${user.username}`)}
      >
        <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </Pressable>

      <Pressable
        disabled={followLoading}
        onPress={() => onToggleFollow(user)}
        style={[
          styles.button,
          isFollowing ? styles.unfollow : styles.follow,
          followLoading && { opacity: 0.6 },
        ]}
      >
        <Text style={styles.buttonText}>
          {followLoading
            ? "Cargando..."
            : isFollowing
            ? "Dejar de seguir"
            : "Seguir"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    color: "white",
    fontWeight: "600",
  },
  username: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  follow: {
    backgroundColor: "#16A34A",
  },
  unfollow: {
    backgroundColor: "#DC2626",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
});
