import { useState, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";

import UserItem from "../../../../components/Cards/UserItem";
import ConfirmUnfollowModal from "../../../../components/Modals/ConfirmUnfollowModal";
import { useAuth } from "../../../../context/AuthContext";

export default function Friends() {
  const { username } = useLocalSearchParams();
  const { currentUser, toggleFollow } = useAuth();

  const [tab, setTab] = useState("following");
  const [search, setSearch] = useState("");
  const [unfollowTarget, setUnfollowTarget] = useState(null);

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Cargando…</Text>
      </View>
    );
  }

  if (currentUser.username !== username) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Perfil no disponible</Text>
      </View>
    );
  }

  const followers = currentUser.followers || [];
  const following = currentUser.following || [];

  const filteredList = useMemo(() => {
    const base = tab === "following" ? following : followers;
    return base.filter(
      (u) =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [tab, search, following, followers]);

  const handleToggleFollow = (user) => {
    const isFollowing = following.some((f) => f._id === user._id);

    if (isFollowing) {
      setUnfollowTarget(user);
    } else {
      toggleFollow(user);
    }
  };

  return (
    <View style={styles.container}>
      {/* TABS */}
      <View style={styles.tabs}>
        <Text
          style={[styles.tab, tab === "following" && styles.tabActive]}
          onPress={() => setTab("following")}
        >
          Siguiendo ({following.length})
        </Text>

        <Text
          style={[styles.tab, tab === "followers" && styles.tabActive]}
          onPress={() => setTab("followers")}
        >
          Seguidores ({followers.length})
        </Text>
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Buscar usuario…"
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* LIST */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            isFollowing={following.some((f) => f._id === item._id)}
            onToggleFollow={handleToggleFollow}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No se encontraron usuarios.</Text>
        }
      />

      {/* MODAL */}
      <ConfirmUnfollowModal
        visible={!!unfollowTarget}
        onCancel={() => setUnfollowTarget(null)}
        onConfirm={() => {
          toggleFollow(unfollowTarget);
          setUnfollowTarget(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#1F2937",
    color: "#9CA3AF",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#2563EB",
    color: "white",
  },
  search: {
    backgroundColor: "#1F2937",
    color: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#9CA3AF",
  },
});
