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
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
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
    backgroundColor: "rgba(59,130,246,0.4)",
    color: "#93c5fd",
  },
  dynamic: {
    backgroundColor: "rgba(34,197,94,0.4)",
    color: "#86efac",
  },
  other: {
    backgroundColor: "rgba(234,179,8,0.4)",
    color: "#fde047",
  },
  info: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
});
