import { Modal, View, Image, Pressable, StyleSheet } from "react-native";

export default function ImageLightbox({ src, isOpen, onClose }) {
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Image source={{ uri: src }} style={styles.image} resizeMode="contain" />
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
