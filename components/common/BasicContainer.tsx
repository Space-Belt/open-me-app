// components/common/ScreenContainer.tsx
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: React.ReactNode;
  edges?: ("top" | "bottom" | "left" | "right")[];
  style?: ViewStyle;
}

const BasicContainer = ({
  children,
  edges = ["top", "bottom", "left", "right"],
  style,
}: ScreenContainerProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: edges.includes("top") ? insets.top : 0,
          paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default BasicContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
