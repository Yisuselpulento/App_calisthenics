import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ToastAndroid, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getComboByIdService, deleteComboService } from "../../../../../Services/comboFetching";
import { useAuth } from "../../../../../context/AuthContext";
import VideoPlayer from "../../../../../components/VideoPlayer";
import DeleteComboModal from "../../../../../components/Modals/DeleteComboModal";
import FavoriteComboStar from "../../../../../components/Buttons/FavoriteComboStar";
import EditAndDeleteButton from "../../../../../components/Buttons/EditAndDeleteButton";
import BackButton from "../../../../../components/Buttons/BackButton";


const showToast = (msg) => {
  ToastAndroid
    ? ToastAndroid.show(msg, ToastAndroid.SHORT)
    : Alert.alert(msg);
};

export default function ComboDetails() {
  const { comboId } = useLocalSearchParams();
  const router = useRouter();
  const { currentUser, updateViewedProfile } = useAuth();

  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!comboId) return;

    const fetchCombo = async () => {
      setLoading(true);
      const res = await getComboByIdService(comboId);
      setCombo(res?.combo || null);
      setLoading(false);
    };

    fetchCombo();
  }, [comboId]);

  if (loading) {
    return <Text style={styles.center}>Cargando...</Text>;
  }

  if (!combo) {
    return <Text style={styles.center}>Combo no encontrado</Text>;
  }

  const isOwner = String(currentUser?._id) === String(combo.owner);

  const confirmDelete = async () => {
    setDeleting(true);

    const res = await deleteComboService(combo._id);

    showToast(res.message || "Combo eliminado");
    updateViewedProfile(res.user);

    setShowDeleteModal(false);
    setDeleting(false);

    router.replace(`/(profile)/${currentUser.username}/combos`);
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{combo.name}</Text>

          {isOwner && (
            <FavoriteComboStar comboId={combo._id} type={combo.type} />
          )}
        </View>

        {isOwner && (
          <EditAndDeleteButton
            onDeleteClick={() => setShowDeleteModal(true)}
            editLink={`/(profile)/${currentUser.username}/combos/${combo._id}/edit`}
          />
        )}
      </View>

      <View style={styles.card}>
        <Text><Text style={styles.bold}>Tipo:</Text> {combo.type}</Text>
        <Text><Text style={styles.bold}>Energía total:</Text> {combo.totalEnergyCost}</Text>
        <Text style={styles.date}>
          Creado: {new Date(combo.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {combo.video && (
        <VideoPlayer src={combo.video.url} shouldPlay />
      )}

      <Text style={styles.subtitle}>Skills del Combo</Text>

      {combo.elements.map((el, index) => (
        <View key={index} style={styles.element}>
          <Text style={styles.elementTitle}>
            {el.skillName} – {el.variantName}
          </Text>

          {el.video && <VideoPlayer src={el.video.url} shouldPlay />}

          <View style={styles.row}>
            <View>
              {el.hold > 0 && <Text>⏱ Hold: {el.hold}s</Text>}
              {el.reps > 0 && <Text>🔁 Reps: {el.reps}</Text>}
              <Text>🤘 Fingers: {el.fingers}</Text>
            </View>

            <View>
              <Text>🌀 Static AU: {el.staticAu}</Text>
              <Text>🔥 Dynamic AU: {el.dynamicAu}</Text>
            </View>
          </View>
        </View>
      ))}

      <DeleteComboModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        comboName={combo.name}
        loading={deleting}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    marginTop: 40,
    textAlign: "center",
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  bold: {
    fontWeight: "700",
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: "#9ca3af",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginVertical: 10,
  },
  element: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  elementTitle: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
});
