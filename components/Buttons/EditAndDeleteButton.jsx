import { View, Text, Pressable, StyleSheet } from "react-native";

export default function EditAndDeleteButton({
  onEdit,
  onDelete,
}) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onEdit} style={styles.edit}>
        <Text style={styles.text}>Editar</Text>
      </Pressable>

      <Pressable onPress={onDelete} style={styles.delete}>
        <Text style={styles.text}>Eliminar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },

  edit: {
    backgroundColor: "#facc15",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  delete: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  text: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
});
