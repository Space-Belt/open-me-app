import SubLogo from "@/assets/images/icons/sub_logo.svg";
import { primaryColors, typography } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { showTwoButtonModal } from "@/utils/modal";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import { fetchPostsPaging } from "@/api/postController";
import WriteIcon from "@/assets/images/icons/write_icon.svg";

import { useInfiniteQuery } from "@tanstack/react-query";

import BasicContainer from "../common/BasicContainer";
import BasicHeader from "../common/BasicHeader";
import BasicList from "../common/BasicList";

const MainScreen = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPostsPaging,
    getNextPageParam: (lastPage) => {
      return lastPage.posts.length === 10 ? lastPage.lastDoc : undefined;
    },
    initialPageParam: undefined,
  });

  // 모든 페이지의 posts를 하나의 배열로 합치기
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleLoggedInRouter = () => router.replace("/(auth)/signin");

  const handleAddBtn = () => {
    if (!isAuthenticated) {
      showTwoButtonModal(
        "로그인 필요",
        "글 작성을 하시려면\n로그인을 해야합니다.",
        [
          {
            label: "나중에",
            variant: "outline",
            onPress: () => {},
          },
          {
            label: "로그인하기",
            variant: "primary",
            onPress: handleLoggedInRouter,
          },
        ]
      );
    } else {
      router.navigate("/post");
    }
  };

  const handlePressPost = (id: string) => {
    router.push(`/post/${id}`);
  };
  return (
    <BasicContainer edges={["top"]} style={styles.container}>
      <BasicHeader
        style={styles.headerContainer}
        left={isAuthenticated && <></>}
        center={<SubLogo />}
        right={
          !isAuthenticated && (
            <Pressable hitSlop={12} onPress={handleLoggedInRouter}>
              <Text style={styles.lookAroundText}>로그인하기</Text>
            </Pressable>
          )
        }
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BasicList post={item} onPress={() => handlePressPost(item.id)} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        refreshing={isLoading}
        onRefresh={refetch}
      />
      <Pressable
        style={[styles.addPostBtn, { bottom: isAuthenticated ? 20 : 70 }]}
        onPress={handleAddBtn}
      >
        <WriteIcon width={30} height={30} />
      </Pressable>
    </BasicContainer>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  logoImg: {
    width: 50,
    height: 50 * 0.6,
    resizeMode: "cover",
  },
  container: { paddingHorizontal: 0 },
  headerContainer: { paddingHorizontal: 16 },
  lookAroundText: {
    ...typography.body14SemiBold,
    color: primaryColors.sixty,
  },
  addPostBtn: {
    position: "absolute",
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: primaryColors.fifty,
    justifyContent: "center",
    alignItems: "center",
  },
});
