import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { getRankedLeaderboardService } from "../../Services/userFetching";
import { getRankingColor } from "../../helpers/getRankingColor";
import RankedSearchButton from "../../components/Buttons/RankedSearchButton";
import Pagination from "../../components/Pagination";

const PAGE_LIMIT = 10;

export default function Ranks() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("static");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  const safeElo = (user) =>
    user?.ranking?.[type]?.elo != null
      ? Math.round(user.ranking[type].elo)
      : 0;

  // 🔄 Cargar leaderboard
  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);

      const res = await getRankedLeaderboardService({
        type,
        page,
        limit: PAGE_LIMIT,
      });

      if (res.success) {
        setUsers(res.data.leaderboard || []);
        setMe(res.data.me || null);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }

      setLoading(false);
    };

    loadLeaderboard();
  }, [type, page]);

  // 🔁 Cambiar tipo
  const handleTypeChange = (newType) => {
    if (newType === type) return;
    setType(newType);
    setPage(1);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Cargando ranking...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Ranking Ranked</Text>
        <RankedSearchButton />
      </View>


      {/* BOTONES DE TIPO */}
      <View style={styles.typeButtons}>
        {["static", "dynamic"].map((t) => (
          <Pressable
            key={t}
            onPress={() => handleTypeChange(t)}
            style={[
              styles.typeButton,
              type === t && styles.typeButtonActive,
            ]}
          >
            <Text
              style={[
                styles.typeText,
                type === t && styles.typeTextActive,
              ]}
            >
              {t === "static" ? "Static" : "Dynamic"}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* LEADERBOARD */}
      <View style={styles.list}>
        {users.map((user, i) => {
          const globalRank = i + 1 + (page - 1) * PAGE_LIMIT;

          return (
            <Pressable
              key={user._id}
              style={styles.row}
              onPress={() => router.push(`/profile/${user.username}`)}
            >
              <View style={styles.left}>
                <Text
                  style={[
                    styles.rank,
                    globalRank === 1 && styles.gold,
                    globalRank === 2 && styles.silver,
                    globalRank === 3 && styles.bronze,
                  ]}
                >
                  {globalRank}
                </Text>

                <Image
                  source={{ uri: user.avatar?.url }}
                  style={styles.avatar}
                />

                <View>
                  <Text style={styles.name}>{user.fullName}</Text>
                  <Text style={styles.username}>@{user.username}</Text>
                </View>
              </View>

              <View style={styles.right}>
                <View style={styles.eloRow}>
                  <FontAwesome5
                    name="trophy"
                    size={16}
                    color={getRankingColor(
                      user.ranking?.[type]?.tier,
                      true
                    )}
                  />
                  <Text style={styles.elo}>{safeElo(user)}</Text>
                </View>

                <Text
                  style={[
                    styles.tier,
                    {
                      color: getRankingColor(
                        user.ranking?.[type]?.tier,
                        true
                      ),
                    },
                  ]}
                >
                  {user.ranking?.[type]?.tier || "Bronze"}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* PAGINACIÓN */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* MI POSICIÓN */}
      {me && (
        <View style={styles.meCard}>
          <Text style={styles.mutedSmall}>Tu posición</Text>

          <View style={styles.meRow}>
            <View style={styles.left}>
              <Text style={styles.meRank}>#{me.rank}</Text>

              <Image
                source={{ uri: me.avatar?.url }}
                style={styles.meAvatar}
              />

              <Text style={styles.name}>@{me.username}</Text>
            </View>

            <View style={styles.right}>
              <Text style={styles.meElo}>{safeElo(me)} ELO</Text>
              <Text style={styles.mutedSmall}>
                {me.ranking?.[type]?.tier || "Bronze"}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },

  muted: { color: "#9CA3AF" },
  mutedSmall: { color: "#9CA3AF", fontSize: 12 },

  typeButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  typeButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#374151",
  },

  typeButtonActive: { backgroundColor: "#FACC15" },

  typeText: { color: "#D1D5DB" },
  typeTextActive: { color: "#000", fontWeight: "600" },

  list: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
    backgroundColor: "#1C1917",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#1F2937",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  right: { alignItems: "flex-end" },

  rank: {
    width: 28,
    textAlign: "center",
    color: "#6B7280",
    fontWeight: "700",
  },

  gold: { color: "#FACC15" },
  silver: { color: "#E5E7EB" },
  bronze: { color: "#D97706" },

  avatar: { width: 40, height: 40, borderRadius: 20 },

  name: { color: "#fff", fontWeight: "600" },
  username: { color: "#9CA3AF", fontSize: 12 },

  eloRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  elo: { color: "#fff", fontWeight: "600" },
  tier: { fontSize: 12 },

  meCard: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1C1917",
    borderWidth: 1,
    borderColor: "#FACC15",
  },

  meRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  meRank: {
    color: "#FACC15",
    fontWeight: "700",
    marginRight: 8,
  },

  meAvatar: { width: 32, height: 32, borderRadius: 16 },

  meElo: { color: "#FACC15", fontWeight: "700" },
});
