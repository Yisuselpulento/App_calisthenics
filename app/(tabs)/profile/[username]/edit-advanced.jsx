import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "../../../../context/AuthContext";
import { updateAdvancedProfileService } from "../../../../Services/ProfileFetching";
import SelectCustom from "../../../../components/SelectCustom";
import SubmitButton from "../../../../components/Buttons/SubmitButton";
import { showToast } from "../../../../helpers/showToast";

export default function EditAdvancedProfile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email || "",
    password: "",
    profileType: currentUser.profileType,
  });

  const handleSubmit = async () => {
    setLoading(true);

    const res = await updateAdvancedProfileService(formData);

    if (!res.success) {
      showToast("error", res.message || "Error actualizando perfil");
      setLoading(false);
      return;
    }

    updateCurrentUser(res.user);
    showToast("success", "Perfil avanzado actualizado");
    router.replace(`/profile/${res.user.username}`);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Edición avanzada
      </Text>

      <TextInput
        placeholder="Username"
        value={formData.username}
        onChangeText={(v) => setFormData((p) => ({ ...p, username: v }))}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(v) => setFormData((p) => ({ ...p, email: v }))}
        style={styles.input}
      />

      <TextInput
        placeholder="Nueva contraseña"
        secureTextEntry
        value={formData.password}
        onChangeText={(v) => setFormData((p) => ({ ...p, password: v }))}
        style={styles.input}
      />

      <SelectCustom
        value={formData.profileType}
        onChange={(v) => setFormData((p) => ({ ...p, profileType: v }))}
        options={[
          { value: "static", label: "Static" },
          { value: "dynamic", label: "Dynamic" },
        ]}
      />

      <SubmitButton loading={loading} text="Guardar cambios" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = {
  input: {
    padding: 12,
    backgroundColor: "#1c1917",
    borderRadius: 8,
    color: "white",
    marginBottom: 12,
  },
};
