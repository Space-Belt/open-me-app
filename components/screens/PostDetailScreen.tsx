import { blackColors, primaryColors, typography } from "@/constants/theme";
import { ISecureStoreAuthData } from "@/types/auth";
import { SCREEN_WIDTH } from "@/utils/public";
import dayjs from "dayjs";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

import EmptyHeart from "@/assets/images/icons/empty_heart.svg";
import HeartIcon from "@/assets/images/icons/heart_icon.svg";

import UserIcon from "@/assets/images/icons/user_icon.svg";

import usePostLike from "@/hooks/usePostLike";
import usePostMutation from "@/hooks/usePostMutation";
import { showOneButtonModal, showTwoButtonModal } from "@/utils/modal";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import BasicText from "../common/BasicText";

type Props = {
  myInfo: ISecureStoreAuthData | null;
  title: string;
  content: string;
  imageUrls: string[];
  isPreview: boolean;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isMyPost: boolean;
  postId?: string;
  setShowPhoto?: React.Dispatch<React.SetStateAction<boolean>>;
  contentOwner?: string;
  contentOwnerPhotoURL?: string;
};

const IMAGE_WIDTH = SCREEN_WIDTH - 32;

const DUMMY_TEXT =
  "내용을 입력하지 않으셨습니다.\n오늘 하루 고생많으셨습니다.\n하고 싶은 말이나, 속에 숨겨왔던 이야기를 \n마음껏 이야기하고, 사람들과 댓글로 소통해보세요!!\n항상 행복하고 좋은 일만 가득하세요 모두~";

const PostDetailScreen = ({
  myInfo,
  title,
  content,
  imageUrls,
  isPreview,
  currentIndex,
  setCurrentIndex,
  isMyPost,
  postId,
  setShowPhoto,
  contentOwner,
  contentOwnerPhotoURL,
}: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const successCallback = () => {
    queryClient.invalidateQueries({ queryKey: ["myposts", myInfo?.uid] });
    showOneButtonModal("삭제", "삭제 성공!", () => {
      router.replace("/(tabs)");
    });
  };

  const { deleteMutation } = usePostMutation(successCallback);

  const { likedByMe, toggleLike } = usePostLike(postId, myInfo?.uid);

  const handleShowPhotoModal = () => {
    if (setShowPhoto) {
      setShowPhoto((prev) => !prev);
    }
  };

  const handleLikePost = () => {
    if (isPreview) return;
    if (myInfo?.uid) {
      toggleLike();
    } else {
      showTwoButtonModal(
        "로그인필요",
        "로그인이 필요해요\n로그인 하시겠어요??",
        [
          {
            label: "나중에",
            variant: "outline",
            onPress: () => {},
          },
          {
            label: "로그인",
            variant: "primary",
            onPress: () => {
              router.navigate("/(auth)/signin");
            },
          },
        ]
      );
    }
  };

  const handleDeletePost = () => {
    showTwoButtonModal("삭제", "정말로 삭제하시겠어요?", [
      {
        label: "나중에",
        variant: "outline",
        onPress: () => {},
      },
      {
        label: "삭제",
        variant: "primary",
        onPress: () => {
          if (postId) {
            deleteMutation.mutate(postId);
          }
        },
      },
    ]);
  };

  const handleEditPost = () => {
    router.push(`/post/${postId}/edit`);
  };

  return (
    <>
      <View style={[!isPreview && styles.preview]}>
        <View
          style={[
            styles.carouselWrapper,
            imageUrls && imageUrls.length > 0 && { marginBottom: 10 },
          ]}
        >
          {imageUrls && imageUrls.length > 0 && (
            <>
              <Carousel
                loop={false}
                width={IMAGE_WIDTH}
                height={IMAGE_WIDTH}
                data={imageUrls}
                onSnapToItem={(index) => setCurrentIndex(index)}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={handleShowPhotoModal}
                    style={styles.imageContainer}
                  >
                    <Image source={{ uri: item }} style={styles.image} />
                  </Pressable>
                )}
              />
              <View style={styles.indicatorWrapper}>
                {imageUrls.map((_, i) => (
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
              <Text style={styles.informationText}>
                - 사진 클릭 시 원본 확인 가능합니다
              </Text>
            </>
          )}
        </View>
        <View>
          <View style={styles.titleSection}>
            <BasicText style={styles.titleStyle}>
              {title ? title : "제목을 입력하지 않았습니다"}
            </BasicText>
            <View style={styles.profileSection}>
              <View>
                <BasicText style={styles.nicknameStyle}>
                  {myInfo?.displayName ? myInfo.displayName : contentOwner} 님
                </BasicText>
                <BasicText style={styles.dateStyle}>
                  {dayjs().format("YY/MM/DD")}
                </BasicText>
              </View>
              {contentOwnerPhotoURL || myInfo?.photoURL ? (
                <Image
                  resizeMode="cover"
                  source={{ uri: myInfo?.photoURL || contentOwnerPhotoURL }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImage}>
                  <UserIcon width={9} height={9} />
                </View>
              )}
            </View>
          </View>
          <View>
            <BasicText style={styles.contentStyle}>
              {content ? content : DUMMY_TEXT}
            </BasicText>
            <View style={styles.likeEditDeleteContainer}>
              <TouchableOpacity
                hitSlop={5}
                onPress={handleLikePost}
                style={styles.likeBtn}
              >
                {likedByMe ? (
                  <HeartIcon width={15} height={15} />
                ) : (
                  <EmptyHeart width={15} height={15} />
                )}
                <BasicText style={styles.likeText}>좋아요</BasicText>
              </TouchableOpacity>
              {isMyPost && !isPreview && (
                <View style={styles.editDeleteContainer}>
                  <Pressable hitSlop={5} onPress={handleEditPost}>
                    <BasicText style={styles.smallBtn}>수정</BasicText>
                  </Pressable>
                  <Pressable hitSlop={5} onPress={handleDeletePost}>
                    <BasicText style={styles.smallBtn}>삭제</BasicText>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  preview: {
    paddingHorizontal: 16,
  },
  carouselWrapper: {
    alignItems: "center",
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
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColors.twenty,
  },
  nicknameStyle: {
    ...typography.caption12SemiBold,
    color: primaryColors.eighty,
  },
  titleStyle: {
    ...typography.body16SemiBold,
  },
  dateStyle: {
    ...typography.caption12Medium,
    color: blackColors.forty,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contentStyle: {
    ...typography.body14SemiBold,
    lineHeight: 25,
    paddingVertical: 14,
    color: blackColors.seventy,
    minHeight: 150,
  },

  likeEditDeleteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  likeText: {
    ...typography.body14SemiBold,
    color: "#9c9c9c",
  },
  editDeleteContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 20,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  smallBtn: {
    ...typography.caption12SemiBold,
    color: blackColors.eighty,
    textDecorationLine: "underline",
  },
});
