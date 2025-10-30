import { uploadPostImages } from "@/api/imageController";
import {
  createPost,
  deletePostWithComments,
  updatePost,
} from "@/api/postController";
import { IGetPostedData } from "@/types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const usePostMutation = (
  successCallBack: (isSuccess: boolean) => void,
  post?: IGetPostedData,
  uid?: string,
  displayName?: string,
  photoURL?: string
) => {
  const queryClient = useQueryClient();
  const createPostUpdatemutation = useMutation({
    mutationFn: async ({
      title,
      content,
      images,
      postId,
    }: {
      title: string;
      content: string;
      images: string[];
      postId?: string;
    }) => {
      const imageUrls =
        images.length > 0 ? await uploadPostImages(images, uid!) : [];

      // 수정(이미 존재 post.id 있음) / 등록 분기
      if (post && postId) {
        const updatedPostId = await updatePost(postId, {
          title,
          content,
          imageUrls,
        });
        return updatedPostId;
      } else {
        const postId = await createPost({
          title,
          content,
          images: imageUrls,
          uid: uid!,
          displayName: displayName || "",
          photoURL,
        });

        return postId;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      successCallBack(true);
    },
    onError: (error) => {
      successCallBack(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postIdToDelete: string) => {
      await deletePostWithComments(postIdToDelete);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      successCallBack(true);
    },
    onError: () => {
      successCallBack(false);
    },
  });
  return { createPostUpdatemutation, deleteMutation };
};

export default usePostMutation;
