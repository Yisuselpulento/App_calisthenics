import { View, Text, Pressable, StyleSheet } from "react-native";

export default function RankedReadyToast({ onAccept, waiting }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ⏳ Confirma para iniciar la ranked
      </Text>

      {!waiting ? (
        <Pressable style={styles.button} onPress={onAccept}>
          <Text style={styles.buttonText}>Estoy listo</Text>
        </Pressable>
      ) : (
        <Text style={styles.waiting}>
          ✔ Esperando respuesta del oponente...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0c0c0c",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#22c55e",
    width: 260,
  },
  title: {
    color: "#fff",
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
    textAlign: "center",
  },
  waiting: {
    color: "#4ade80",
    textAlign: "center",
    fontSize: 13,
  },
});
