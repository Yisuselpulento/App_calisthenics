import { createContext, useContext, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useSocket } from "./SocketContext";

const RankedSocketContext = createContext(null);

export const RankedSocketProvider = ({ children }) => {
  const socket = useSocket();
  const router = useRouter();

  const readyClickedRef = useRef(false);

  useEffect(() => {
    if (!socket) return;

    /* =========================
       READY CHECK
    ========================== */
    const onReadyCheck = ({ matchId, timeout }) => {
      readyClickedRef.current = false;

      Toast.hide();

      Toast.show({
        type: "rankedReady",
        autoHide: false,
        props: {
          waiting: false,
          onAccept: () => {
            if (readyClickedRef.current) return;

            readyClickedRef.current = true;
            socket.emit("ranked:accept", { matchId });

            Toast.show({
              type: "rankedReady",
              autoHide: false,
              props: {
                waiting: true,
                onAccept: () => {},
              },
            });
          },
        },
      });

      setTimeout(() => {
        Toast.hide();
      }, timeout);
    };

    /* =========================
       CANCELADO / TIMEOUT
    ========================== */
    const onCancelled = ({ reason }) => {
      readyClickedRef.current = false;
      Toast.hide();

      Toast.show({
        type: "error",
        text1:
          reason === "timeout"
            ? "El oponente no aceptó a tiempo"
            : "La ranked fue cancelada",
      });
    };

    /* =========================
       RANKED INICIADA
    ========================== */
    const onStarted = ({ matchId }) => {
      readyClickedRef.current = false;
      Toast.hide();

      setTimeout(() => {
        router.push(`/match/${matchId}`);
      }, 300);
    };

    socket.on("ranked:readyCheck", onReadyCheck);
    socket.on("ranked:cancelled", onCancelled);
    socket.on("ranked:started", onStarted);

    return () => {
      socket.off("ranked:readyCheck", onReadyCheck);
      socket.off("ranked:cancelled", onCancelled);
      socket.off("ranked:started", onStarted);
    };
  }, [socket]);

  return (
    <RankedSocketContext.Provider value={socket}>
      {children}
    </RankedSocketContext.Provider>
  );
};

export const useRankedSocket = () => useContext(RankedSocketContext);
