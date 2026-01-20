import { createContext, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

const CasualSocketContext = createContext(null);

export const CasualSocketProvider = ({ children }) => {
  const socket = useSocket();
  const router = useRouter();

  const { currentUser, updateCurrentUser } = useAuth();

  useEffect(() => {
    if (!socket) return;

    /* =========================
       USER UPDATED
    ========================== */
    const onUserUpdated = ({ user }) => {
      updateCurrentUser(user);
    };

    /* =========================
       NEW CHALLENGE
    ========================== */
    const onNewChallenge = () => {
      // si luego quieres mostrar algo acá, se deja listo
    };

    /* =========================
       CHALLENGE RESPONDED
    ========================== */
    const onChallengeResponded = ({ challengeId, accepted }) => {
      if (currentUser?.pendingChallenge !== challengeId) return;

      Toast.show({
        type: accepted ? "success" : "error",
        text1: accepted
          ? "Tu desafío fue aceptado 🎉"
          : "Tu desafío fue rechazado ❌",
      });
    };

    /* =========================
       CHALLENGE EXPIRED
    ========================== */
    const onChallengeExpired = ({ challengeId }) => {
      if (currentUser?.pendingChallenge !== challengeId) return;

      Toast.show({
        type: "error",
        text1: "El desafío expiró",
      });
    };

    /* =========================
       CHALLENGE CANCELLED
    ========================== */
    const onChallengeCancelled = ({ challengeId }) => {
      if (currentUser?.pendingChallenge !== challengeId) return;

      Toast.show({
        type: "error",
        text1: "Tu desafío fue cancelado",
      });
    };

    /* =========================
       MATCH COMPLETED
    ========================== */
    const onMatchCompleted = ({ matchId }) => {
      router.push(`/match/${matchId}`);
    };

    // 🎧 listeners
    socket.on("userUpdated", onUserUpdated);
    socket.on("newChallenge", onNewChallenge);
    socket.on("challengeResponded", onChallengeResponded);
    socket.on("challengeExpired", onChallengeExpired);
    socket.on("challengeCancelled", onChallengeCancelled);
    socket.on("matchCompleted", onMatchCompleted);

    return () => {
      socket.off("userUpdated", onUserUpdated);
      socket.off("newChallenge", onNewChallenge);
      socket.off("challengeResponded", onChallengeResponded);
      socket.off("challengeExpired", onChallengeExpired);
      socket.off("challengeCancelled", onChallengeCancelled);
      socket.off("matchCompleted", onMatchCompleted);
    };
  }, [socket, currentUser, updateCurrentUser]);

  return (
    <CasualSocketContext.Provider value={socket}>
      {children}
    </CasualSocketContext.Provider>
  );
};

export const useCasualSocket = () => useContext(CasualSocketContext);
