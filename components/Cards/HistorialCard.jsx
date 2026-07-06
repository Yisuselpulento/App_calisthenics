import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function HistorialCard({ match, type }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/match/${match._id}`)}
      style={styles.card}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.user}>
          <Image
            source={{ uri: match.opponent.avatar.url }}
            style={styles.avatar}
          />
          <Text style={styles.username}>
            vs {match.opponent.username}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            match.result === "win"
              ? styles.win
              : match.result === "loss"
              ? styles.loss
              : styles.draw,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              match.result === "win"
                ? styles.winText
                : match.result === "loss"
                ? styles.lossText
                : styles.drawText,
            ]}
          >
            {match.result.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        <Text style={styles.item}>
          <Text style={styles.bold}>Modo:</Text> {match.mode}
        </Text>

        <Text style={styles.item}>
          <Text style={styles.bold}>Puntos:</Text> {match.points}
        </Text>

        {type === "ranked" && (
          <Text style={styles.item}>
            <Text style={styles.bold}>ELO:</Text>{" "}
            {match.eloBefore} → {match.eloAfter}
          </Text>
        )}

        <Text style={styles.date}>
          {new Date(match.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#292524",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#44403C",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  username: {
    color: "#fff",
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  win: {
    backgroundColor: "#166534",
  },
  winText: {
    color: "#4ade80",
  },
  loss: {
    backgroundColor: "#991B1B",
  },
  lossText: {
    color: "#f87171",
  },
  draw: {
    backgroundColor: "#525252",
  },
  drawText: {
    color: "#d1d5db",
  },
  body: {
    gap: 6,
  },
  item: {
    fontSize: 13,
    color: "#d1d5db",
  },
  bold: {
    fontWeight: "700",
    color: "#fff",
  },
  date: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
});
