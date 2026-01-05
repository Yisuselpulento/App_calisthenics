import { useState, useEffect } from "react";
import { View, Pressable, Text, Image, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { sendChallengeService } from "../../Services/challengeFetching";


export default function VsButton({ opponent }) {
  const { currentUser } = useAuth();
  const [showSelect, setShowSelect] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [waiting, setWaiting] = useState(false);

  if (!currentUser || currentUser._id === opponent._id) return null;

  const handleSelect = async (type) => {
    setWaiting(true);
    const res = await sendChallengeService({
      toUserId: opponent._id,
      type,
    });

    if (!res.success) {
      setErrorMsg(res.message);
      setWaiting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.vsButton} onPress={() => setShowSelect(!showSelect)}>
        <Image source={require("../../assets/images/vsimage.png")} style={styles.vsImage} />
      </Pressable>

      {showSelect && !waiting && (
        <View style={styles.dropdown}>
          {["static", "dynamic"].map((t) => (
            <Pressable key={t} style={styles.option} onPress={() => handleSelect(t)}>
              <Text style={styles.optionText}>{t}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {waiting && <Text style={styles.wait}>Esperando respuesta...</Text>}
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  vsButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  vsImage: {
    height: 60,
    width: 60,
  },
  dropdown: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  option: {
    backgroundColor: "#1c1917",
    padding: 8,
    borderRadius: 8,
  },
  optionText: {
    color: "#fff",
    fontSize: 12,
  },
  wait: {
    color: "#facc15",
    marginTop: 6,
  },
  error: {
    color: "#ef4444",
    marginTop: 6,
  },
});
