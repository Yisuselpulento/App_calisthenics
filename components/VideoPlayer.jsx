import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";

export default function VideoPlayer({ src }) {
  if (!src) return null;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: src }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        shouldPlay
        isLooping
        isMuted   
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    width: "100%",
    aspectRatio: 9 / 16,
    backgroundColor: "black",
    borderRadius: 12,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
