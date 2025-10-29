import { useAuth } from "@/hooks/useAuth";
import { useComments } from "@/hooks/useComments";
import { IGetCommentData } from "@/types/comment";
import { showOneButtonModal } from "@/utils/modal";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import CommentItem from "./CommentItem";

type Props = {
  postId: string;
  handleReplyPress: (commnetId: string, nickname: string) => void;
  handleEdit: (comment: IGetCommentData) => void;
};

const CommentList = ({ postId, handleReplyPress, handleEdit }: Props) => {
  const { auth } = useAuth();
  const handleCommentError = () => {
    showOneButtonModal("오류", "댓글 작업 중\n오류가 발생했습니다.", () => {});
  };
  const { comments, isLoading, addComment, deleteCommentMutation } =
    useComments(postId, handleCommentError);

  const handleDelete = async (comment: IGetCommentData) => {
    // 삭제 전 확인 모달 띄우기 등
    deleteCommentMutation.mutate(comment.id);
  };

  const parentComments = comments?.filter((c) => c.parentId === null) || [];
  // 2. 대댓글 필터 함수
  const getReplies = (parentId: string) =>
    comments?.filter((c) => c.parentId === parentId) || [];

  useEffect(() => {
    if (postId) {
    }
  }, [postId]);
  console.log(JSON.stringify(auth, null, 2));

  return (
    <View style={styles.container}>
      {parentComments.map((comment) => (
        <View key={comment.id}>
          {/* 부모 댓글 */}
          <CommentItem
            isReply={false}
            handleReplyPress={handleReplyPress}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            myId={auth?.uid}
            data={comment}
          />
          {/* 대댓글 */}
          {getReplies(comment.id).map((reply) => (
            <View
              key={reply.id}
              style={{ marginLeft: 38, marginTop: 8 }} // 들여쓰기
            >
              <CommentItem
                isReply={true}
                handleReplyPress={handleReplyPress}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                myId={auth?.uid}
                data={reply}
              />
            </View>
          ))}
        </View>
      ))}
      {/* {parentComments?.map((comment, index) => {
        return (
          <CommentItem
            handleReplyPress={handleReplyPress}
            myId={auth?.uid}
            data={comment}
            key={comment.id}
          />
          
        );
      })} */}
    </View>
  );
};

export default CommentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
