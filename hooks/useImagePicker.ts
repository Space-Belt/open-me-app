import { showTwoButtonModal } from "@/utils/modal";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Linking } from "react-native";

export const useImagePicker = (imageCount = 3) => {
  const [images, setImages] = useState<string[]>([]);

  const checkPermission = async (
    type: "gallery" | "camera"
  ): Promise<boolean> => {
    const req =
      type === "gallery"
        ? await ImagePicker.requestMediaLibraryPermissionsAsync()
        : await ImagePicker.requestCameraPermissionsAsync();

    if (req.status === "granted") return true;

    if (req.status === "denied" && !req.canAskAgain) {
      showTwoButtonModal(
        "권한 필요",
        `${
          type === "gallery" ? "사진첩" : "카메라"
        } 접근 권한이 필요합니다.\n설정에서 허용해주세요.`,
        [
          { label: "취소", variant: "outline", onPress: () => {} },
          {
            label: "설정이동",
            variant: "primary",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
    return false;
  };

  // 사진첩 멀티 선택, 선택한 사진 URI 배열 상태에 추가
  const pickImages = async (): Promise<void> => {
    const ok = await checkPermission("gallery");
    if (!ok) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: imageCount - images.length,
      quality: 1,
    });
    if (result.canceled) return;
    setImages((prev) =>
      [...prev, ...result.assets.map((a) => a.uri)].slice(0, imageCount)
    );
  };

  // 카메라 촬영 후 사진 URI 상태에 추가
  const takePhoto = async (): Promise<void> => {
    const ok = await checkPermission("camera");
    if (!ok) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      setImages((prev) => [...prev, result.assets[0].uri].slice(0, imageCount));
    }
  };

  // 사진 삭제 (인덱스 기준)
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    images,
    setImages,
    pickImages,
    takePhoto,
    removeImage,
    checkPermission,
  };
};
