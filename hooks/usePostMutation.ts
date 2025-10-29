import { uploadPostImages } from "@/api/imageController";
import { createPost } from "@/api/postController";
import { IPost } from "@/types/post";
import { useMutation } from "@tanstack/react-query";

const usePostMutation = (
  successCallBack: (isSuccess: boolean) => void,
  post?: IPost,
  uid?: string,
  displayName?: string,
  photoURL?: string
) => {
  const mutation = useMutation({
    mutationFn: async ({
      title,
      content,
      images,
    }: {
      title: string;
      content: string;
      images: string[];
    }) => {
      console.log("게시물 등록 시작");
      console.log(images);

      const imageUrls =
        images.length > 0 ? await uploadPostImages(images, uid!) : [];

      console.log("이미지 등록 성공", imageUrls);

      // 수정(이미 존재 post.id 있음) / 등록 분기
      if (post && post.id) {
        return;
      } else {
        const postId = await createPost({
          title,
          content,
          images: imageUrls,
          uid: uid!,
          displayName: displayName || "",
          photoURL,
        });
        console.log("게시물 등록 성공", imageUrls);
        return postId;
      }
    },
    onSuccess: (data) => {
      successCallBack(true);
    },
    onError: (error) => {
      successCallBack(false);
    },
  });
  return { mutation };
};

export default usePostMutation;
