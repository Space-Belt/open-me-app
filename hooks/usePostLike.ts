import { checkPostLiked, likePost, unlikePost } from "@/api/likeController";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/********** 좋아요 훅 **********/
const usePostLike = (postId?: string, userId?: string) => {
  const queryClient = useQueryClient();

  const { data: likedByMe, refetch: refetchLike } = useQuery({
    queryKey: userId && postId ? ["postLike", postId, userId] : [],
    queryFn: () => checkPostLiked(postId!, userId!),
    enabled: !!userId && !!postId,
  });

  const likeMutation = useMutation({
    mutationFn: () => {
      if (!userId || !postId) {
        return Promise.reject("유저 아이디 또는 게시글 아이디 없음");
      }
      return likedByMe ? unlikePost(postId, userId) : likePost(postId, userId);
    },
    onSuccess: () => {
      if (postId && userId) {
        queryClient.invalidateQueries({ queryKey: ["post", postId] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["myposts", userId] });
        queryClient.invalidateQueries({
          queryKey: ["postLike", postId, userId],
        });
      }
    },
  });

  return {
    likedByMe: !!likedByMe,
    toggleLike: likeMutation.mutate,
    refetchLike,
  };
};

export default usePostLike;
