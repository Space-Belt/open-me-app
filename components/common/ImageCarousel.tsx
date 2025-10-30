import { SCREEN_WIDTH } from "@/utils/public";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import CancelIcon from "@/assets/images/icons/close_icon.svg";
import PhotoIcon from "@/assets/images/icons/photo_icon.svg";
import ImageCarouselIndicator from "./ImageCarouselIndicator";

interface ImageCarouselProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  ref: React.RefObject<any>;
  onAddImage?: () => void;
  onRemoveImage?: (index: number) => void;
}

const IMAGE_WIDTH = SCREEN_WIDTH - 32; // 또는 props로 전달 가능

const ImageCarousel = ({
  images,
  currentIndex,
  setCurrentIndex,
  ref,
  onAddImage,
  onRemoveImage,
}: ImageCarouselProps) => {
  return (
    <View style={styles.wrapper}>
      {images.length === 0 ? (
        <Pressable style={styles.empty} onPress={onAddImage}>
          <PhotoIcon width={80} height={80} />
          <Text style={styles.emptyText}>터치하여 사진을 선택해주세요</Text>
        </Pressable>
      ) : (
        <>
          <Carousel
            loop={false}
            width={IMAGE_WIDTH}
            height={IMAGE_WIDTH}
            data={images}
            onSnapToItem={setCurrentIndex}
            renderItem={({ item, index }) => (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item }} style={styles.image} />
                {onRemoveImage && (
                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => onRemoveImage(index)}
                  >
                    <CancelIcon width={35} height={35} />
                  </Pressable>
                )}
              </View>
            )}
            ref={ref}
          />
          <ImageCarouselIndicator images={images} currentIndex={currentIndex} />
        </>
      )}
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  empty: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    backgroundColor: "#444",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 8,
    color: "#ccc",
  },
  imageWrapper: {
    position: "relative",
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    borderRadius: 8,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    borderRadius: 8,
  },
  deleteBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    paddingHorizontal: 5,
    borderRadius: 12,
  },
  indicator: {
    marginTop: 8,
  },
});
