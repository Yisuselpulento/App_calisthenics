import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { toggleFavoriteSkillService } from "../../Services/skillFetching";
import { useAuth } from "../../context/AuthContext";

export default function FavoriteToggleButton({ userSkillVariantId }) {
  const { viewedProfile, updateViewedProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fav = viewedProfile?.favoriteSkills?.some(
      (f) => f.userSkillVariantId === userSkillVariantId
    );
    setIsFavorite(!!fav);
  }, [viewedProfile, userSkillVariantId]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);

    const res = await toggleFavoriteSkillService(userSkillVariantId);

    if (!res?.success) {
      Toast.show({ type: "error", text1: res.message });
      setLoading(false);
      return;
    }

    updateViewedProfile(res.user);

    const nowFav = res.user.favoriteSkills?.some(
      (f) => f.userSkillVariantId === userSkillVariantId
    );

    setIsFavorite(nowFav);

    Toast.show({
      type: "success",
      text1: nowFav ? "Añadido a favoritos" : "Eliminado de favoritos",
    });

    setLoading(false);
  };

  return (
    <Pressable onPress={toggle}>
      <Ionicons
        name={isFavorite ? "star" : "star-outline"}
        size={22}
        color={isFavorite ? "#facc15" : "#9ca3af"}
      />
    </Pressable>
  );
}
