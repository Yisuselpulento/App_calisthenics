import { View, Text, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

export default function ComboStepByStep({
  elementsStepData = [],
  totalPoints = 0,
  isWinner = false,
  playerName = "",
}) {
  const [displayed, setDisplayed] = useState([]);
  const [calculating, setCalculating] = useState(true);
  const indexRef = useRef(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
  if (!elementsStepData.length) return;
  if (hasStartedRef.current) return;

  hasStartedRef.current = true;

  setDisplayed([]);
  indexRef.current = 0;
  setCalculating(true);

  const interval = setInterval(() => {
    setDisplayed((prev) => {
      if (indexRef.current >= elementsStepData.length) {
        clearInterval(interval);
        setCalculating(false);
        return prev;
      }

      const next = elementsStepData[indexRef.current];
      indexRef.current++;
      return [...prev, next];
    });
  }, 1500);

  return () => clearInterval(interval);
}, [elementsStepData]);

  return (
    <View style={styles.container}>
      {displayed.map(
        (el) =>
          (el.hold > 0 || el.reps > 0) && (
            <View key={el.elementId} style={styles.card}>
              <Text style={styles.title}>{el.name}</Text>

              {el.hold > 0 && (
                <Text style={styles.text}>Hold: {el.hold}</Text>
              )}

              {el.reps > 0 && (
                <Text style={styles.text}>Reps: {el.reps}</Text>
              )}

              <Text style={styles.text}>Dedos: {el.fingers}</Text>

              <View style={styles.row}>
                <Text style={styles.text}>Puntos base:</Text>
                <AnimatedNumber
                  value={el.basePoints}
                  style={styles.blue}
                />
              </View>

              <View style={styles.row}>
                <Text style={styles.text}>Aumento dedos:</Text>
                <AnimatedNumber
                  value={el.pointsWithFingers}
                  style={
                    el.pointsWithFingers >= 0
                      ? styles.green
                      : styles.red
                  }
                />
              </View>

              <View style={styles.row}>
                <Text style={styles.text}>Limpieza x</Text>
                <AnimatedNumber
                  value={el.cleanFactor}
                  decimals={2}
                  style={
                    el.cleanFactor < 1
                      ? styles.red
                      : styles.green
                  }
                />
              </View>

              <View style={styles.row}>
                <Text style={styles.text}>Puntos limpieza:</Text>
                <AnimatedNumber
                  value={el.pointsWithCleanHit}
                  style={styles.blue}
                />
              </View>
            </View>
          )
      )}

      {calculating && (
        <Text style={styles.calculating}>Calculando...</Text>
      )}

      {!calculating &&
        displayed.length === elementsStepData.length && (
          <View style={styles.total}>
            <Text style={styles.text}>Total Points</Text>

            <AnimatedNumber
              value={totalPoints}
              style={
                isWinner ? styles.greenBig : styles.redBig
              }
            />

            {playerName && (
              <Text
                style={
                  isWinner ? styles.green : styles.red
                }
              >
                {playerName}{" "}
                {isWinner ? "🏆 Ganador" : "💀 Perdedor"}
              </Text>
            )}
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    gap: 8,
  },

  card: {
    backgroundColor: "#1c1c1c",
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },

  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  calculating: {
    textAlign: "center",
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 8,
  },

  total: {
    marginTop: 16,
    alignItems: "center",
    gap: 4,
  },

  blue: {
    color: "#60A5FA",
    fontWeight: "600",
  },

  green: {
    color: "#4ADE80",
    fontWeight: "600",
  },

  red: {
    color: "#F87171",
    fontWeight: "600",
  },

  greenBig: {
    color: "#4ADE80",
    fontSize: 22,
    fontWeight: "800",
  },

  redBig: {
    color: "#F87171",
    fontSize: 22,
    fontWeight: "800",
  },
});
