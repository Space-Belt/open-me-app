import { IGetPostedData } from "@/types/post";
import { isIOS, SCREEN_WIDTH } from "@/utils/public";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BasicContainer from "../common/BasicContainer";
import BasicHeader from "../common/BasicHeader";

import { blackColors, primaryColors, typography } from "@/constants/theme";
import { useImagePicker } from "@/hooks/useImagePicker";
import BasicInput from "../common/BasicInput";
import BasicText from "../common/BasicText";

import PhotoIcon from "@/assets/images/icons/photo_icon.svg";

import { useAuth } from "@/hooks/useAuth";
import usePostMutation from "@/hooks/usePostMutation";
import { handleAuthInput } from "@/utils/auth";
import { showOneButtonModal, showTwoButtonModal } from "@/utils/modal";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import BasicButton from "../common/BasicButton";
import BasicIndicator from "../common/BasicIndicator";
import ImageCarousel from "../common/ImageCarousel";
import PhotoModal from "../common/PhotoModal";
import PostDetailScreen from "./PostDetailScreen";

interface IPostEditScreenProps {
  post?: IGetPostedData;
  postId?: string;
}

const MAX_IMAGES = 3;
const PADDING_HORIZONTAL = 32;
const IMAGE_WIDTH = SCREEN_WIDTH - PADDING_HORIZONTAL;

const INFORMATION =
  "- 위를 클릭하셔서 사진을 선택할 수 있습니다.\n- 사진은 최대 3장까지 등록가능합니다.";

const PostEditScreen = (props: IPostEditScreenProps) => {
  // 미리보기, 사진 크게 보기
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  // 등록될 내용 상태들
  const [title, setTitle] = useState<string>(props?.post?.title ?? "");
  const [titleError, setTitleError] = useState<string>();
  const [content, setContent] = useState<string>(props?.post?.content ?? "");
  const { images, setImages, pickImages, takePhoto } =
    useImagePicker(MAX_IMAGES);

  // 캐러셀 관리
  const carouselRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { auth } = useAuth();
  // 등록 클릭, 등록 뮤테이션, 등록 이후 콜백
  const successCallback = (isSuccess: boolean) => {
    showOneButtonModal(
      props?.postId ? "수정결과" : "등록결과",
      isSuccess
        ? "등록 성공했습니다!\n홈, 내가 등록한글에서 확인 가능합니다."
        : "등록 실패했습니다..\n다시 시도해주세요",
      isSuccess
        ? () => {
            queryClient.invalidateQueries({ queryKey: ["myposts", auth?.uid] });
            queryClient.invalidateQueries({ queryKey: ["myStats", auth?.uid] });
            router.replace("/(tabs)");
          }
        : () => {}
    );
  };
  const { createPostUpdatemutation } = usePostMutation(
    successCallback,
    props?.post,
    auth?.uid,
    auth?.displayName ?? "",
    auth?.photoURL ?? ""
  );

  // 유효성검사, 등로하기
  const validatePost = () => {
    let isValid = true;
    let titleErr = "";
    if (title.length < 2 || title.length > 15) {
      titleErr = "2~15 자로 입력해주세요";
      isValid = false;
    }
    setTitleError(titleErr);
    return isValid;
  };
  const handlePost = () => {
    if (!validatePost()) {
      showOneButtonModal(
        "입력 제한 예외",
        "제목: 2~15자, 내용: 10~1000자\n확인해주세요",
        () => {}
      );
      return;
    } else {
      createPostUpdatemutation.mutate({
        title,
        content,
        images,
        postId: props?.postId || undefined,
      });
    }
  };

  /// 사진 추가 및 삭제
  const handleAddImage = () => {
    if (images.length === MAX_IMAGES) {
      showOneButtonModal(
        "사진 제한",
        "사진은 3장까지만 등록가능합니다.\nX버튼으로 삭제 후 다시 추가해주세요",
        () => {}
      );
    } else {
      showTwoButtonModal(
        "사진 추가하기",
        "사진첩 / 직접촬영\n선택하여 추가해주세요.",
        [
          {
            label: "사진첩",
            variant: "outline",
            onPress: pickImages,
          },
          {
            label: "직접촬영",
            variant: "primary",
            onPress: takePhoto,
          },
        ]
      );
    }
  };

  // 사진 삭제
  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);

      setCurrentIndex((prevIndex) => {
        let newIndex = prevIndex;
        if (prevIndex >= index) newIndex = prevIndex - 1;
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= newImages.length) newIndex = newImages.length - 1;

        if (carouselRef.current && newIndex >= 0) {
          carouselRef.current.scrollTo({ index: newIndex, animated: true });
        }
        return newIndex;
      });

      return newImages;
    });
  };

  // 미리보기, 사진보기
  const handleShowPreview = () => setShowPreview((prev) => !prev);
  const handlePhotoModal = () => setShowPhotoModal((prev) => !prev);

  // 뒤로 가기 버튼 커스텀
  const handleBackBtn = () => {
    if (showPreview) {
      setShowPreview(false);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    if (props?.post?.imageUrls?.length) {
      setImages([...props.post.imageUrls]);
    }
  }, [props?.post?.imageUrls]);

  if (createPostUpdatemutation.isPending) {
    return <BasicIndicator text="등록중이에요" />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIOS ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <BasicContainer>
            <BasicHeader
              onLeftPress={handleBackBtn}
              title={
                !showPreview ? " (: 나를 열어보세요 :) " : "오늘의 이야기 OPEN"
              }
              onRightPress={handleShowPreview}
              right={
                <Text style={styles.lookAroundText}>
                  {showPreview ? "취소" : "미리보기"}
                </Text>
              }
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollStyle}
            >
              {/* 캐러셀 영역 */}
              {!showPreview ? (
                <>
                  <BasicText style={[styles.label]}>사진</BasicText>
                  <View style={styles.carouselWrapper}>
                    {images.length === 0 ? (
                      <Pressable
                        style={styles.emptyCarousel}
                        onPress={!showPreview ? handleAddImage : () => {}}
                      >
                        <PhotoIcon width={80} height={80} />
                        <Text style={styles.emptyText}>
                          터치하여 사진을 선택해주세요
                        </Text>
                      </Pressable>
                    ) : (
                      <>
                        <ImageCarousel
                          ref={carouselRef}
                          currentIndex={currentIndex}
                          setCurrentIndex={setCurrentIndex}
                          images={images}
                          onAddImage={handleAddImage}
                          onRemoveImage={handleRemoveImage}
                        />
                      </>
                    )}

                    <Text style={styles.informationText}>{INFORMATION}</Text>
                  </View>

                  <BasicInput
                    label="제목(주제)"
                    placeholder="2 ~ 15자의 제목입력"
                    required={true}
                    value={title}
                    onChangeText={(text: string) =>
                      handleAuthInput(text, setTitle, setTitleError)
                    }
                    maxLength={15}
                    errorMessage={titleError}
                  />
                  <BasicText style={[styles.label]}>
                    내용
                    <BasicText style={styles.requiredStyle}>*</BasicText>
                  </BasicText>
                  <View>
                    <TextInput
                      style={styles.input}
                      multiline
                      value={content}
                      onChangeText={setContent}
                      numberOfLines={30}
                      placeholder="10 ~ 1000자의 내용입력"
                      maxLength={1000}
                    />
                    <Text
                      style={[
                        styles.contentLength,
                        {
                          color:
                            content.length > 1000 ? "red" : blackColors.seventy,
                        },
                      ]}
                    >
                      {content.length} / 1000
                    </Text>
                  </View>
                </>
              ) : (
                <PostDetailScreen
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  myInfo={auth}
                  title={title}
                  content={content}
                  imageUrls={images}
                  isPreview={true}
                  isMyPost={true}
                  setShowPhoto={setShowPhotoModal}
                />
              )}
              <BasicButton
                title={props.post ? "수정하기" : "등록하기"}
                onPress={handlePost}
                style={styles.confirmBtn}
              />
            </ScrollView>
          </BasicContainer>
        </TouchableWithoutFeedback>
        {showPhotoModal && (
          <PhotoModal
            imageUrls={images}
            handleClose={handlePhotoModal}
            initialIndex={currentIndex}
          />
        )}
      </>
    </KeyboardAvoidingView>
  );
};

export default PostEditScreen;

const styles = StyleSheet.create({
  scrollStyle: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  lookAroundBtn: {},
  lookAroundText: {
    ...typography.body14SemiBold,
    color: primaryColors.sixty,
  },
  label: {
    ...typography.body16SemiBold,
    color: "#333",
    marginBottom: 8,
  },
  requiredStyle: {
    ...typography.body16SemiBold,
    color: primaryColors.sixty,
  },
  input: {
    height: 350,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    ...typography.body14Regular,
    backgroundColor: "#fff",
  },

  carouselWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  emptyCarousel: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    backgroundColor: blackColors.forty,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 8,
    ...typography.headline18Bold,
    color: "#bcbcbc",
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
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
    zIndex: 100,
  },
  deleteBtnText: {
    fontWeight: "bold",
    color: "#e33",
  },
  addBtn: {
    marginTop: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 6,
  },
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
  informationText: {
    ...typography.caption12Regular,
    color: blackColors.forty,
    width: "100%",
    textAlign: "left",
    marginTop: 4,
  },
  contentLength: {
    ...typography.caption12SemiBold,
    position: "absolute",
    right: 0,
    bottom: -20,
  },
  confirmBtn: {
    marginTop: 50,
  },
});
