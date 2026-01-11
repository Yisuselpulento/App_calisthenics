import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

import ReportModal from "../Modals/ReportModal";
import VideoPlayer from "../VideoPlayer";
import { createReportService } from "../../Services/reportsFetching";
import { skillReportReasons } from "../../helpers/reportsOptions";

export default function SkillCard({ skill, view, ownerUsername }) {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!skill) return null;

  const isOwner = currentUser?.username === ownerUsername;

  const {
    skillName,
    variantKey,
    name,
    fingers,
    video,
    type,
    staticAU,
    dynamicAU,
    userSkillVariantId,
  } = skill;

  const handleReport = async (reason) => {
    setLoading(true);

    await createReportService({
      targetType: "UserSkill",
      target: userSkillVariantId,
      variantInfo: { variantKey, fingers },
      reason,
      description: "",
    });

    setLoading(false);
    setShowReport(false);
  };

  return (
    <>
      <Pressable
        onPress={() =>
          router.push(
            `/profile/${ownerUsername}/skill/${userSkillVariantId}`
          )
        }
        style={[
          styles.card,
          view === "detail" && styles.detail,
        ]}
      >
        {!isOwner && (
          <Pressable
            onPress={() => setShowReport(true)}
            style={styles.report}
          >
            <Ionicons name="flag-outline" size={16} color="#fff" />
          </Pressable>
        )}

        <Text style={styles.title}>{name || variantKey}</Text>
        <Text style={styles.sub}>Skill: {skillName}</Text>

        <Text style={styles.stats}>
          Static AU:{" "}
          <Text style={styles.static}>{staticAU ?? 0}</Text> | Dynamic AU:{" "}
          <Text style={styles.dynamic}>{dynamicAU ?? 0}</Text>
        </Text>

        <Text style={styles.sub}>Fingers: {fingers}</Text>

        <Text
          style={[
            styles.type,
            type === "static"
              ? styles.staticBg
              : type === "dynamic"
              ? styles.dynamicBg
              : styles.otherBg,
          ]}
        >
          {type}
        </Text>

        {video && <VideoPlayer src={video.url}  shouldPlay />}
      </Pressable>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        onSend={handleReport}
        loading={loading}
        reasons={skillReportReasons}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 14,
  },

  /* Vista detail */
  detail: {
    gap: 6,
  },

  report: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#292524",
    padding: 6,
    borderRadius: 999,
    zIndex: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },

  sub: {
    fontSize: 12,
    color: "#9ca3af",
  },

  stats: {
    fontSize: 13,
    color: "#d1d5db",
    marginTop: 4,
  },

  static: {
    color: "#60a5fa",
    fontWeight: "600",
  },

  dynamic: {
    color: "#4ade80",
    fontWeight: "600",
  },

  type: {
    alignSelf: "flex-start",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  staticBg: {
    backgroundColor: "rgba(59,130,246,0.4)",
    color: "#93c5fd",
  },

  dynamicBg: {
    backgroundColor: "rgba(34,197,94,0.4)",
    color: "#86efac",
  },

  otherBg: {
    backgroundColor: "rgba(234,179,8,0.4)",
    color: "#fde047",
  },
});
