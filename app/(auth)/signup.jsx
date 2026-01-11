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


export default function SignUp() {
  const router = useRouter();
  const { signup } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    profileType: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Las contraseñas no coinciden",
      });
      return;
    }

    if (!formData.gender) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar un género",
      });
      return;
    }

    if (!formData.profileType) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar un tipo de perfil",
      });
      return;
    }

    setLoading(true);
    const res = await signup(formData);
    setLoading(false);

    if (!res?.success) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res?.message || "Error al registrarse",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Registro exitoso",
      text2: res.message,
    });

    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regístrate</Text>

      <View style={styles.form}>
        {/* NOMBRE */}
        <Input
          label="Nombre"
          value={formData.fullName}
          onChange={(t) => handleChange("fullName", t)}
        />

        {/* USERNAME */}
        <Input
          label="Username"
          placeholder="_monsster_"
          value={formData.username}
          onChange={(t) => handleChange("username", t)}
        />

        {/* EMAIL */}
        <Input
          label="Email"
          keyboardType="email-address"
          value={formData.email}
          onChange={(t) => handleChange("email", t)}
        />

        {/* PASSWORD */}
        <PasswordInput
          label="Contraseña"
          value={formData.password}
          show={showPassword}
          toggle={() => setShowPassword((p) => !p)}
          onChange={(t) => handleChange("password", t)}
        />

        {/* CONFIRM PASSWORD */}
        <PasswordInput
          label="Confirmar contraseña"
          value={formData.confirmPassword}
          show={showConfirmPassword}
          toggle={() => setShowConfirmPassword((p) => !p)}
          onChange={(t) => handleChange("confirmPassword", t)}
        />

        {/* GÉNERO */}
        <Select
          label="Género"
          value={formData.gender}
          options={[
            { label: "Mujer", value: "female" },
            { label: "Hombre", value: "male" },
          ]}
          onSelect={(v) => handleChange("gender", v)}
        />

        {/* TIPO PERFIL */}
        <Select
          label="Tipo de perfil"
          value={formData.profileType}
          options={[
            { label: "Static", value: "static" },
            { label: "Dynamic", value: "dynamic" },
          ]}
          onSelect={(v) => handleChange("profileType", v)}
        />

        <SubmitButton
          loading={loading}
          text="Registrarse"
          onPress={handleSubmit}
        />

        <Text style={styles.footerText}>
          ¿Ya tienes cuenta?{" "}
          <Text style={styles.link} onPress={() => router.push("/login")}>
            Inicia sesión
          </Text>
        </Text>
      </View>
    </View>
  );
}

/* ---------------- COMPONENTES ---------------- */

const Input = ({ label, value, onChange, ...props }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      {...props}
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholderTextColor="#9ca3af"
    />
  </View>
);

const PasswordInput = ({ label, value, onChange, show, toggle }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.passwordWrapper}>
      <TextInput
        style={[styles.input, { paddingRight: 40 }]}
        secureTextEntry={!show}
        value={value}
        onChangeText={onChange}
      />
      <Pressable style={styles.eye} onPress={toggle}>
        <Ionicons
          name={show ? "eye-off" : "eye"}
          size={20}
          color="#9ca3af"
        />
      </Pressable>
    </View>
  </View>
);

const Select = ({ label, options, value, onSelect }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.select}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          style={[
            styles.selectOption,
            value === opt.value && styles.selectActive,
          ]}
        >
          <Text
            style={{
              color: value === opt.value ? "#fff" : "#d1d5db",
            }}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
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

  select: {
    flexDirection: "row",
    gap: 10,
  },

  selectOption: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#1f2937",
    alignItems: "center",
  },

  selectActive: {
    backgroundColor: "#3b82f6",
  },

  footerText: {
    textAlign: "center",
    color: "#d1d5db",
    marginTop: 10,
  },

  link: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
