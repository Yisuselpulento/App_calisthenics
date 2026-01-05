import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getRankingColor } from "../../helpers/getRankingColor";

export default function RankingDisplay({ ranking }) {
  return (
    <View style={styles.container}>
      {["static", "dynamic"].map((type) => (
        <View key={type} style={styles.block}>
          <FontAwesome5
            name="trophy"
            size={18}
            color={getRankingColor(ranking[type].tier)}
          />
          <Text style={styles.elo}>{ranking[type].elo}</Text>
          <Text style={styles.tier}>{ranking[type].tier}</Text>
          <Text style={styles.type}>({type})</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 24,
    marginTop: 6,
  },
  block: {
    alignItems: "center",
  },
  elo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  tier: {
    fontSize: 10,
    color: "#e5e7eb",
  },
  type: {
    fontSize: 10,
    color: "#9ca3af",
  },
});
