import { View, StyleSheet } from "react-native";
import { useEnergy } from "../../hooks/useEnergy";

export default function EnergyBar({ maxEnergy = 1000 }) {
  const { energy } = useEnergy();
  const percentage = Math.min((energy / maxEnergy) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${percentage}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
