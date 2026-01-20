import { View, StyleSheet, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useEnergy } from "../../hooks/useEnergy";

export default function EnergyBar({ maxEnergy = 1000 }) {
  const { energy } = useEnergy();
  const router = useRouter();

  const percentage = Math.min((energy / maxEnergy) * 100, 100);

  return (
    <View style={styles.wrapper}>
      {/* BOTÓN UPGRADE */}
      <Pressable
        onPress={() => router.push("/upgrade")}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>+</Text>
      </Pressable>

      {/* ENERGY BAR */}
      <View style={styles.container}>
        <View style={[styles.bar, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  button: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#facc15",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
  },

  container: {
    width: 90,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 999,
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    backgroundColor: "#facc15",
  },
});
