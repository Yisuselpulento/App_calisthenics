import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function PublicLayout() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (currentUser) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
