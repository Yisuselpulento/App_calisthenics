import { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import ConfirmUnfollowModal from "../Modals/ConfirmUnfollowModal";
import ReportModal from "../Modals/ReportModal";
import { userReportReasons } from "../../helpers/reportsOptions";


export default function ButtonConfigProfile({
  isFollowing,
  onUnfollowConfirmed,
  onReportSend,
  loadingReport,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <View>
      <Pressable onPress={() => setOpenMenu(true)}>
        <Feather name="more-vertical" size={20} color="#fff" />
      </Pressable>

      {openMenu && (
        <View style={styles.menu}>
          {isFollowing && (
            <Pressable
              style={styles.item}
              onPress={() => {
                setOpenMenu(false);
                setShowUnfollowModal(true);
              }}
            >
              <Text style={styles.text}>Dejar de seguir</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.item}
            onPress={() => {
              setOpenMenu(false);
              setShowReportModal(true);
            }}
          >
            <Text style={styles.text}>Reportar usuario</Text>
          </Pressable>
        </View>
      )}

      <ConfirmUnfollowModal
        isOpen={showUnfollowModal}
        onCancel={() => setShowUnfollowModal(false)}
        onConfirm={() => {
          onUnfollowConfirmed();
          setShowUnfollowModal(false);
        }}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSend={async (reason) => {
          await onReportSend(reason);
          setShowReportModal(false);
        }}
        loading={loadingReport}
        reasons={userReportReasons}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    top: 24,
    right: 0,
    backgroundColor: "#1c1917",
    borderRadius: 10,
    padding: 6,
    width: 170,
    zIndex: 50,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  text: {
    color: "#fff",
    fontSize: 14,
  },
});
