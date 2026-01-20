import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

// 🔹 Helper interno para calcular energía usada
const calculateEnergyUsed = (elements, userVariants) => {
  if (!elements || !userVariants) return 0;

  return elements.reduce((sum, el) => {
    const variant = userVariants.find(
      (v) => v.userSkillVariantId === el.userSkillVariantId
    );

    if (!variant) return sum;

    const energyFromHold = el.hold
      ? el.hold * (variant.stats.energyPerSecond || 0)
      : 0;

    const energyFromReps = el.reps
      ? el.reps * (variant.stats.energyPerRep || 0)
      : 0;

    return sum + energyFromHold + energyFromReps;
  }, 0);
};

export default function EnergyBarCombo({ elements, userVariants, userEnergy }) {
  const totalEnergyUsed = useMemo(
    () => calculateEnergyUsed(elements, userVariants),
    [elements, userVariants]
  );

  const remainingEnergy = Math.max(
    0,
    (userEnergy || 0) - totalEnergyUsed
  );

  const percentage =
    userEnergy > 0 ? (remainingEnergy / userEnergy) * 100 : 0;

  const barColor =
    percentage > 30 ? styles.barGreen : styles.barRed;

  return (
    <View>
      {/* TEXTO */}
      <Text style={styles.label}>
        <Text style={styles.bold}>Energía disponible: </Text>
        {Math.round(remainingEnergy)}/{userEnergy}
      </Text>

      {/* BARRA */}
      <View style={styles.container}>
        <View
          style={[
            styles.bar,
            barColor,
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
    backgroundColor: "#374151",
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

  barRed: {
    backgroundColor: "#EF4444",
  },
});

