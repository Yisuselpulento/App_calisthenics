import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  getComboByIdService,
  updateComboService,
} from "../../../../../../Services/comboFetching";
import { useAuth } from "../../../../../../context/AuthContext";
import SubmitButton from "../../../../../../components/Buttons/SubmitButton";
import VideoPlayer from "../../../../../../components/VideoPlayer";
import BarEnergyEditCombo from "../../../../../../components/BarEnergyEditCombo";
import { showToast } from "../../../../../../helpers/showToast";

const MAX_VIDEO_SIZE_MB = 100;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export default function EditCombo() {
  const { comboId } = useLocalSearchParams();
  const router = useRouter();
  const { viewedProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [comboType, setComboType] = useState(null);
  const [initialElements, setInitialElements] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    video: null,
    elements: [],
  });

  /* =========================
     FETCH COMBO
  ========================= */
  useEffect(() => {
    if (!comboId) return;

    const fetchCombo = async () => {
      setLoading(true);
      try {
        const res = await getComboByIdService(comboId);

        if (!res.success || !res.combo) {
          showToast("error", "Combo no encontrado");
          return;
        }

        const combo = res.combo;
        setComboType(combo.type);

        const mappedElements = combo.elements.map((el) => ({
          userSkill: el.userSkill,
          skillName: el.skillName,
          userSkillVariantId: el.userSkillVariantId,
          variantKey: el.variantKey,
          variantName: el.variantName,
          hold: el.hold ?? "",
          reps: el.reps ?? "",
          energyPerSecond: el.energyPerSecond || 0,
          energyPerRep: el.energyPerRep || 0,
        }));

        setFormData({
          name: combo.name || "",
          video: combo.video?.url || null,
          elements: mappedElements,
        });

        // 🔒 snapshot inicial
        setInitialElements(JSON.stringify(mappedElements));
      } catch (err) {
        console.error(err);
        showToast("error", "Error cargando combo");
      } finally {
        setLoading(false);
      }
    };

    fetchCombo();
  }, [comboId]);

  /* =========================
     USER ENERGY
  ========================= */
  const userEnergy = useMemo(() => {
    if (!viewedProfile || !comboType) return 0;

    return comboType === "static"
      ? viewedProfile.stats?.staticAura || 0
      : viewedProfile.stats?.dynamicAura || 0;
  }, [viewedProfile, comboType]);

  /* =========================
     ENERGY USED
  ========================= */
  const totalEnergyUsed = useMemo(() => {
    return formData.elements.reduce((sum, el) => {
      return (
        sum +
        (Number(el.hold) || 0) * el.energyPerSecond +
        (Number(el.reps) || 0) * el.energyPerRep
      );
    }, 0);
  }, [formData.elements]);

  /* =========================
     VIDEO PICKER
  ========================= */
  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (res.canceled) return;

    const video = res.assets[0];

    if (video.fileSize > MAX_VIDEO_SIZE_BYTES) {
      showToast("error", "El video no puede superar los 100 MB");
      return;
    }

    setFormData((p) => ({ ...p, video }));
  };

  /* =========================
     ELEMENT CHANGE
  ========================= */
  const handleElementChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.elements];
      updated[index] = {
        ...updated[index],
        [field]: value === "" ? "" : Number(value),
      };
      return { ...prev, elements: updated };
    });
  };

  /* =========================
     VALIDACIONES
  ========================= */
  const elementsChanged =
    JSON.stringify(formData.elements) !== initialElements;

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (totalEnergyUsed > userEnergy) {
      showToast("error", "No tienes energía suficiente para este combo");
      return;
    }

    if (elementsChanged && !formData.video?.uri) {
      showToast("error", "Si modificas el combo debes subir un nuevo video");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("elements", JSON.stringify(formData.elements));

      if (formData.video?.uri) {
        data.append("video", {
          uri: formData.video.uri,
          name: "combo.mp4",
          type: "video/mp4",
        });
      }

      const res = await updateComboService(comboId, data);

      if (!res.success) {
        showToast("error", res.message || "Error actualizando combo");
        return;
      }

      showToast("success", "Combo actualizado");
      router.back();
    } catch (err) {
      console.error(err);
      showToast("error", "Error guardando combo");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.elements.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Combo</Text>

      {/* NOMBRE */}
      <View>
        <Text style={styles.label}>Nombre del combo</Text>
        <TextInput
          value={formData.name}
          onChangeText={(v) =>
            setFormData((p) => ({ ...p, name: v }))
          }
          style={styles.input}
        />
      </View>

      {/* VIDEO */}
      <View>
        <Text style={styles.label}>Video del combo</Text>

        <Pressable style={styles.videoBtn} onPress={pickVideo}>
          <Text style={styles.videoBtnText}>Cambiar video</Text>
        </Pressable>

        {formData.video && (
          <View style={{ marginTop: 8 }}>
            <VideoPlayer
              src={formData.video.uri || formData.video}
            />
          </View>
        )}
      </View>

      {/* ENERGY BAR */}
      <BarEnergyEditCombo
        elements={formData.elements}
        userEnergy={userEnergy}
      />

      {/* ELEMENTOS */}
      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>
          Elementos del combo
        </Text>

        {formData.elements.map((el, index) => (
          <View key={index} style={styles.elementCard}>
            <Text style={styles.elementTitle}>
              {el.skillName} — {el.variantName}
            </Text>

            {el.energyPerSecond > 0 && (
              <TextInput
                placeholder="Segundos"
                keyboardType="numeric"
                value={String(el.hold)}
                onChangeText={(v) =>
                  handleElementChange(index, "hold", v)
                }
                style={styles.input}
              />
            )}

            {el.energyPerRep > 0 && (
              <TextInput
                placeholder="Repeticiones"
                keyboardType="numeric"
                value={String(el.reps)}
                onChangeText={(v) =>
                  handleElementChange(index, "reps", v)
                }
                style={styles.input}
              />
            )}
          </View>
        ))}
      </View>

      <SubmitButton
        loading={loading}
        text="Guardar cambios"
        onPress={handleSubmit}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },

  label: {
    color: "#E5E7EB",
    fontSize: 12,
    marginBottom: 4,
  },

  input: {
    backgroundColor: "#1F2937",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    marginTop: 6,
  },

  videoBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#7C3AED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  videoBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  sectionTitle: {
    fontWeight: "600",
    color: "#fff",
    marginTop: 10,
  },

  elementCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#374151",
    gap: 6,
  },

  elementTitle: {
    color: "#E5E7EB",
    fontWeight: "600",
    fontSize: 13,
  },
});

