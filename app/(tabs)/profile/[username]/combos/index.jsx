import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { deleteComboService } from "../../../../../Services/comboFetching";
import BackButton from "../../../../../components/Buttons/BackButton";
import UserComboCard from "../../../../../components/Cards/UserComboCard";
import DeleteComboModal from "../../../../../components/Modals/DeleteComboModal";
import { useAuth } from "../../../../../context/AuthContext";


export default function Combos() {
  const router = useRouter();
  const { currentUser, viewedProfile, updateViewedProfile } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [comboToDelete, setComboToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = viewedProfile;
  const isOwner = currentUser?.username === user?.username;
  const combos = user?.combos || [];

  const handleDeleteClick = (combo) => {
    setComboToDelete(combo);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!comboToDelete) return;

    setLoading(true);

    const res = await deleteComboService(
      comboToDelete._id || comboToDelete.comboId
    );

    if (!res?.success) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res?.message || "No se pudo eliminar el combo",
      });
      setLoading(false);
      return;
    }

    updateViewedProfile(res.user);

    Toast.show({
      type: "success",
      text1: "Combo eliminado",
    });

    setShowDeleteModal(false);
    setComboToDelete(null);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Combos</Text>

        <View style={styles.actions}>
          {isOwner && (
            <Pressable
              onPress={() =>
  router.push(`/profile/${user.username}/combos/add`)
}
              style={styles.addBtn}
            >
              <Text style={styles.addText}>+ Combo</Text>
            </Pressable>
          )}

          <BackButton />
        </View>
      </View>

      {/* LIST */}
      {combos.length > 0 ? (
        <FlatList
          data={combos}
          keyExtractor={(item) => item._id || item.comboId}
          numColumns={2}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <UserComboCard
              combo={item}
              username={user.username}
              isOwner={isOwner}
              onDeleteClick={handleDeleteClick}
            />
          )}
        />
      ) : (
        <Text style={styles.empty}>
          {isOwner
            ? "Aún no has creado combos."
            : "Este usuario no tiene combos creados."}
        </Text>
      )}

      <DeleteComboModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        comboName={comboToDelete?.name || comboToDelete?.comboName}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#020617",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  addBtn: {
    backgroundColor: "#2563eb",
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
    textAlign: "center",
    color: "#9ca3af",
    fontStyle: "italic",
  },
});
