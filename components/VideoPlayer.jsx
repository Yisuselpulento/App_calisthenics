import { View, StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";

export default function VideoPlayer({ src, shouldPlay = false }) {
  const player = useVideoPlayer(src ?? null, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (!player) return;
    try {
      if (shouldPlay) player.play();
      else player.pause();
    } catch {}
  }, [player, shouldPlay]);

  if (!src) return null;

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="contain"
        nativeControls={false}
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
