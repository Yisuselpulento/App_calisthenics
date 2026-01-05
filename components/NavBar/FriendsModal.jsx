import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const FriendsModal = ({ visible, onClose, user }) => {
  const [activeTab, setActiveTab] = useState("friends");
  const router = useRouter();

  if (!user) return null;

  const following = user.following?.slice(0, 10) || [];
  const followers = user.followers?.slice(0, 10) || [];
  const list = activeTab === "friends" ? following : followers;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable
              onPress={() => setActiveTab("friends")}
              style={[
                styles.tab,
                activeTab === "friends" && styles.tabActive,
              ]}
            >
              <FontAwesome5 name="user-friends" size={14} color="#fff" />
              <Text style={styles.tabText}>Siguiendo</Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("followers")}
              style={[
                styles.tab,
                activeTab === "followers" && styles.tabActive,
              ]}
            >
              <FontAwesome5 name="users" size={14} color="#fff" />
              <Text style={styles.tabText}>Seguidores</Text>
            </Pressable>
          </View>

          {/* List */}
          <ScrollView style={{ maxHeight: 260 }}>
            {list.length === 0 && (
              <Text style={styles.emptyText}>
                {activeTab === "friends"
                  ? "No sigues a nadie 😅"
                  : "Nadie te sigue todavía 😅"}
              </Text>
            )}

            {list.map((u) => (
              <Pressable
                key={u._id}
                style={styles.userRow}
                onPress={() => {
                  onClose();
                  router.push(`/profile/${u.username}`);
                }}
              >
                <Image source={{ uri: u.avatar.url }} style={styles.avatar} />
                <View>
                  <Text style={styles.name}>{u.fullName}</Text>
                  <Text style={styles.username}>@{u.username}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* Footer */}
          <Pressable
            style={styles.link}
            onPress={() => {
              onClose();
              router.push(`/(tabs)/profile/${user.username}/friends`);
            }}
          >
            <Text style={styles.linkText}>Ver todos →</Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.close}>
            <Text style={{ color: "#9CA3AF" }}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default FriendsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#111827",
    width: "90%",
    borderRadius: 12,
    padding: 16,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  tab: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#374151",
  },
  tabActive: {
    backgroundColor: "#22C55E",
  },
  tabText: {
    color: "#fff",
    fontSize: 13,
  },
  userRow: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    backgroundColor: "#1F2933",
    borderRadius: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  username: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 20,
  },
  link: {
    marginTop: 12,
    alignItems: "center",
  },
  linkText: {
    color: "#60A5FA",
  },
  close: {
    marginTop: 10,
    alignItems: "center",
  },
});
