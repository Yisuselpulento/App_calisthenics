import React, { useState } from "react";
import { View, Pressable, Text, Modal, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router"; // para navegar al login

const ButtonLogout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth(); // ⚡ corrijo esto
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      router.replace("/login"); // ir al login como en web
      setIsOpen(false);
    }
  };

  return (
    <View style={{ position: "relative" }}>
      {/* Botón */}
      <Pressable
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.button,
          pressed && { backgroundColor: "#B91C1C" },
        ]}
      >
        <FontAwesome name="sign-out" size={24} color="#fff" />
      </Pressable>

      {/* Modal de confirmación */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro que deseas cerrar sesión?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setIsOpen(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleLogout}
                style={[styles.modalButton, styles.logoutButton]}
              >
                <Text style={styles.modalButtonText}>Cerrar sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ButtonLogout;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: "#1C1917",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 320,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalText: {
    color: "#D1D5DB",
    fontSize: 14,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#374151",
  },
  logoutButton: {
    backgroundColor: "#DC2626",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
