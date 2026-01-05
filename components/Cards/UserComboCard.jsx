import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import EditAndDeleteButton from "../Buttons/EditAndDeleteButton";

export default function UserComboCard({
  combo,
  username,
  isOwner,
  onDeleteClick,
}) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{combo.name}</Text>

      <View style={styles.info}>
        <Text style={styles.text}>
          <Text style={styles.label}>Tipo:</Text> {combo.type}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Aura Total:</Text>{" "}
          {combo.totalEnergyCost}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() =>
            router.push(
              `/profile/${username}/combos/${combo._id || combo.comboId}`
            )
          }
          style={styles.viewBtn}
        >
          <Text style={styles.viewText}>Ver detalles</Text>
        </Pressable>

        {isOwner && (
          <EditAndDeleteButton
            onEdit={() =>
              router.push(
                `/profile/${username}/combos/${combo._id}/edit`
              )
            }
            onDelete={() => onDeleteClick(combo)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  name: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 8,
  },

  info: {
    marginBottom: 10,
  },

  text: {
    color: "#e5e7eb",
    fontSize: 12,
  },

  label: {
    color: "#93c5fd",
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  viewText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
