import { View, Text, Modal, Pressable, StyleSheet } from "react-native";

export default function DeleteComboModal({
  isOpen,
  onCancel,
  onConfirm,
  comboName,
  loading,
}) {
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View style={styles.modal}>
          <Text style={styles.title}>Eliminar Combo</Text>

          <Text style={styles.text}>
            ¿Estás seguro que quieres eliminar{" "}
            <Text style={styles.bold}>{comboName}</Text>?
          </Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              disabled={loading}
              style={styles.cancel}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={loading}
              style={styles.delete}
            >
              <Text style={styles.btnText}>
                {loading ? "Eliminando..." : "Eliminar"}
              </Text>
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modal: {
    width: 300,
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  text: {
    color: "#e5e7eb",
    marginBottom: 16,
  },

  bold: {
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  cancel: {
    backgroundColor: "#475569",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  delete: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
