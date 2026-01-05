import { Pressable, Text, ActivityIndicator } from "react-native";

const SubmitButton = ({ loading, text, onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        {
          backgroundColor: "#3B82F6", // bg-primary
          opacity: loading ? 0.5 : 1,
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={{ color: "white", fontWeight: "bold" }}>{text}</Text>
      )}
    </Pressable>
  );
};

export default SubmitButton;
