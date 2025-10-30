import { fetchPostById } from "@/api/postController";
import PostEditScreen from "@/components/screens/PostEditScreen";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export default function EditPostPage() {
  const { id } = useLocalSearchParams();
  const { data: postData } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id as string),
  });

  if (!postData) return null;

  return <PostEditScreen post={postData} postId={id as string} />;
}
