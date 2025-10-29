import { fetchPostById } from "@/api/postController";
import CommentArea from "@/components/comments/CommentArea";
import BasicContainer from "@/components/common/BasicContainer";
import BasicHeader from "@/components/common/BasicHeader";
import BasicInput from "@/components/common/BasicInput";
import PhotoModal from "@/components/common/PhotoModal";
import PostDetailScreen from "@/components/screens/PostDetailScreen";
import { blackColors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useComments } from "@/hooks/useComments";
import { showOneButtonModal } from "@/utils/modal";
import { isIOS, SCREEN_WIDTH } from "@/utils/public";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PostDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const postId = id as string;

  const { auth } = useAuth();

  const [bottomInput, setBottomInput] = useState<boolean>(false);

  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  });

  const commentErrorHandler = () => {
    showOneButtonModal("오류", "댓글작업 중\n오류가 발생했습니다.", () => {});
    setCommentValue("");
  };
  const {
    commentValue,
    setCommentValue,
    addComment,
    isLoading: commentLoading,
  } = useComments(postId, commentErrorHandler);

  const handlePhotoModal = () => {
    setShowPhotoModal((prev) => !prev);
  };

  const handleRegistComment = async () => {
    if (commentValue === "" || commentValue.length < 3) return;
    if (auth && auth.uid && auth.displayName) {
      addComment.mutate({
        postId,
        content: commentValue,
        authorUid: auth?.uid,
        authorNickname: auth?.displayName,
        authorPhotoURL: auth?.photoURL,
      });
    } else {
    }
  };

  /** 본인꺼 삭제 수정 가능해야합니디 !!!!! */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIOS ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <BasicHeader style={styles.headerStyle} title={"오늘의 이야기"} />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentContainerStyle={styles.scrollStyle}>
            <BasicContainer edges={[]} style={styles.container}>
              <PostDetailScreen
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                content={post?.content}
                title={post?.title}
                imageUrls={post?.imageUrls}
                isPreview={false}
                myInfo={null}
                contentOwner={post?.displayName}
                contentOwnerPhotoURL={post?.photoURL}
                setShowPhoto={setShowPhotoModal}
              />
              <View style={styles.divideLine} />
              <CommentArea postId={postId} commentCount={post?.commentCount} />
            </BasicContainer>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.commentInputBar,
            { paddingBottom: bottomInput ? 10 : insets.bottom },
          ]}
        >
          {/* TextInput, 등록 버튼 등 */}
          <BasicInput
            onFocus={() => setBottomInput(true)}
            onBlur={() => setBottomInput(false)}
            buttonTitle={"등록"}
            onButtonPress={handleRegistComment}
            value={commentValue}
            onChangeText={setCommentValue}
            containerStyle={styles.inputContainer}
          />
        </View>
        {showPhotoModal && (
          <PhotoModal
            imageUrls={post?.imageUrls}
            handleClose={handlePhotoModal}
            initialIndex={currentIndex}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  headerStyle: {
    paddingHorizontal: 16,
  },
  scrollStyle: {
    flexGrow: 1,
    paddingBottom: 80,
  },

  commentInputBar: {
    width: SCREEN_WIDTH,
    bottom: 0,
    left: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  inputContainer: {
    width: "100%", // 추가: 컨테이너를 전체 너비로
    marginBottom: 0, // 추가: 기본 marginBottom 제거
  },
  divideLine: {
    width: "100%",
    height: 6,
    backgroundColor: blackColors.twenty,
    marginBottom: 25,
  },
});
