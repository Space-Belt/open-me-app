import SubLogo from "@/assets/images/icons/sub_logo.svg";
import { primaryColors, typography } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { showTwoButtonModal } from "@/utils/modal";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import BasicContainer from "../common/BasicContainer";
import BasicHeader from "../common/BasicHeader";

import { fetchPostsPaging } from "@/api/postController";
import PlustIcon from "@/assets/images/icons/plus_icon.svg";

import { IPostedData } from "@/types/post";
import { POSTS_PAGE_SIZE } from "@/utils/public";
import BasicList from "../common/BasicList";

type Props = {};

const MainScreen = (props: Props) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<IPostedData[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    const { posts: newPosts, lastDoc: newLastDoc } = await fetchPostsPaging(
      lastDoc
    );
    setPosts((prev) => [...prev, ...newPosts]);
    setLastDoc(newLastDoc);
    setHasNext(newPosts.length === POSTS_PAGE_SIZE);
    setLoading(false);
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
    <BasicContainer style={{ paddingHorizontal: 0 }}>
      <BasicHeader
        left={isAuthenticated && <></>}
        center={<SubLogo />}
        right={
          !isAuthenticated && (
            <Pressable
              hitSlop={12}
              style={styles.lookAroundBtn}
              onPress={handleLoggedInRouter}
            >
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
        onEndReached={loadPosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
      <Pressable
        style={[styles.addPostBtn, { bottom: isAuthenticated ? 20 : 70 }]}
        onPress={handleAddBtn}
      >
        <PlustIcon width={30} height={30} />
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
  lookAroundBtn: {},
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
