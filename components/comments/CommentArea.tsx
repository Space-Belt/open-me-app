import { typography } from "@/constants/theme";
import { IGetCommentData } from "@/types/comment";
import React from "react";
import { StyleSheet, View } from "react-native";
import BasicText from "../common/BasicText";
import CommentList from "./CommentList";

type Props = {
  commentCount: number;
  postId: string;
  handleReplyPress: (commnetId: string, nickname: string) => void;
  handleEdit: (comment: IGetCommentData) => void;
};

const CommentArea = ({
  commentCount,
  postId,
  handleReplyPress,
  handleEdit,
}: Props) => {
  return (
    <View style={styles.container}>
      <BasicText style={styles.commentTitle}>댓글 ({commentCount})개</BasicText>
      <CommentList
        handleEdit={handleEdit}
        postId={postId}
        handleReplyPress={handleReplyPress}
      />
    </View>
  );
};

export default CommentArea;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentTitle: {
    ...typography.body16SemiBold,
    marginBottom: 15,
  },
});
