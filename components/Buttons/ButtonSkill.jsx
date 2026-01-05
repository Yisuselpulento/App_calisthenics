import { Pressable, Text, StyleSheet } from "react-native";
import { getSkillBorderColor } from "../../helpers/getSkillBorderColor";

export default function ButtonSkill({ skill, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        getSkillBorderColor(skill.baseDifficulty),
      ]}
    >
      <Text style={styles.text}>{skill.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    borderWidth: 1,
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});
