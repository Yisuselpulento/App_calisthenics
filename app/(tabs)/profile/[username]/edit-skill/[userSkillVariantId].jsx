import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";


import { useAuth } from "../../../../../context/AuthContext";
import BackButton from "../../../../../components/Buttons/BackButton";
import VideoPlayer from "../../../../../components/VideoPlayer";
import SubmitButton from "../../../../../components/Buttons/SubmitButton";
import { showToast } from "../../../../../helpers/showToast";
import { getUserSkillVariantService, editSkillVariantService } from "../../../../../Services/skillFetching";


export default function EditSkill() {
  const { userSkillVariantId, username } = useLocalSearchParams();
  const router = useRouter();
  const { updateViewedProfile } = useAuth();

  const [variant, setVariant] = useState(null);
  const [newFingers, setNewFingers] = useState(5);

  const [video, setVideo] = useState(null);

  const [loadingVariant, setLoadingVariant] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     Cargar variante
  ========================= */
  useEffect(() => {
    const fetchVariant = async () => {
      setLoadingVariant(true);
      const res = await getUserSkillVariantService(userSkillVariantId);

      if (res.success  && res.variant) {
        setVariant(res.variant);
        setNewFingers(res.variant.fingers);
      } else {
        showToast("error", res.message || "No se pudo cargar la variante");
      }

      setLoadingVariant(false);
    };

    if (userSkillVariantId) fetchVariant();
  }, [userSkillVariantId]);

  /* =========================
     Seleccionar video
  ========================= */
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (result.canceled) return;

    setVideo(result.assets[0]);
  };

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async () => {
        if (!variant) return;
    if (newFingers !== variant.fingers && !video) {
      showToast(
        "error",
        "Al cambiar los dedos, debes subir un video nuevo"
      );
      return;
    }

    const formData = new FormData();

    if (newFingers !== variant.fingers) {
      formData.append("newFingers", newFingers);
    }

    if (video) {
      formData.append("video", {
        uri: video.uri,
        name: "skill-video.mp4",
        type: "video/mp4",
      });
    }

    setSubmitting(true);

    const res = await editSkillVariantService(
      variant.userSkillVariantId,
      formData
    );

    setSubmitting(false);

    if (res.success) {
      showToast("success", res.message);
      updateViewedProfile(res.user);

      router.push(
        `/profile/${username}/skill/${variant.userSkillVariantId}`
      );
    } else {
      showToast("error", res.message);
    }
  };

  /* =========================
     Render
  ========================= */
  if (loadingVariant) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!variant) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Variante no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Editar variante</Text>
        <BackButton />
      </View>

      {/* Form */}
      <View style={styles.card}>
        {/* Fingers */}
        <View style={styles.field}>
          <Text style={styles.label}>Fingers</Text>

          <View style={styles.fingersRow}>
            {[1, 2, 5].map((value) => (
              <Pressable
                key={value}
                onPress={() => setNewFingers(value)}
                style={[
                  styles.fingerOption,
                  newFingers === value && styles.fingerActive,
                ]}
              >
                <Text style={styles.fingerText}>{value}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Video */}
        <View style={styles.field}>
          <Text style={styles.label}>Subir video</Text>

          <Pressable style={styles.videoButton} onPress={pickVideo}>
            <Text style={styles.videoButtonText}>
              Seleccionar video
            </Text>
          </Pressable>

          <VideoPlayer
            src={video?.uri || variant?.video?.url}
            autoPlay={!!video}
            shouldPlay
          />
        </View>

        <SubmitButton
          loading={submitting}
          text="Guardar cambios"
          onClick={handleSubmit}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    minHeight: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    color: "white",
  },
  fingersRow: {
    flexDirection: "row",
    gap: 8,
  },
  fingerOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  fingerActive: {
    backgroundColor: "#2563EB",
  },
  fingerText: {
    color: "white",
    fontWeight: "600",
  },
  videoButton: {
    backgroundColor: "#7C3AED",
    padding: 10,
    borderRadius: 8,
  },
  videoButtonText: {
    color: "white",
    textAlign: "center",
  },
});
