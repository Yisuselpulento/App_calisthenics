import { View, Text, Modal, Pressable, StyleSheet } from "react-native";

export default function DeleteSkillVariantModal({
  isOpen,
  onCancel,
  onConfirm,
  loading,
  skillName,
}) {
  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View style={styles.modal}>
          <Text style={styles.title}>Eliminar Skill</Text>

          <Text style={styles.text}>
            ¿Seguro que deseas eliminar la skill "{skillName}"?
          </Text>

          {loading && (
            <Text style={styles.loading}>Eliminando...</Text>
          )}

          <View style={styles.actions}>
            <Pressable onPress={onCancel} disabled={loading}>
              <Text style={styles.cancel}>Cancelar</Text>
            </Pressable>

            <Pressable onPress={onConfirm} disabled={loading}>
              <Text style={styles.confirm}>Eliminar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  modal: {
    width: "85%",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },

  text: {
    color: "#d1d5db",
    fontSize: 13,
    marginBottom: 12,
  },

  loading: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 8,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },

  cancel: {
    color: "#9ca3af",
    fontSize: 14,
  },

  confirm: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
});

