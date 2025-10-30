import BasicContainer from "@/components/common/BasicContainer";
import BasicHeader from "@/components/common/BasicHeader";
import BasicList from "@/components/common/BasicList";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { fetchMyPostsPaging } from "@/api/myDataController";
import SubLogo from "@/assets/images/icons/sub_logo.svg";
import WriteIcon from "@/assets/images/icons/write_icon.svg";
import BasicText from "@/components/common/BasicText";
import { primaryColors, typography } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export default function MyPostScreen() {
  const router = useRouter();

  const { auth } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["myposts", auth?.uid],
    queryFn: ({ pageParam }) =>
      fetchMyPostsPaging({
        uid: auth?.uid!,
        pageParam: pageParam || undefined,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.posts.length === 10 ? lastPage.lastDoc : undefined;
    },
    enabled: !!auth?.uid,
    initialPageParam: undefined,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handlePressPost = (id: string) => {
    router.push(`/post/${id}`);
  };

  const handleAddBtn = () => {
    router.navigate("/post");
  };

  const user = useFirebaseUser();

  if (!user) {
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

  return (
    <BasicContainer edges={["top"]} style={{ paddingHorizontal: 0 }}>
      <BasicHeader left={<></>} center={<SubLogo />} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BasicList post={item} onPress={() => handlePressPost(item.id)} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <BasicText style={styles.myPostText}>나의 이야기들</BasicText>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footerIndicator} />
          ) : null
        }
        refreshing={isLoading}
        onRefresh={refetch}
      />
      <Pressable style={[styles.addPostBtn, {}]} onPress={handleAddBtn}>
        <WriteIcon width={30} height={30} />
      </Pressable>
    </BasicContainer>
  );
}

const styles = StyleSheet.create({
  lookAroundText: {
    ...typography.body14SemiBold,
    color: primaryColors.sixty,
  },
  addPostBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: primaryColors.fifty,
    justifyContent: "center",
    alignItems: "center",
  },
  myPostText: {
    ...typography.headline18Bold,
    color: primaryColors.fifty,
    marginTop: 20,
    marginLeft: 20,
  },
  footerIndicator: {
    marginVertical: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
