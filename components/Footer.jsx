import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Footer = ({ pathname }) => {
  if (pathname?.startsWith("/profile")) return null;

  return (
    <View style={styles.footer}>
      <Text style={styles.text}>Made by Monsster</Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
    marginBottom: 12,
  },
  text: {
    color: "#fff",
  },
});
