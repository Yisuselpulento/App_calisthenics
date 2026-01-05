import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";

export default function ReportModal({
  isOpen,
  onClose,
  onSend,
  loading,
  reasons,
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modal}>
          <Text style={styles.title}>Reportar usuario</Text>

          {reasons.map((r) => (
            <Pressable
              key={r.value}
              onPress={() => setReason(r.value)}
              style={styles.option}
            >
              <Text
                style={[
                  styles.optionText,
                  reason === r.value && styles.selected,
                ]}
              >
                {r.label}
              </Text>
            </Pressable>
          ))}

          <View style={styles.actions}>
            <Pressable onPress={onClose} disabled={loading}>
              <Text style={styles.cancel}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={() => onSend(reason)}
              disabled={!reason || loading}
            >
              <Text style={styles.send}>
                {loading ? "Enviando..." : "Enviar"}
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
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },

  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  optionText: {
    fontSize: 14,
    color: "#d1d5db",
  },

  selected: {
    color: "#60a5fa",
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 12,
  },

  cancel: {
    fontSize: 14,
    color: "#9ca3af",
  },

  send: {
    fontSize: 14,
    fontWeight: "600",
    color: "#60a5fa",
  },
});
