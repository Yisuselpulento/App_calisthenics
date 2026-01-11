import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import ButtonSkill from "../../../../components/Buttons/ButtonSkill";
import SubmitButton from "../../../../components/Buttons/SubmitButton";
import VideoPlayer from "../../../../components/VideoPlayer";
import { useAuth } from "../../../../context/AuthContext";
import { getAllSkillsAdminService } from "../../../../Services/SkillAdminFetching";
import { addSkillVariantService } from "../../../../Services/skillFetching";
import { getVariantBgColor } from "../../../../helpers/colorTargetVariants";
import { showToast } from "../../../../helpers/showToast";

const MAX_VIDEO_SIZE_MB = 100;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export default function AddSkill() {
  const { updateViewedProfile } = useAuth();

  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [video, setVideo] = useState(null);
  const [fingersUsed, setFingersUsed] = useState(5);

  /* =========================
     Cargar skills
  ========================= */
  useEffect(() => {
    (async () => {
      setLoadingSkills(true);
      const res = await getAllSkillsAdminService();

      if (!res.success) {
        showToast("error", res.message);
      } else {
        setSkills(res.data);
      }

      setLoadingSkills(false);
    })();
  }, []);

  /* =========================
     Seleccionar video
  ========================= */
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (asset.fileSize > MAX_VIDEO_SIZE_BYTES) {
      showToast("error", "El video no puede superar los 100 MB");
      return;
    }

    setVideo(asset);
  };

  /* =========================
     Agregar skill
  ========================= */
  const handleAddSkill = async () => {
    if (!selectedSkill || !selectedVariant) {
      showToast("error", "Debes seleccionar una skill y una variante");
      return;
    }

    if (!video) {
      showToast("error", "Debes subir un video");
      return;
    }

    if (![1, 2, 5].includes(fingersUsed)) {
      showToast("error", "Solo puedes elegir 1, 2 o 5 dedos");
      return;
    }

    setLoadingSubmit(true);

    const formData = new FormData();
    formData.append("skillId", selectedSkill._id);
    formData.append("variantKey", selectedVariant.variantKey);
    formData.append("fingers", fingersUsed);
    formData.append("video", {
      uri: video.uri,
      name: "skill-video.mp4",
      type: "video/mp4",
    });

    const res = await addSkillVariantService(formData);

    if (!res.success) {
      showToast("error", res.message);
      setLoadingSubmit(false);
      return;
    }

    updateViewedProfile(res.user);

    setSelectedSkill(null);
    setSelectedVariant(null);
    setVideo(null);
    setFingersUsed(5);

    showToast("success", res.message);
    setLoadingSubmit(false);
  };

  /* =========================
     Render
  ========================= */
  if (loadingSkills) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!skills.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No hay skills disponibles.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Skill</Text>

      {!selectedSkill ? (
        <View style={styles.grid}>
          {skills.map((skill) => (
            <ButtonSkill
              key={skill._id}
              skill={skill}
              onPress={() => setSelectedSkill(skill)}
            />
          ))}
        </View>
      ) : (
        <View>
          <Pressable onPress={() => setSelectedSkill(null)}>
            <Text style={styles.back}>← Volver</Text>
          </Pressable>

          <Text style={styles.subtitle}>{selectedSkill.name}</Text>

          {selectedSkill.variants.map((v) => {
            const isSelected =
              selectedVariant?.variantKey === v.variantKey;

            return (
              <Pressable
                key={v.variantKey}
                onPress={() => setSelectedVariant(v)}
                style={[
                  styles.variant,
                  isSelected
                    ? styles.variantSelected
                    : getVariantBgColor(v.difficulty),
                ]}
              >
                <Text style={styles.variantText}>{v.name}</Text>
                <Text style={styles.variantSub}>
                  ({v.difficulty || "-"})
                </Text>
              </Pressable>
            );
          })}

          {selectedVariant && (
            <View style={styles.section}>
              <Pressable style={styles.videoButton} onPress={pickVideo}>
                <Text style={styles.videoButtonText}>
                  Seleccionar video
                </Text>
              </Pressable>

              <VideoPlayer src={video?.uri} />

              {/* Dedos */}
<View style={styles.section}>
  <Text style={styles.label}>Dedos usados</Text>

  <View style={styles.fingersRow}>
    {[1, 2, 5].map((f) => {
      const active = fingersUsed === f;
      return (
        <Pressable
          key={f}
          onPress={() => setFingersUsed(f)}
          style={[
            styles.fingerButton,
            active && styles.fingerButtonActive,
          ]}
        >
          <Text
            style={[
              styles.fingerText,
              active && styles.fingerTextActive,
            ]}
          >
            {f} dedo{f > 1 ? "s" : ""}
          </Text>
        </Pressable>
      );
    })}
  </View>
</View>

              <SubmitButton
                loading={loadingSubmit}
                text="Agregar Skill"
                onClick={handleAddSkill}
              />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  back: {
    color: "#60A5FA",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  variant: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    marginBottom: 8,
  },
  variantSelected: {
    backgroundColor: "#2563EB",
  },
  variantText: {
    color: "white",
  },
  variantSub: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  section: {
    marginTop: 20,
    gap: 12,
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
  label: {
  color: "#9CA3AF",
  fontSize: 14,
},

fingersRow: {
  flexDirection: "row",
  gap: 10,
},

fingerButton: {
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: "#374151",
},

fingerButtonActive: {
  backgroundColor: "#2563EB",
  borderColor: "#2563EB",
},

fingerText: {
  color: "#9CA3AF",
  fontSize: 14,
},

fingerTextActive: {
  color: "white",
  fontWeight: "600",
},
});
