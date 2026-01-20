import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEnergy } from "../../hooks/useEnergy";
import Toast from "react-native-toast-message";

export default function EnergyUpgrade() {
  const {
    energy,
    boostMultiplier,
    boostUntil,
    loading,
    buyBoost,
    buyFullEnergy,
  } = useEnergy();

  const router = useRouter();

  const handleBuyBoost = async () => {
    const res = await buyBoost();
    res.success
      ? Toast.show({ type: "success", text1: res.message })
      : Toast.show({ type: "error", text1: res.message });
  };

  const handleBuyFull = async () => {
    const res = await buyFullEnergy();
    res.success
      ? Toast.show({ type: "success", text1: res.message })
      : Toast.show({ type: "error", text1: res.message });
  };

  const boostActive =
    boostUntil && new Date(boostUntil) > new Date();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Energy Upgrade</Text>

      {/* INFO ACTUAL */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Energía actual: <Text style={styles.bold}>{energy}</Text>
        </Text>

        {boostActive && (
          <Text style={styles.boostText}>
            Boost activo x{boostMultiplier} hasta{" "}
            {new Date(boostUntil).toLocaleDateString()}
          </Text>
        )}
      </View>

      {/* BOOST */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Boost x2 (3 días)</Text>
        <Text style={styles.cardDesc}>
          Duplica la regeneración de energía durante 3 días.
        </Text>

        <Pressable
          disabled={loading}
          onPress={handleBuyBoost}
          style={({ pressed }) => [
            styles.button,
            styles.boostBtn,
            pressed && styles.pressed,
            loading && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Activar Boost</Text>
          )}
        </Pressable>
      </View>

      {/* FULL ENERGY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔋 Recarga completa</Text>
        <Text style={styles.cardDesc}>
          Rellena tu energía al máximo de forma instantánea.
        </Text>

        <Pressable
          disabled={loading}
          onPress={handleBuyFull}
          style={({ pressed }) => [
            styles.button,
            styles.fullBtn,
            pressed && styles.pressed,
            loading && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Recargar Energía</Text>
          )}
        </Pressable>
      </View>

      {/* VOLVER */}
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  infoBox: {
    backgroundColor: "#292524",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },

  infoText: {
    color: "#fff",
    fontSize: 14,
  },

  bold: {
    fontWeight: "700",
  },

  boostText: {
    marginTop: 4,
    fontSize: 12,
    color: "#4ade80",
  },

  card: {
    backgroundColor: "#1c1917",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#44403c",
    marginBottom: 12,
  },

  cardTitle: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },

  cardDesc: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 10,
  },

  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  boostBtn: {
    backgroundColor: "#facc15",
  },

  fullBtn: {
    backgroundColor: "#22c55e",
  },

  buttonText: {
    color: "#000",
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },

  back: {
    marginTop: 16,
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "underline",
  },
});
