import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

// 🔹 Helper para calcular energía usada
const calculateEnergyUsed = (elements) => {
  if (!elements?.length) return 0;

  return elements.reduce((sum, el) => {
    const fromHold =
      el.hold && el.energyPerSecond
        ? el.hold * el.energyPerSecond
        : 0;

    const fromReps =
      el.reps && el.energyPerRep
        ? el.reps * el.energyPerRep
        : 0;

    return sum + fromHold + fromReps;
  }, 0);
};

export default function BarEnergyEditCombo({ elements, userEnergy }) {
  const totalEnergyUsed = useMemo(
    () => calculateEnergyUsed(elements),
    [elements]
  );

  const remainingEnergy = Math.max(
    0,
    (userEnergy || 0) - totalEnergyUsed
  );

  const percentage =
    userEnergy > 0 ? (remainingEnergy / userEnergy) * 100 : 0;

  const barStyle =
    percentage > 50
      ? styles.barGreen
      : percentage > 20
      ? styles.barYellow
      : styles.barRed;

  return (
    <View>
      {/* TEXTO */}
      <Text style={styles.label}>
        <Text style={styles.bold}>Energía disponible:</Text>{" "}
        {Math.round(remainingEnergy)}/{userEnergy}
      </Text>

      {/* BARRA */}
      <View style={styles.container}>
        <View
          style={[
            styles.bar,
            barStyle,
            { width: `${percentage}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: "#E5E7EB",
    marginBottom: 4,
  },

  bold: {
    fontWeight: "700",
  },

  container: {
    width: "100%",
    height: 12,
    backgroundColor: "#374151", // gray-700
    borderRadius: 6,
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    borderRadius: 6,
  },

  barGreen: {
    backgroundColor: "#22C55E",
  },

  barYellow: {
    backgroundColor: "#FACC15",
  },

  barRed: {
    backgroundColor: "#EF4444",
  },
});

