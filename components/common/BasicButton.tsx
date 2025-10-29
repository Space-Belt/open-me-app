import { primaryColors, typography } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";
import BasicText from "./BasicText";

interface BasicButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  width?: number;
  custom?: React.ReactNode;
}

const BasicButton = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  textStyle,
  width,
  custom,
}: BasicButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        {
          width: width || "100%",
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {custom ? (
        custom
      ) : (
        <BasicText
          style={[
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            textStyle,
          ]}
        >
          {title}
        </BasicText>
      )}
    </Pressable>
  );
};

export default BasicButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  // Variants
  primary: {
    backgroundColor: primaryColors.fifty,
  },
  secondary: {
    backgroundColor: primaryColors.thirty,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: primaryColors.fifty,
  },

  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    ...typography.headline20Bold,
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#fff",
  },
  outlineText: {
    color: primaryColors.fifty,
  },

  // Text sizes
  smallText: {
    ...typography.body16SemiBold,
  },
  mediumText: {
    ...typography.headline20Bold,
  },
  largeText: {
    ...typography.title24Bold,
  },
});
