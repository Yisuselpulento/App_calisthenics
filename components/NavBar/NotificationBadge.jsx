import { View, Text, StyleSheet } from "react-native";

const NotificationBadge = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count}</Text>
    </View>
  );
};

export default NotificationBadge;

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#DC2626", // rojo
    borderRadius: 9999,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
