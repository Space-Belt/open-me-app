import { primaryColors, typography } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  size?: "small" | "large";
  color?: string;
  text?: string;
  type?: "spinner" | "default";
};

const BasicIndicator = ({
  size = "large",
  color = "#21808D",
  text,
  type = "default",
}: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

export default BasicIndicator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 12,
    ...typography.headline20Bold,
    color: primaryColors.fifty,
  },
});
