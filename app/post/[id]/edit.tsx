import { fetchPostById } from "@/api/postController";
import BasicText from "@/components/common/BasicText";
import PostEditScreen from "@/components/screens/PostEditScreen";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";

export default function EditPostPage() {
  const { id } = useLocalSearchParams();
  const {
    data: postData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id as string),
    enabled: !!id,
  });

  const router = useRouter();
  const user = useFirebaseUser();

  if (!user) {
    // 로그인 안된 상태이므로 로그인 화면 또는 메시지
    return (
      <View style={styles.errorContainer}>
        <BasicText>로그인이 만료되었습니다.</BasicText>
        <Button
          title="로그인 화면으로 이동"
          onPress={() => router.replace("/(auth)/signin")}
        />
      </View>
    );
  }

  if (!postData) return null;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !postData) {
    return (
      <View style={styles.loadingContainer}>
        <BasicText>게시글을 불러오지 못했습니다.</BasicText>
        <Button title="다시 시도" onPress={() => refetch()} />
      </View>
    );
  }

  return <PostEditScreen post={postData} postId={id as string} />;
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
