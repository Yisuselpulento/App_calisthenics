import { View, Text, StyleSheet } from "react-native";

export default function ComboCard({ combo }) {
  if (!combo) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {combo.name || "Combo sin nombre"}
        </Text>

        <Text
          style={[
            styles.badge,
            combo.type === "static"
              ? styles.static
              : combo.type === "dynamic"
              ? styles.dynamic
              : styles.other,
          ]}
        >
          {combo.type || "unknown"}
        </Text>
      </View>

      <Text style={styles.info}>
        Skills incluidas: {combo.elements?.length || 0}
      </Text>
      <Text style={styles.info}>
        Energía total: {combo.totalEnergyCost || 0}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#292524",
    borderWidth: 1,
    borderColor: "#44403C",
    borderRadius: 16,
    padding: 14,

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flexShrink: 1,
    marginRight: 8,
  },
  badge: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    fontWeight: "600",
    overflow: "hidden",
    textTransform: "capitalize",
  },
  static: {
    backgroundColor: "#1D4ED8",
    color: "#93c5fd",
  },
  dynamic: {
    backgroundColor: "#15803D",
    color: "#86efac",
  },
  other: {
    backgroundColor: "#A16207",
    color: "#fde047",
  },
  info: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
});
