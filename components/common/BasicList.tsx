import { blackColors, primaryColors, typography } from "@/constants/theme";
import { IPostedData } from "@/types/post";
import dayjs from "dayjs";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import CommentIcon from "@/assets/images/icons/comment_icon.svg";
import HeartIcon from "@/assets/images/icons/heart_icon.svg";

type Props = {
  post: IPostedData;
  onPress: () => void;
};

const BasicList = ({ post, onPress }: Props) => {
  return (
    <Pressable style={styles.postItem} onPress={onPress}>
      <Image
        source={
          post.imageUrls && post.imageUrls.length > 0
            ? { uri: post.imageUrls[0] }
            : require("@/assets/images/basic_photo.png")
        }
        style={styles.thumbImg}
      />

      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postPreviewContent}>
          {post.content.slice(0, 20)}
          {post.content.length > 20 ? "..." : ""}
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.datetime}>
            {post.displayName} |{" "}
            {post.createdAt &&
              dayjs(post.createdAt.toDate()).format("YY.MM.DD")}
          </Text>

          <View style={styles.countContainer}>
            <HeartIcon style={styles.smallIconStyle} />
            <Text style={styles.count}>{post.likeCount}</Text>
            <CommentIcon style={styles.smallIconStyle} />
            <Text style={styles.count}>{post.commentCount}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default BasicList;

const styles = StyleSheet.create({
  postItem: {
    marginHorizontal: 16,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 7,
    backgroundColor: "#fff",
  },
  thumbImg: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 12,
  },
  postContent: { flex: 1 },
  postTitle: { ...typography.body16SemiBold, marginBottom: 3 },
  postPreviewContent: {
    ...typography.body14Regular,
    color: blackColors.seventy,
  },
  infoRow: {
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "center",
    marginTop: 8,
  },

  nickname: { ...typography.caption12SemiBold, color: primaryColors.eighty },
  datetime: { ...typography.body14Regular, color: "#8c8c8c" },

  countContainer: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    right: 0,
  },
  smallIconStyle: {
    marginLeft: 6,
  },
  count: {
    ...typography.caption12Regular,
    alignItems: "center",
    marginLeft: 4,
  },
});
