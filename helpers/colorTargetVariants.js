import { StyleSheet } from "react-native";

export const getVariantBgColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "elite":
      return styles.elite;
    case "legendary":
      return styles.legendary;
    default:
      return styles.default;
  }
};

const styles = StyleSheet.create({
  elite: {
    backgroundColor: "#6B21A8",
    borderColor: "#A855F7",
    borderWidth: 1,
  },
  legendary: {
    backgroundColor: "#713F12",
    borderColor: "#EAB308",
    borderWidth: 3,
  },
  default: {
    backgroundColor: "#1C1917",
    borderColor: "#404040",
    borderWidth: 1,
  },
});
