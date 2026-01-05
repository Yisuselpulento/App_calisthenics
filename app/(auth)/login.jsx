import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
  console.log("CLICK LOGIN", formData);

  setLoading(true);
  const res = await login(formData);
  setLoading(false);

  console.log("LOGIN RESPONSE 👉", res);

  if (!res?.success) {
    Alert.alert("Error", res?.message || "Error al iniciar sesión");
    return;
  }

  router.replace("/(tabs)");
};

  return (
    <View className="flex-1 bg-black justify-center px-6">
      <Text className="text-white text-2xl font-bold mb-6 text-center">
        Inicia sesión
      </Text>

      {/* EMAIL */}
      <View className="mb-4">
        <Text className="text-gray-300 mb-1">Email</Text>
        <TextInput
          className="bg-zinc-800 text-white p-3 rounded-md"
          placeholder="email@email.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />
      </View>

      {/* PASSWORD */}
      <View className="mb-6">
        <Text className="text-gray-300 mb-1">Contraseña</Text>
        <View className="flex-row items-center bg-zinc-800 rounded-md px-3">
          <TextInput
            className="flex-1 text-white py-3"
            placeholder="********"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#9ca3af"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        className="bg-primary py-3 rounded-md items-center"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            Iniciar sesión
          </Text>
        )}
      </TouchableOpacity>

      {/* SIGNUP */}
      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-400">¿No tienes cuenta? </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-primary font-semibold">Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
