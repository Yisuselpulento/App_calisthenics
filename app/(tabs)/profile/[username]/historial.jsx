import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "../../../../context/AuthContext";
import HistorialCard from "../../../../components/Cards/HistorialCard";
import { getUserRankedHistory, getUserCasualHistory } from "../../../../Services/matchFetching";

export default function ProfileHistorial() {
  const [tab, setTab] = useState("ranked");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const { viewedProfile } = useAuth();

  const fetchHistory = async (type, userId) => {
    setLoading(true);

    const res =
      type === "ranked"
        ? await getUserRankedHistory(userId)
        : await getUserCasualHistory(userId);

    if (!res?.success) {
      setMatches([]);
      setLoading(false);
      return;
    }

    setMatches(res.matches);
    setLoading(false);
  };

  useEffect(() => {
    if (viewedProfile?._id) {
      fetchHistory(tab, viewedProfile._id);
    }
  }, [tab, viewedProfile]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Batallas</Text>

        {/* TABS */}
        <View style={styles.tabs}>
          <Pressable
            onPress={() => setTab("ranked")}
            style={[
              styles.tab,
              tab === "ranked" && styles.tabRankedActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                tab === "ranked" && styles.tabTextActiveDark,
              ]}
            >
              Ranked
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setTab("casual")}
            style={[
              styles.tab,
              tab === "casual" && styles.tabCasualActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                tab === "casual" && styles.tabTextActiveLight,
              ]}
            >
              Casual
            </Text>
          </Pressable>
        </View>
      </View>

      {/* CONTENT */}
      {loading ? (
        <Text style={styles.loading}>Cargando historial...</Text>
      ) : matches.length > 0 ? (
        <View style={styles.list}>
          {matches.map((match) => (
            <HistorialCard
              key={match._id}
              match={match}
              type={tab}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>
          {tab === "ranked"
            ? "Aún no tiene partidas ranked."
            : "Aún no tiene partidas casual."}
        </Text>
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#292524",
    borderRadius: 12,
    overflow: "hidden",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabRankedActive: {
    backgroundColor: "#facc15",
  },
  tabCasualActive: {
    backgroundColor: "#3b82f6",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#d1d5db",
  },
  tabTextActiveDark: {
    color: "#000",
  },
  tabTextActiveLight: {
    color: "#fff",
  },
  list: {
    gap: 12,
  },
  loading: {
    color: "#9ca3af",
  },
  empty: {
    color: "#9ca3af",
    marginTop: 12,
  },
});
