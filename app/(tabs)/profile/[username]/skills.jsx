import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";


import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../../context/AuthContext";
import SkillCard from "../../../../components/Cards/SkillCard";
import ComboCard from "../../../../components/Cards/ComboCard";
import { getUserVariants } from "../../../../helpers/getUserVariants";

export default function ProfileSkills() {
  const { username } = useLocalSearchParams();
  const router = useRouter();

  const { currentUser, viewedProfile } = useAuth();
  const [cardView, setCardView] = useState(false);

  const user = viewedProfile;
  const isOwner = currentUser?.username === username;

  const favoriteCombos = Object.values(user?.favoriteCombos || {})
    .filter(Boolean)
    .map((favId) => user?.combos?.find((c) => c._id === favId))
    .filter(Boolean);

  const userVariants = getUserVariants(user?.skills || []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* === COMBOS === */}
      <SectionHeader
        title="Combos"
        action={
          isOwner && (
            <Pressable
              onPress={() => router.push(`/profile/${username}/combos`)}
            >
              <Text style={styles.link}>Ver todos →</Text>
            </Pressable>
          )
        }
      />

      {favoriteCombos.length > 0 ? (
        <View style={styles.grid}>
          {favoriteCombos.map((combo) => (
            <ComboCard key={combo._id} combo={combo} />
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>
          {isOwner
            ? "Aún no tienes combos favoritos."
            : "Este usuario aún no tiene combos favoritos."}
        </Text>
      )}

      {/* === SKILLS === */}
      <SectionHeader
        title="Skills Desbloqueadas"
        action={
          <View style={styles.skillsHeaderActions}>
            <Pressable
              onPress={() => setCardView(!cardView)}
              style={styles.toggleBtn}
            >
              <Ionicons
                name={cardView ? "grid-outline" : "albums"}
                size={18}
                color="#fff"
              />
            </Pressable>

            <Pressable
              onPress={() =>
                router.push(`/profile/${username}/skills-user`)
              }
            >
              <Text style={styles.link}>Ver todas →</Text>
            </Pressable>
          </View>
        }
      />

      {userVariants.length > 0 ? (
        <View style={cardView ? styles.gridCompact : styles.grid}>
          {userVariants.map((variant) => (
            <SkillCard
              key={variant.userSkillVariantId}
              skill={variant}
              view={cardView ? "detail" : "card"}
              ownerUsername={username}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>
          {isOwner
            ? "Aún no tienes skills desbloqueadas."
            : "Este usuario aún no tiene skills desbloqueadas."}
        </Text>
      )}
    </ScrollView>
  );
}

/* 🔹 Header reutilizable */
function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  link: {
    fontSize: 13,
    color: "#60a5fa",
  },
  skillsHeaderActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  toggleBtn: {
    backgroundColor: "#292524",
    padding: 6,
    borderRadius: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridCompact: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  empty: {
    color: "#9ca3af",
    fontStyle: "italic",
    marginBottom: 16,
  },
});
