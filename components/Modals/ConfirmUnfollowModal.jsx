import { Modal, View, Text, StyleSheet, Pressable } from "react-native";

export default function ConfirmUnfollowModal({
  visible,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>¿Dejar de seguir?</Text>
          <Text style={styles.text}>
            ¿Estás seguro de que quieres dejar de seguir a este usuario?
          </Text>

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>

            <Pressable onPress={onConfirm} style={styles.confirm}>
              <Text style={styles.buttonText}>Confirmar</Text>
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
    padding: 20,
  },
  modal: {
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  text: {
    color: "#D1D5DB",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancel: {
    backgroundColor: "#374151",
    padding: 10,
    borderRadius: 8,
  },
  confirm: {
    backgroundColor: "#DC2626",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
  },
});
