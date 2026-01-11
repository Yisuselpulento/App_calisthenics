import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import SubmitButton from "../../components/Buttons/SubmitButton";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await login(formData);

    setLoading(false);

    if (!res?.success) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res?.message || "Credenciales incorrectas",
      });
      return;
    }

    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicia Sesión</Text>

      <View style={styles.form}>
        {/* EMAIL */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@email.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>

          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
            />

            <Pressable
              style={styles.eye}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#9ca3af"
              />
            </Pressable>
          </View>
        </View>

        {/* BUTTON */}
        <SubmitButton
          loading={loading}
          text="Iniciar Sesión"
          onPress={handleSubmit}
        />

        {/* SIGNUP */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes cuenta?{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/signup")}
            >
              Regístrate
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    padding: 16,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  form: {
    backgroundColor: "rgba(15,23,42,0.85)",
    borderRadius: 12,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  field: {
    gap: 6,
  },

  label: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#1c1917",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#374151",
  },

  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  eye: {
    position: "absolute",
    right: 10,
  },

  footer: {
    marginTop: 10,
    alignItems: "center",
  },

  footerText: {
    color: "#d1d5db",
  },

  link: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
