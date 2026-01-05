import { Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function BackButton() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.back()}>
      <Text style={{ color: "#60a5fa", fontSize: 13 }}>
        ← Volver
      </Text>
    </Pressable>
  );
}
