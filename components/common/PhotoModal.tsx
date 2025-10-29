import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/public";
import React from "react";
import { StyleSheet, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BasicContainer from "./BasicContainer";
import BasicHeader from "./BasicHeader";

type Props = {
  handleClose: () => void;
  imageUrls: string[];
  initialIndex: number;
};

const PhotoModal = ({ handleClose, imageUrls, initialIndex }: Props) => {
  const insets = useSafeAreaInsets();
  const headerHeight = 48; // 헤더 고정 높이
  const adjustedHeight =
    SCREEN_HEIGHT - headerHeight - insets.top - insets.bottom;
  return (
    <BasicContainer style={styles.container} edges={["top"]}>
      <BasicHeader
        style={{ paddingHorizontal: 16 }}
        title="사진"
        onLeftPress={handleClose}
      />
      <View style={styles.carouselWrapper}>
        <Carousel
          loop={false}
          width={SCREEN_WIDTH}
          height={adjustedHeight} // 헤더 제외 높이 조정
          data={imageUrls}
          renderItem={({ item, index }) => (
            <ImageViewer
              key={index}
              imageUrls={[{ url: item }]}
              enableSwipeDown={true}
              onSwipeDown={handleClose}
              backgroundColor="black"
              style={styles.imageViewer}
              renderIndicator={() => <></>}
              saveToLocalByLongPress={false}
            />
          )}
        />
      </View>
    </BasicContainer>
  );
};

export default PhotoModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    paddingHorizontal: 0,
    top: 0,
    zIndex: 100,
    backgroundColor: "#f2f2f2",
  },
  carouselWrapper: {},
  imageViewer: {
    width: SCREEN_WIDTH,
  },
});
