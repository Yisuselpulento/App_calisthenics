import { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";

export default function SearchTimer({ active }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) {
      setSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const formatted = `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;

  return <Text style={styles.timer}>{formatted}</Text>;
}

const styles = StyleSheet.create({
  timer: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontFamily: "monospace",
    fontWeight: "600",
  },
});
