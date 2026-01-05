import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";


import { useAuth } from "../../../../../context/AuthContext";
import BackButton from "../../../../../components/Buttons/BackButton";
import EnergyBar from "../../../../../components/Profile/EnergyBar";
import SubmitButton from "../../../../../components/Buttons/SubmitButton";
import VideoPlayer from "../../../../../components/VideoPlayer";
import { createComboService } from "../../../../../Services/comboFetching";
import { getUserVariants } from "../../../../../helpers/getUserVariants";

const MAX_VIDEO_MB = 100;

export default function AddCombo() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const { viewedProfile, updateViewedProfile } = useAuth();

  /* -------------------- STATE -------------------- */
  const [comboName, setComboName] = useState("");
  const [type, setType] = useState("static");
  const [elements, setElements] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const maxVariants = 10;
  const minVariants = 3;

  /* -------------------- DATA --------------------- */
  const userVariants = useMemo(
    () => getUserVariants(viewedProfile?.skills),
    [viewedProfile]
  );

  const filteredVariants = useMemo(() => {
    if (!userVariants) return [];
    if (type !== "static") return userVariants;
    return userVariants.filter(
      (v) => v.type === "static" || v.type === "basic"
    );
  }, [userVariants, type]);

  const userEnergy = useMemo(() => {
    if (!viewedProfile?.stats) return 0;
    if (type === "static") return viewedProfile.stats.staticAura ?? 0;
    if (type === "dynamic") return viewedProfile.stats.dynamicAura ?? 0;
    return Math.min(
      viewedProfile.stats.staticAura ?? 0,
      viewedProfile.stats.dynamicAura ?? 0
    );
  }, [type, viewedProfile]);

  /* ---------------- ENERGY CHECK ---------------- */
  const exceedsEnergy = useMemo(() => {
    let total = 0;

    for (const el of elements) {
      const variant = userVariants?.find(
        (v) => v.userSkillVariantId === el.userSkillVariantId
      );
      if (!variant) continue;

      const { energyPerSecond = 0, energyPerRep = 0 } =
        variant.stats || {};

      total +=
        energyPerSecond > energyPerRep
          ? energyPerSecond * el.hold
          : energyPerRep * el.reps;
    }

    return total > userEnergy;
  }, [elements, userVariants, userEnergy]);

  /* -------------------- VIDEO -------------------- */
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (asset.fileSize / 1024 / 1024 > MAX_VIDEO_MB) {
      Toast.show({
        type: "error",
        text1: "El video supera los 100 MB",
      });
      return;
    }

    setVideo(asset);
  };

  /* -------------------- HANDLERS -------------------- */
  const toggleVariant = (id) => {
    setElements((prev) => {
      const exists = prev.some((e) => e.userSkillVariantId === id);

      if (exists) {
        return prev.filter((e) => e.userSkillVariantId !== id);
      }

      if (prev.length >= maxVariants) {
        Toast.show({
          type: "error",
          text1: `Máximo ${maxVariants} variantes`,
        });
        return prev;
      }

      return [...prev, { userSkillVariantId: id, hold: 0, reps: 0 }];
    });
  };

  const setHoldOrReps = (index, value) => {
    const numberValue = Number(value) || 0;

    setElements((prev) => {
      const updated = [...prev];
      const variant = userVariants?.find(
        (v) => v.userSkillVariantId === updated[index].userSkillVariantId
      );
      if (!variant) return updated;

      const usesHold =
        (variant.stats?.energyPerSecond ?? 0) >
        (variant.stats?.energyPerRep ?? 0);

      updated[index] = {
        ...updated[index],
        hold: usesHold ? numberValue : 0,
        reps: usesHold ? 0 : numberValue,
      };

      return updated;
    });
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!comboName.trim()) {
      return Toast.show({ type: "error", text1: "Nombre requerido" });
    }

    if (elements.length < minVariants) {
      return Toast.show({
        type: "error",
        text1: `Mínimo ${minVariants} variantes`,
      });
    }

    if (!video) {
      return Toast.show({
        type: "error",
        text1: "Debes subir un video",
      });
    }

    if (exceedsEnergy) {
      return Toast.show({
        type: "error",
        text1: "Energía insuficiente",
      });
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", comboName);
      formData.append("type", type);
      formData.append("elements", JSON.stringify(elements));
      formData.append("video", {
        uri: video.uri,
        name: "combo-video.mp4",
        type: "video/mp4",
      });

      const res = await createComboService(formData);
      if (!res.success) throw new Error(res.message);

      Toast.show({ type: "success", text1: "Combo creado 🎉" });
      updateViewedProfile(res.user);
      router.push(`/profile/${username}`);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: err.message || "Error creando combo",
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear nuevo Combo</Text>
        <BackButton />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={comboName}
          onChangeText={setComboName}
          style={styles.input}
          placeholder="Static Flow LVL 4"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>
          {["static", "dynamic"].map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[
                styles.typeButton,
                type === t && styles.typeActive,
              ]}
            >
              <Text style={styles.typeText}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <EnergyBar
          elements={elements}
          userVariants={userVariants}
          userEnergy={userEnergy}
        />

        <View style={styles.variants}>
          {filteredVariants.map((v) => {
            const selected = elements.some(
              (e) => e.userSkillVariantId === v.userSkillVariantId
            );

            return (
              <Pressable
                key={v.userSkillVariantId}
                onPress={() => toggleVariant(v.userSkillVariantId)}
                style={[
                  styles.variant,
                  selected && styles.variantActive,
                ]}
              >
                <Text style={styles.variantText}>{v.name}</Text>
              </Pressable>
            );
          })}
        </View>

        {elements.map((el, i) => {
          const variant = userVariants?.find(
            (v) => v.userSkillVariantId === el.userSkillVariantId
          );
          if (!variant) return null;

          const usesHold =
            (variant.stats?.energyPerSecond ?? 0) >
            (variant.stats?.energyPerRep ?? 0);

          return (
            <View key={i} style={styles.row}>
              <Text style={styles.small}>{variant.name}</Text>
              <TextInput
                keyboardType="numeric"
                placeholder={usesHold ? "Seg" : "Reps"}
                onChangeText={(v) => setHoldOrReps(i, v)}
                style={styles.smallInput}
                placeholderTextColor="#9ca3af"
              />
            </View>
          );
        })}

        <Pressable style={styles.videoBtn} onPress={pickVideo}>
          <Text style={styles.videoText}>Seleccionar video</Text>
        </Pressable>

        {video && <VideoPlayer src={video.uri} autoPlay />}

        <SubmitButton
          loading={loading}
          text="Crear Combo"
          onClick={handleSubmit}
        />
      </View>
    </ScrollView>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  label: { color: "white" },
  input: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 8,
    color: "white",
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    alignItems: "center",
  },
  typeActive: {
    backgroundColor: "#2563EB",
  },
  typeText: { color: "white" },
  variants: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  variant: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  variantActive: {
    backgroundColor: "#2563EB",
  },
  variantText: {
    color: "white",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  small: { color: "white", fontSize: 12 },
  smallInput: {
    width: 70,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 6,
    color: "white",
    textAlign: "center",
  },
  videoBtn: {
    backgroundColor: "#7C3AED",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  videoText: { color: "white" },
});
