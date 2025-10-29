import { fetchPostById } from "@/api/postController";
import CommentArea from "@/components/comments/CommentArea";
import BasicContainer from "@/components/common/BasicContainer";
import BasicHeader from "@/components/common/BasicHeader";
import BasicInput from "@/components/common/BasicInput";
import BasicText from "@/components/common/BasicText";
import PhotoModal from "@/components/common/PhotoModal";
import PostDetailScreen from "@/components/screens/PostDetailScreen";
import { blackColors, primaryColors, typography } from "@/constants/theme";
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
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CloseIcon from "@/assets/images/icons/close_icon.svg";
import { IGetCommentData } from "@/types/comment";

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
    replyingTo,
    setReplyingTo,
    replyingToNick,
    setReplyingToNick,
    commentValue,
    setCommentValue,
    addComment,
    isLoading: commentLoading,
    editingCommentId,
    setEditingCommentId,
    deleteCommentMutation,
  } = useComments(postId, commentErrorHandler);

  const handleEdit = (comment: IGetCommentData) => {
    setEditingCommentId(comment.id);
    setCommentValue(comment.content);
    setReplyingTo(null);
    setReplyingToNick(null);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setCommentValue("");
  };

  // 댓글 답글 버튼을 클릭
  const handleReplyPress = (commentId: string, nickname: string) => {
    setReplyingTo(commentId);
    setReplyingToNick(nickname);
  };

  const handlePhotoModal = () => {
    setShowPhotoModal((prev) => !prev);
  };

  const handleRegistComment = async () => {
    if (commentValue === "" || commentValue.length < 3) return;
    if (auth && auth.uid && auth.displayName) {
      if (replyingTo && replyingToNick) {
        addComment.mutate({
          postId,
          content: commentValue,
          authorUid: auth?.uid,
          authorNickname: auth?.displayName,
          authorPhotoURL: auth?.photoURL,
          parentId: replyingTo,
        });
      } else {
        addComment.mutate({
          postId,
          content: commentValue,
          authorUid: auth?.uid,
          authorNickname: auth?.displayName,
          authorPhotoURL: auth?.photoURL,
        });
      }
    } else {
      return;
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
                isMyPost={post?.uid === auth?.uid}
              />
              <View style={styles.divideLine} />
              <CommentArea
                handleReplyPress={handleReplyPress}
                handleEdit={handleEdit}
                postId={postId}
                commentCount={post?.commentCount}
              />
            </BasicContainer>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.commentInputBar,
            { paddingBottom: bottomInput ? 10 : insets.bottom },
          ]}
        >
          {replyingTo && replyingToNick && (
            <View style={styles.commentToStyle}>
              <BasicText style={styles.commentToText}>
                To {replyingToNick}
              </BasicText>

              <Pressable
                style={styles.commentToClose}
                onPress={() => {
                  setReplyingTo(null);
                  setReplyingToNick(null);
                }}
              >
                <CloseIcon width={25} height={25} />
              </Pressable>
            </View>
          )}
          {editingCommentId && (
            <View style={styles.commentToStyle}>
              <BasicText style={styles.commentToText}>수정중입니다.</BasicText>

              <Pressable style={styles.commentToClose} onPress={cancelEdit}>
                <CloseIcon width={25} height={25} />
              </Pressable>
            </View>
          )}

          {/* TextInput, 등록 버튼 등 */}
          <BasicInput
            onFocus={() => setBottomInput(true)}
            onBlur={() => setBottomInput(false)}
            buttonTitle={"등록"}
            onButtonPress={handleRegistComment}
            value={commentValue}
            onChangeText={setCommentValue}
            containerStyle={styles.inputContainer}
            placeholder="댓글을 입력해주세요"
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
    width: "100%",
    marginBottom: 0,
  },
  commentToStyle: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primaryColors.sixty,
    borderRadius: 10,
    left: 16,
    top: -50,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  commentToText: {
    ...typography.caption12SemiBold,
    color: "#fff",
  },
  commentToClose: {
    position: "absolute",
    right: -35,
    justifyContent: "center",
    alignItems: "center",
  },
  divideLine: {
    width: "100%",
    height: 6,
    backgroundColor: blackColors.twenty,
    marginBottom: 25,
  },
});
