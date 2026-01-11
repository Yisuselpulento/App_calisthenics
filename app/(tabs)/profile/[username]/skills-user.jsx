import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "../../../../context/AuthContext";
import BackButton from "../../../../components/Buttons/BackButton";
import UserSkillCard from "../../../../components/Cards/UserSkillCard";
import { getUserVariants } from "../../../../helpers/getUserVariants";

export default function SkillsUser() {
  const router = useRouter();
  const { currentUser, viewedProfile } = useAuth();

  const user = viewedProfile;
  const isOwner = currentUser?.username === user?.username;
  const userVariants = getUserVariants(user?.skills || []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Skills</Text>

        <View style={styles.actions}>
          {isOwner && (
            <Pressable
              onPress={() =>
                router.push(`/profile/${currentUser.username}/add-skill`)
              }
              style={styles.addBtn}
            >
              <Text style={styles.addText}>+ Skill</Text>
            </Pressable>
          )}

          <BackButton />
        </View>
      </View>

      {/* LIST */}
      {userVariants.length > 0 ? (
        <FlatList
          data={userVariants}
          keyExtractor={(item) => item.userSkillVariantId}
          numColumns={2}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <UserSkillCard
              skill={item}
              ownerUsername={user.username}
            />
          )}
        />
      ) : (
        <Text style={styles.empty}>
          {isOwner
            ? "Aún no tienes skills desbloqueadas."
            : "Este usuario no tiene skills desbloqueadas."}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  addBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  addText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  empty: {
    marginTop: 20,
    color: "#9ca3af",
    fontStyle: "italic",
  },
});
