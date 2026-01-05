import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { getVariantBgColor } from "../../helpers/colorTargetVariants";
import { deleteSkillVariantService } from "../../Services/skillFetching";
import DeleteSkillVariantModal from "../Modals/DeleteSkillVariantModal";

import Toast from "react-native-toast-message";

export default function UserSkillCard({ skill, ownerUsername }) {
  const router = useRouter();
  const { currentUser, updateViewedProfile } = useAuth();

  const isOwner = currentUser?.username === ownerUsername;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!skill) return null;

  const {
    name,
    staticAU,
    dynamicAU,
    difficulty,
    userSkillVariantId,
    fingers,
  } = skill;

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await deleteSkillVariantService(userSkillVariantId);

      if (!res?.success) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res?.message || "No se pudo eliminar la skill",
        });
        setLoading(false);
        return;
      }

      updateViewedProfile(res.user);

      Toast.show({
        type: "success",
        text1: "Skill eliminada",
        text2: "La skill fue eliminada correctamente",
      });

      setShowModal(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un error inesperado",
      });
    }

    setLoading(false);
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
          styles[getVariantBgColor(difficulty)],
        ]}
      >
        <Text style={styles.name}>
          {name} <Text style={styles.fingers}>({fingers})</Text>
        </Text>

        <Text style={styles.stat}>
          AU estático:{" "}
          <Text style={styles.static}>{staticAU}</Text>
        </Text>

        <Text style={styles.stat}>
          AU dinámico:{" "}
          <Text style={styles.dynamic}>{dynamicAU}</Text>
        </Text>

        {isOwner && (
          <Pressable
            onPress={() => setShowModal(true)}
            disabled={loading}
            style={[
              styles.delete,
              loading && styles.deleteDisabled,
            ]}
          >
            <Text style={styles.deleteText}>
              {loading ? "Eliminando..." : "Eliminar"}
            </Text>
          </Pressable>
        )}
      </Pressable>

      <DeleteSkillVariantModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleDelete}
        loading={loading}
        skillName={name}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 8,
    gap: 4,
  },

  name: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  fingers: {
    color: "#9ca3af",
  },

  stat: {
    fontSize: 12,
    color: "#e5e7eb",
  },

  static: {
    color: "#4ade80",
    fontWeight: "600",
  },

  dynamic: {
    color: "#facc15",
    fontWeight: "600",
  },

  delete: {
    marginTop: 6,
    backgroundColor: "#dc2626",
    paddingVertical: 4,
    borderRadius: 6,
  },

  deleteDisabled: {
    opacity: 0.6,
  },

  deleteText: {
    color: "#fff",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
  },
});
