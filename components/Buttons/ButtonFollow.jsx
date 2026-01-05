import { Pressable, Text, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ButtonFollow({ targetUserId }) {
  const { currentUser, toggleFollow, followLoading } = useAuth();

  const isFollowing = currentUser?.following?.some(
    (f) => f._id === targetUserId
  );

  if (isFollowing) return null;

  return (
    <Pressable
      disabled={followLoading}
      onPress={() => toggleFollow({ _id: targetUserId })}
      style={[
        styles.button,
        followLoading && styles.disabled,
      ]}
    >
      <Text style={styles.text}>
        {followLoading ? "Cargando..." : "Seguir"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
