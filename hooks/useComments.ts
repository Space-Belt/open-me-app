import {
  createComment,
  deleteComment,
  fetchComments,
  updateComment,
} from "@/api/commentController";
import { ICreateCommentInput } from "@/types/comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// postId별 댓글 관리
export function useComments(postId: string, callBack: () => void) {
  const queryClient = useQueryClient();

  const [commentValue, setCommentValue] = useState<string>("");

  // 대댓글, 수정 할 대상 상태값
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToNick, setReplyingToNick] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  // 댓글 목록 불러오기
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });

  // 댓글 작성
  const addComment = useMutation({
    mutationFn: (input: ICreateCommentInput) => {
      if (editingCommentId) {
        return updateComment(postId, editingCommentId, input.content);
      } else {
        return createComment(input);
      }
    },
    onSuccess: () => {
      setReplyingTo(null);
      setReplyingToNick(null);
      setCommentValue("");
      setEditingCommentId(null);
      // 정보 갱신
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: callBack,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: callBack,
  });

  return {
    replyingTo,
    setReplyingTo,
    replyingToNick,
    setReplyingToNick,
    commentValue,
    setCommentValue,
    editingCommentId,
    setEditingCommentId,
    comments,
    isLoading,
    addComment,
    deleteCommentMutation,
  };
}
