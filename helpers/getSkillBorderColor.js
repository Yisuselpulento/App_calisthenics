import { StyleSheet } from "react-native";

export const getSkillBorderColor = (difficulty) => {
  switch (difficulty) {
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
    borderColor: "#A855F7", // purple-500
  },
  legendary: {
    borderColor: "#EAB308", // yellow-500
  },
  default: {
    borderColor: "#404040", // neutral-700
  },
});
