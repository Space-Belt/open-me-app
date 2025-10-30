import { primaryColors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  currentIndex: number;
  images: string[];
};

const ImageCarouselIndicator = ({ currentIndex, images }: Props) => {
  return (
    <View style={styles.indicatorWrapper}>
      {images.map((_, i) => (
        <View
          key={i}
          style={[
            styles.indicatorCircle,
            i === currentIndex
              ? styles.indicatorActive
              : styles.indicatorInactive,
          ]}
        />
      ))}
    </View>
  );
};

export default ImageCarouselIndicator;

const styles = StyleSheet.create({
  indicatorWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  indicatorCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: primaryColors.eighty,
  },
  indicatorInactive: {
    backgroundColor: "#ccc",
  },
});
