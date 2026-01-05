import { useState } from "react";
import { Pressable, Text, ToastAndroid, Alert } from "react-native";
import { toggleFavoriteComboService } from "../../Services/comboFetching";
import { useAuth } from "../../context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";

const showToast = (msg) => {
  ToastAndroid
    ? ToastAndroid.show(msg, ToastAndroid.SHORT)
    : Alert.alert(msg);
};

export default function FavoriteComboStar({ comboId, type }) {
  const { currentUser, updateCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  const isFavorite = (() => {
    const fav = currentUser.favoriteCombos?.[type];
    if (!fav) return false;
    return String(fav._id || fav) === String(comboId);
  })();

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    const res = await toggleFavoriteComboService(comboId, type);

    if (res.success) {
      showToast("Favorito actualizado");
      updateCurrentUser(res.user);
    } else {
      showToast(res.message || "Error al actualizar");
    }

    setLoading(false);
  };

  return (
    <Pressable onPress={handleToggle} disabled={loading}>
      <FontAwesome
        name={isFavorite ? "star" : "star-o"}
        size={22}
        color="#facc15"
      />
    </Pressable>
  );
}
