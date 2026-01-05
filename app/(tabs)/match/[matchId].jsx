import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Video } from "expo-av";

import ComboStepByStep from "../../../components/ComboStepByStep";
import { getMatchById } from "../../../Services/matchFetching";

export default function Match() {
  const { matchId } = useLocalSearchParams();

  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await getMatchById(matchId);
        setMatchData(res?.success ? res.match : null);
      } catch (e) {
        console.error("Error fetching match:", e);
        setMatchData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading) {
    return <Text style={styles.centerText}>Cargando enfrentamiento...</Text>;
  }

  if (!matchData) {
    return <Text style={styles.centerText}>Enfrentamiento no encontrado</Text>;
  }

  const { user, opponent, matchType } = matchData;
  const isRanked = matchType === "ranked";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* MATCH TYPE */}
      <View
        style={[
          styles.badge,
          { backgroundColor: isRanked ? "#dc2626" : "#16a34a" },
        ]}
      >
        <Text style={styles.badgeText}>
          {isRanked ? "RANKED MATCH" : "CASUAL MATCH"}
        </Text>
      </View>

      <View style={styles.playersRow}>
        {/* USER */}
        <PlayerCard data={user} />

        <Text style={styles.vs}>VS</Text>

        {/* OPPONENT */}
        <PlayerCard data={opponent} />
      </View>
    </ScrollView>
  );
}

function PlayerCard({ data }) {
  const combo = data?.combo || {};

  return (
    <View style={styles.playerCard}>
      <Image
        source={{
          uri: data?.user?.avatar?.url || "https://via.placeholder.com/150",
        }}
        style={styles.avatar}
      />

      <Text style={styles.username}>
        {data?.user?.username || "Jugador"}
      </Text>

      {combo?.video?.url ? (
        <Video
          source={{ uri: combo.video.url }}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay
          isMuted
        />
      ) : (
        <Text style={styles.noCombo}>No hay combo disponible</Text>
      )}

      <ComboStepByStep
        elementsStepData={data?.stepData || []}
        totalPoints={data?.totalPoints || 0}
        isWinner={data?.isWinner || false}
        playerName={data?.user?.username || ""}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  centerText: {
    marginTop: 40,
    textAlign: "center",
    color: "#fff",
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 20,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  playersRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  vs: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 110,
  },
  playerCard: {
    alignItems: "center",
    width: 160,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  username: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 6,
  },
  video: {
    width: 160,
    height: 120,
    borderRadius: 12,
    marginVertical: 8,
  },
  noCombo: {
    color: "#aaa",
    fontSize: 12,
  },
});
