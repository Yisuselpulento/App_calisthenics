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
    backgroundColor: "rgba(147, 51, 234, 0.5)", // purple-600 / 50%
    borderColor: "#A855F7", // purple-500
    borderWidth: 1,
  },
  legendary: {
    backgroundColor: "rgba(253, 224, 71, 0.7)", // yellow-300 / 70%
    borderColor: "#FACC15", // yellow-300
    borderWidth: 3,
  },
  default: {
    backgroundColor: "#111827", // gray-900
    borderColor: "#404040", // neutral-700
    borderWidth: 1,
  },
});
