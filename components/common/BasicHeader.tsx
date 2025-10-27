import BackIcon from "@/assets/images/icons/arrow_back.svg";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface BasicHeaderProps {
  title?: string;
  left?: React.ReactNode;
  onLeftPress?: () => void;
  center?: React.ReactNode;
  right?: React.ReactNode;
  onRightPress?: () => void;
  style?: object;
}

const BasicHeader = ({
  title,
  left,
  onLeftPress,
  center,
  right,
  onRightPress,
  style,
}: BasicHeaderProps) => {
  const router = useRouter();

  const handleDefaultBack = () => {
    if (onLeftPress) return onLeftPress();
    router.back();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        {left !== undefined ? (
          <Pressable onPress={onLeftPress ?? handleDefaultBack}>
            {left}
          </Pressable>
        ) : (
          <Pressable onPress={handleDefaultBack}>
            <BackIcon />
          </Pressable>
        )}
      </View>
      <View style={styles.center}>
        {center !== undefined ? (
          center
        ) : title ? (
          <Text style={styles.title}>{title}</Text>
        ) : null}
      </View>
      <View style={styles.right}>
        {right && <Pressable onPress={onRightPress}>{right}</Pressable>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  left: { flex: 1, alignItems: "flex-start" },
  center: { flex: 2, alignItems: "center", justifyContent: "center" },
  right: { flex: 1, alignItems: "flex-end" },
  title: { fontWeight: "bold", fontSize: 18 },
});

export default BasicHeader;
