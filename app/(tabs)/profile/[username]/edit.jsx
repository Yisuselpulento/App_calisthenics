import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { useAuth } from "../../../../context/AuthContext";
import { updateProfileService } from "../../../../Services/ProfileFetching";
import SubmitButton from "../../../../components/Buttons/SubmitButton";
import { showToast } from "../../../../helpers/showToast";
import VideoPlayer from "../../../../components/VideoPlayer";
const MAX_VIDEO_SIZE_MB = 100;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export default function EditProfile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country: currentUser.country || "",
    avatar: currentUser.avatar?.url || null,
    videoProfile: currentUser.videoProfile?.url || null,
    altura: currentUser.altura?.toString() || "",
    peso: currentUser.peso?.toString() || "",
  });

  /* ---------------- IMAGE PICKER ---------------- */
  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!res.canceled) {
      setFormData((p) => ({ ...p, avatar: res.assets[0] }));
    }
  };

  /* ---------------- VIDEO PICKER ---------------- */
  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!res.canceled) {
      const video = res.assets[0];

      if (video.fileSize > MAX_VIDEO_SIZE_BYTES) {
        showToast("error", "El video no puede superar los 100 MB");
        return;
      }

      setFormData((p) => ({ ...p, videoProfile: video }));
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    setLoading(true);

    const data = new FormData();
    data.append("peso", formData.peso);
    data.append("altura", formData.altura);
    data.append("country", formData.country);

    if (formData.avatar?.uri) {
      data.append("avatar", {
        uri: formData.avatar.uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      });
    }

    if (formData.videoProfile?.uri) {
      data.append("videoProfile", {
        uri: formData.videoProfile.uri,
        name: "video.mp4",
        type: "video/mp4",
      });
    }

    const res = await updateProfileService(data);

    if (!res.success) {
      showToast("error", res.message);
      setLoading(false);
      return;
    }

    updateCurrentUser(res.user);
    showToast("success", "Perfil actualizado");
    router.replace(`/profile/${res.user.username}`);
    setLoading(false);
  };

  if (!currentUser) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Editar perfil
      </Text>

      {/* AVATAR */}
      <Pressable onPress={pickAvatar}>
        <Text>Avatar</Text>
        {formData.avatar && (
          <Image
            source={{ uri: formData.avatar.uri || formData.avatar }}
            style={{ width: 80, height: 80, borderRadius: 40, marginTop: 8 }}
          />
        )}
      </Pressable>

      {/* VIDEO */}
      <Pressable onPress={pickVideo} style={{ marginTop: 16 }}>
        <Text>Video de perfil</Text>
        {formData.videoProfile && (
          <VideoPlayer
            src={formData.videoProfile.uri || formData.videoProfile}
          />
        )}
      </Pressable>

      {/* ALTURA / PESO */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
        <TextInput
          placeholder="Altura (m)"
          value={formData.altura}
          onChangeText={(v) => setFormData((p) => ({ ...p, altura: v }))}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        <TextInput
          placeholder="Peso (kg)"
          value={formData.peso}
          onChangeText={(v) => setFormData((p) => ({ ...p, peso: v }))}
          keyboardType="decimal-pad"
          style={styles.input}
        />
      </View>

      {/* COUNTRY */}
      <TextInput
        placeholder="País"
        value={formData.country}
        onChangeText={(v) => setFormData((p) => ({ ...p, country: v }))}
        style={[styles.input, { marginTop: 12 }]}
      />

      <SubmitButton loading={loading} text="Guardar cambios" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = {
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: "#1c1917",
    borderRadius: 8,
    color: "white",
  },
};
