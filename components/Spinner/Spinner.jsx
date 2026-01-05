import { View, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

export default function Spinner({ size = 32, color = "#340ddf" }) {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          width: size,
          height: size,
          borderColor: color,
          transform: [{ rotate: rotation }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  spinner: {
    borderWidth: 3,
    borderTopColor: "transparent",
    borderRadius: 999,
  },
});
