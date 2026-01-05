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

  useEffect(() => {
    if (!elementsStepData.length) return;

    setDisplayed([]);
    indexRef.current = 0;
    setCalculating(true);

    const interval = setInterval(() => {
      setDisplayed((prev) => [...prev, elementsStepData[indexRef.current]]);
      indexRef.current++;

      if (indexRef.current >= elementsStepData.length) {
        clearInterval(interval);
        setCalculating(false);
      }
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
              {el.hold > 0 && <Text>Hold: {el.hold}</Text>}
              {el.reps > 0 && <Text>Reps: {el.reps}</Text>}
              <Text>Dedos: {el.fingers}</Text>

              <Text>
                Puntos base:{" "}
                <AnimatedNumber value={el.basePoints} style={styles.blue} />
              </Text>

              <Text>
                Aumento dedos:{" "}
                <AnimatedNumber
                  value={el.pointsWithFingers}
                  style={
                    el.pointsWithFingers >= 0 ? styles.green : styles.red
                  }
                />
              </Text>

              <Text>
                Limpieza x{" "}
                <AnimatedNumber
                  value={el.cleanFactor}
                  decimals={2}
                  style={el.cleanFactor < 1 ? styles.red : styles.green}
                />
              </Text>

              <Text>
                Puntos limpieza:{" "}
                <AnimatedNumber
                  value={el.pointsWithCleanHit}
                  style={styles.blue}
                />
              </Text>
            </View>
          )
      )}

      {calculating && (
        <Text style={styles.calculating}>Calculando...</Text>
      )}

      {!calculating && displayed.length === elementsStepData.length && (
        <View style={styles.total}>
          <Text>Total Points</Text>
          <AnimatedNumber
            value={totalPoints}
            style={isWinner ? styles.greenBig : styles.redBig}
          />
          {playerName && (
            <Text style={isWinner ? styles.green : styles.red}>
              {playerName} {isWinner ? "🏆 Ganador" : "💀 Perdedor"}
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
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  calculating: {
    textAlign: "center",
    fontWeight: "600",
    color: "#fff",
  },
  total: {
    marginTop: 12,
    alignItems: "center",
  },
  blue: { color: "#60a5fa" },
  green: { color: "#4ade80" },
  red: { color: "#f87171" },
  greenBig: { color: "#4ade80", fontSize: 22, fontWeight: "bold" },
  redBig: { color: "#f87171", fontSize: 22, fontWeight: "bold" },
});
