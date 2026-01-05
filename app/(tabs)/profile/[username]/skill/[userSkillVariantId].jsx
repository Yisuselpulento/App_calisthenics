import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import EditAndDeleteButton from "../../../../../components/Buttons/EditAndDeleteButton";
import FavoriteToggleButton from "../../../../../components/Buttons/FavoriteToggleButton";
import DeleteSkillVariantModal from "../../../../../components/Modals/DeleteSkillVariantModal";
import { useAuth } from "../../../../../context/AuthContext";
import Spinner from "../../../../../components/Spinner/Spinner";
import VideoPlayer from "../../../../../components/VideoPlayer";
import ReportModal from "../../../../../components/Modals/ReportModal";
import { createReportService } from "../../../../../Services/reportsFetching";
import { getUserSkillVariantService, deleteSkillVariantService } from "../../../../../Services/skillFetching";
import { skillReportReasons } from "../../../../../helpers/reportsOptions";

export default function SkillDetail() {
  const { userSkillVariantId, username } = useLocalSearchParams();
  const router = useRouter();
  const { currentUser, updateViewedProfile } = useAuth();

  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    const loadVariant = async () => {
      setLoading(true);
      const res = await getUserSkillVariantService(userSkillVariantId);

      if (!res?.success) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res?.message || "Skill no encontrada",
        });
        setVariant(null);
      } else {
        setVariant(res.variant);
      }

      setLoading(false);
    };

    if (userSkillVariantId) loadVariant();
  }, [userSkillVariantId]);

  const handleDelete = async () => {
    setLoading(true);

    const res = await deleteSkillVariantService(userSkillVariantId);

    if (!res?.success) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
      setLoading(false);
      return;
    }

    updateViewedProfile(res.user);

    Toast.show({
      type: "success",
      text1: "Skill eliminada",
    });

    setShowDelete(false);
    router.back();
  };

  const handleReport = async (reason) => {
      if (!variant) return;

    setLoadingReport(true);

    const res = await createReportService({
      targetType: "UserSkill",
      target: variant.userSkillId,
      variantInfo: {
        variantKey: variant.variantKey,
        fingers: variant.fingers,
      },
      reason,
      description: "",
    });

    Toast.show({
      type: res.success ? "success" : "error",
      text1: res.message,
    });

    setShowReport(false);
    setLoadingReport(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Spinner size="2em" />
      </View>
    );
  }

  if (!variant) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Skill no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#60a5fa" />
        </Pressable>

        {isOwner ? (
          <EditAndDeleteButton
            onEdit={() =>
              router.push(
                `/profile/${username}/edit-skill/${variant.userSkillVariantId}`
              )
            }
            onDelete={() => setShowDelete(true)}
          />
        ) : (
          <Pressable onPress={() => setShowReport(true)}>
            <Ionicons name="flag-outline" size={20} color="#fff" />
          </Pressable>
        )}
      </View>

      {/* TITLE */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{variant.name}</Text>
        {isOwner && (
          <FavoriteToggleButton
            userSkillVariantId={variant.userSkillVariantId}
          />
        )}
      </View>

      <Text style={styles.badge}>{variant.type}</Text>

      <Text style={styles.text}>
        <Text style={styles.label}>Skill base:</Text>{" "}
        {variant.skillName}
      </Text>

      <Text style={styles.text}>Fingers: {variant.fingers}</Text>
      <Text style={styles.text}>Static AU: {variant.staticAU}</Text>
      <Text style={styles.text}>Dynamic AU: {variant.dynamicAU}</Text>

      {variant.video && <VideoPlayer src={variant.video.url} />}

      {/* MODALS */}
      <DeleteSkillVariantModal
        isOpen={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
        skillName={variant.name}
      />

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        onSend={handleReport}
        loading={loadingReport}
        reasons={skillReportReasons}
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  badge: {
    alignSelf: "flex-start",
    marginVertical: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "#1e40af",
    color: "#bfdbfe",
    fontSize: 12,
  },

  text: {
    color: "#e5e7eb",
    marginBottom: 4,
  },

  label: {
    color: "#60a5fa",
    fontWeight: "600",
  },
});
