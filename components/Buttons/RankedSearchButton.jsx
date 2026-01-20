import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { useRankedSocket } from "../../context/RankedSocketContext";
import { useAuth } from "../../context/AuthContext";
import SearchTimer from "../SearchTimer";


const MIN_ENERGY_TO_RANKED = 333;

export default function RankedSearchButton() {
  const socket = useRankedSocket();
  const { currentUser } = useAuth();

  const [searching, setSearching] = useState(false);
  const [mode, setMode] = useState("static");

  const searchingRef = useRef(false);

  /* =========================
     START SEARCH
  ========================== */
  const startSearch = () => {
    if (searchingRef.current) return;

    if (
      !currentUser?.stats?.energy ||
      currentUser.stats.energy < MIN_ENERGY_TO_RANKED
    ) {
      Toast.show({
        type: "error",
        text1: "Energía insuficiente para ranked",
      });
      return;
    }

    const hasCombo = currentUser?.favoriteCombos?.[mode];
    if (!hasCombo) {
      Toast.show({
        type: "error",
        text1: `No tienes combo ${mode}`,
      });
      return;
    }

    socket.emit("ranked:search", { mode });

    searchingRef.current = true;
    setSearching(true);
  };

  /* =========================
     CANCEL SEARCH
  ========================== */
  const cancelSearch = () => {
    socket.emit("ranked:cancel", { mode });

    searchingRef.current = false;
    setSearching(false);
  };

  /* =========================
     CLEANUP
  ========================== */
  useEffect(() => {
    return () => {
      if (searchingRef.current) {
        socket.emit("ranked:cancel", { mode });
      }
    };
  }, [socket, mode]);

  const notEnoughEnergy =
    !currentUser?.stats?.energy ||
    currentUser.stats.energy < MIN_ENERGY_TO_RANKED;

  return (
    <View style={styles.container}>
      {/* FILA BOTÓN + TIMER */}
      <View style={styles.row}>
        <Pressable
          onPress={searching ? cancelSearch : startSearch}
          disabled={!searching && notEnoughEnergy}
          style={[
            styles.mainButton,
            searching && styles.cancel,
            !searching && notEnoughEnergy && styles.disabled,
          ]}
        >
          <Text style={styles.mainText}>
            {searching
              ? `Cancelar (${mode})`
              : notEnoughEnergy
              ? "Energía insuficiente"
              : `Buscar ${mode}`}
          </Text>
        </Pressable>

        {/* ⏱ TIMER */}
        <SearchTimer active={searching} />
      </View>

      {/* SELECTOR DE MODO */}
      {!searching && (
        <View style={styles.modeRow}>
          {["static", "dynamic"].map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              style={[
                styles.modeButton,
                mode === m && styles.modeActive,
              ]}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === m && styles.modeTextActive,
                ]}
              >
                {m}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  mainButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#FACC15",
  },

  mainText: {
    fontWeight: "700",
    color: "#000",
  },

  cancel: {
    backgroundColor: "#DC2626",
  },

  disabled: {
    backgroundColor: "#4B5563",
  },

  modeRow: {
    flexDirection: "row",
    gap: 6,
  },

  modeButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#374151",
  },

  modeActive: {
    backgroundColor: "#FACC15",
  },

  modeText: {
    color: "#D1D5DB",
    fontSize: 12,
  },

  modeTextActive: {
    color: "#000",
    fontWeight: "700",
  },
});
