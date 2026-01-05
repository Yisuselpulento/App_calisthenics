import { View, Text, StyleSheet } from "react-native";

export default function ProgressBar({
  level = 0,
  maxLevel = 18000,
  label,
  showPercent = true,
}) {
  const progress = Math.min(Math.max(level, 0), maxLevel);
  const percent = (progress / maxLevel) * 100;

  const colors =
    maxLevel === 9000
      ? ["#d1d5db", "#3b82f6", "#a855f7", "#facc15"]
      : ["#ef4444", "#f97316", "#22c55e", "#3b82f6", "#a855f7", "#facc15"];

  const range = maxLevel / colors.length;
  const color = colors[Math.min(Math.floor(progress / range), colors.length - 1)];

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>
          {label}: {showPercent ? `${Math.floor(percent)}%` : progress}
        </Text>
      )}

      <View style={styles.track}>
        <View style={[styles.bar, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: "#d1d5db",
  },
  track: {
    height: 8,
    backgroundColor: "#1f2937",
    borderRadius: 999,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 999,
  },
});
