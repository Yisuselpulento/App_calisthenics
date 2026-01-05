import { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../../../context/AuthContext";
import { getLevelColor } from "../../../../helpers/getLevelColor";
import { createReportService } from "../../../../Services/reportsFetching";
import ButtonConfigProfile from "../../../../components/Buttons/ButtonConfigProfile";
import EnergyBar from "../../../../components/Profile/EnergyBar";
import RankingDisplay from "../../../../components/Profile/RankingDisplay";
import ProgressBar from "../../../../components/Profile/ProgressBar";
import ButtonFollow from "../../../../components/Buttons/ButtonFollow";
import VsButton from "../../../../components/Buttons/VsButton";
import ImageLightbox from "../../../../components/ImageLightbox";
import { tailwindColors } from "../../../../helpers/tailwindColor";
import { getRankingBorderWrapper } from "../../../../helpers/getRankingborderWrapper";

export default function Profile() {
  const router = useRouter();
  const { currentUser, viewedProfile, toggleFollow } = useAuth();

  const [loadingReport, setLoadingReport] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  if (!viewedProfile) return null;

  const user = viewedProfile;
  const isCurrentUser = currentUser?._id === user._id;
  const isFollowing = currentUser?.following?.some(
    (f) => f._id === user._id
  );

  const colorKey = getLevelColor(user);
  const bgColor = tailwindColors[colorKey] || "#eab308";
  const borderColor = bgColor + "CC";

  const userTeam = user.teams?.length > 0 ? user.teams[0] : null;
  const showPesoAltura =
    (user.peso ?? 0) > 0 || (user.altura ?? 0) > 0;

  /* ---------------------- REPORT USER ---------------------- */
  const handleReportSend = async (reasonValue) => {
    setLoadingReport(true);

    const res = await createReportService({
      targetType: "User",
      target: user._id,
      reason: reasonValue,
      description: "",
    });

    Toast.show({
      type: res.success ? "success" : "error",
      text1: res.message,
    });

    setLoadingReport(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ---------------------- PROFILE CARD ---------------------- */}
      <View style={styles.profileCard}>
        {/* CONFIG BUTTON */}
        {!isCurrentUser && (
          <View style={styles.configButton}>
            <ButtonConfigProfile
              isFollowing={isFollowing}
              onUnfollowConfirmed={() =>
                toggleFollow({ _id: user._id })
              }
              onReportSend={handleReportSend}
              loadingReport={loadingReport}
            />
          </View>
        )}

        {/* LEFT */}
        <View style={styles.left}>
          <Pressable
            onPress={() => setOpenImage(true)}
            style={[
              styles.avatarWrapper,
              getRankingBorderWrapper(user.ranking?.static?.tier),
            ]}
          >
            <Image
              source={{ uri: user.avatar.url }}
              style={[
                styles.avatar,
                { borderColor: bgColor },
              ]}
            />
          </Pressable>

          {isCurrentUser && (
            <EnergyBar maxEnergy={1000} />
          )}

          {showMore && (
            <RankingDisplay ranking={user.ranking} />
          )}
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.fullName}</Text>

            <View
              style={[
                styles.profileType,
                {
                  backgroundColor: bgColor,
                  borderColor,
                },
              ]}
            >
              <Text style={styles.profileTypeText}>
                {user.profileType}
              </Text>
            </View>
          </View>

          {showPesoAltura && (
            <View style={styles.metrics}>
              {user.peso != null && (
                <Text style={styles.metric}>
                  Peso: {user.peso} kg
                </Text>
              )}
              {user.altura != null && (
                <Text style={styles.metric}>
                  Altura: {user.altura} m
                </Text>
              )}
            </View>
          )}

          {isCurrentUser && (
            <Pressable
              onPress={() =>
                router.push(`/profile/${user.username}/edit`)
              }
              style={styles.upgrade}
            >
              <Text style={styles.upgradeText}>Upgrade</Text>
            </Pressable>
          )}

          {/* AU */}
          <View style={styles.auSection}>
            <View style={styles.auHeader}>
              <Text style={styles.auText}>
                AU: {user.stats?.mainAura || 0}
              </Text>

              <Pressable
                onPress={() => setShowMore((prev) => !prev)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showMore ? "eye-off" : "eye"}
                  size={14}
                  color="#fff"
                />
              </Pressable>
            </View>

            <ProgressBar
              level={user.stats?.mainAura || 0}
              maxLevel={18000}
              label="Main AU"
            />

            {showMore && (
              <View style={styles.subBars}>
                <ProgressBar
                  level={user.stats?.staticAura || 0}
                  maxLevel={9000}
                  label="Static AU"
                  showPercent={false}
                />
                <ProgressBar
                  level={user.stats?.dynamicAura || 0}
                  maxLevel={9000}
                  label="Dynamic AU"
                  showPercent={false}
                />
              </View>
            )}
          </View>
        </View>
      </View>

      {/* FOLLOW BUTTON */}
      {!isCurrentUser && (
        <ButtonFollow targetUserId={user._id} />
      )}

      {/* TEAM */}
      {userTeam && (
        <Pressable
          style={styles.team}
          onPress={() =>
            router.push(`/teams/${userTeam._id}`)
          }
        >
          <Image
            source={{ uri: userTeam.avatar }}
            style={styles.teamImage}
          />
        </Pressable>
      )}

      {/* FAVORITE SKILLS */}
      {user.favoriteSkills?.length > 0 && (
        <View style={styles.favorites}>
          {user.favoriteSkills.map((fs, index) => (
            <View key={index} style={styles.videoBox}>
              {/* Reusa tu VideoPlayer */}
            </View>
          ))}
        </View>
      )}

      {/* VS */}
      {!isCurrentUser && (
        <View style={styles.vs}>
          <VsButton opponent={user} />
        </View>
      )}

      {/* LIGHTBOX */}
      <ImageLightbox
        src={user.avatar.url}
        isOpen={openImage}
        onClose={() => setOpenImage(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingBottom: 40,
  },

  profileCard: {
    flexDirection: "row",
    gap: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 12,
  },

  configButton: {
    position: "absolute",
    top: 6,
    left: 6,
    zIndex: 20,
  },

  left: {
    alignItems: "center",
    gap: 8,
  },

  avatarWrapper: {
    borderRadius: 999,
    padding: 3,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
  },

  right: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  profileType: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },

  profileTypeText: {
    fontSize: 10,
    color: "#fff",
  },

  metrics: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  metric: {
    fontSize: 11,
    color: "#e5e7eb",
  },

  upgrade: {
    marginTop: 6,
    backgroundColor: "#3b82f6",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  upgradeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  auSection: {
    marginTop: 12,
  },

  auHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  auText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  eyeBtn: {
    borderWidth: 1,
    borderColor: "#6b7280",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  subBars: {
    marginTop: 6,
    gap: 4,
  },

  team: {
    marginTop: 12,
  },

  teamImage: {
    width: "100%",
    height: 80,
    borderRadius: 10,
  },

  favorites: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginTop: 12,
  },

  videoBox: {
    width: 120,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },

  vs: {
    marginTop: 20,
    alignItems: "center",
  },
});
