import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#1C1917" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* TÍTULO */}
        <Text style={styles.title}>Editar perfil</Text>

        {/* ACCIONES */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() =>
              router.push(`/profile/${currentUser.username}/add-skill`)
            }
            style={[styles.actionBtn, styles.skillBtn]}
          >
            <Text style={styles.actionText}>+ Skill</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push(`/profile/${currentUser.username}/combos/add`)
            }
            style={[styles.actionBtn, styles.comboBtn]}
          >
            <Text style={styles.actionText}>+ Combo</Text>
          </Pressable>
        </View>

        {/* AVATAR */}
        <Pressable onPress={pickAvatar} style={styles.avatarPressable}>
          <Text style={styles.label}>Avatar</Text>
          {formData.avatar && (
            <Image
              source={{ uri: formData.avatar.uri || formData.avatar }}
              style={styles.avatar}
            />
          )}
        </Pressable>

        {/* VIDEO */}
        <Pressable onPress={pickVideo} style={{ marginTop: 16 }}>
          <Text style={styles.label}>Video de perfil</Text>
          {formData.videoProfile && (
            <VideoPlayer
              src={formData.videoProfile.uri || formData.videoProfile}
              shouldPlay
            />
          )}
        </Pressable>

        {/* ALTURA / PESO */}
        <View style={styles.row}>
          <TextInput
            placeholder="Altura (m)"
            placeholderTextColor="#9CA3AF"
            value={formData.altura}
            onChangeText={(v) => setFormData((p) => ({ ...p, altura: v }))}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="Peso (kg)"
            placeholderTextColor="#9CA3AF"
            value={formData.peso}
            onChangeText={(v) => setFormData((p) => ({ ...p, peso: v }))}
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>

        {/* COUNTRY */}
        <TextInput
          placeholder="País"
          placeholderTextColor="#9CA3AF"
          value={formData.country}
          onChangeText={(v) => setFormData((p) => ({ ...p, country: v }))}
          style={[styles.input, { marginTop: 12 }]}
        />

        {/* ADVANCED */}
        <Pressable
          onPress={() =>
            router.push(`/profile/${currentUser.username}/edit-advanced`)
          }
          style={styles.advancedLink}
        >
          <Text style={styles.advancedText}>
            Editar opciones avanzadas →
          </Text>
        </Pressable>

        {/* GUARDAR */}
        <SubmitButton
          loading={loading}
          text="Guardar cambios"
          onPress={handleSubmit}
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  skillBtn: {
    backgroundColor: "#16A34A", // green-600
  },
  comboBtn: {
    backgroundColor: "#2563EB", // blue-600
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  avatarPressable: {
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: "#374151",
    borderRadius: 8,
    color: "#fff",
  },
  advancedLink: {
    marginTop: 14,
  },
  advancedText: {
    color: "#60A5FA",
    fontSize: 14,
  },
});
