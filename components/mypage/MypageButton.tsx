import ChevronIcon from "@/assets/images/icons/chevron_right.svg";
import { typography } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import BasicText from "../common/BasicText";

type Props = {
  title: string;
  onPress: () => void;
  borderPosition?: "top" | "bottom";
};

const MypageButton = ({ title, onPress, borderPosition }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          borderBottomWidth: borderPosition === "bottom" ? 1 : 0,
          borderTopWidth: borderPosition === "top" ? 1 : 0,
        },
      ]}
    >
      <BasicText style={styles.btnText}>{title}</BasicText>
      <ChevronIcon />
    </Pressable>
  );
};

export default MypageButton;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#e7e7e7",
  },
  btnText: {
    ...typography.body16Medium,
    color: "#8c8c8c",
  },
});
