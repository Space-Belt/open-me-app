import { IGetCommentData } from "@/types/comment";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import UserIcon from "@/assets/images/icons/user_icon.svg";
import { blackColors, primaryColors, typography } from "@/constants/theme";
import { showTwoButtonModal } from "@/utils/modal";
import BasicText from "../common/BasicText";

type Props = {
  data: IGetCommentData;
  handleReplyPress: (commentId: string, nickname: string) => void;
  handleDelete: (comment: IGetCommentData) => void;
  handleEdit: (comment: IGetCommentData) => void;
  isReply: boolean;
  myId?: string;
};

const COMMENT_CONTENT_LEFT_AREA = 38;

const CommentItem = ({
  data,
  handleReplyPress,
  handleDelete,
  handleEdit,
  isReply,
  myId,
}: Props) => {
  const handleDeleteBtn = () => {
    showTwoButtonModal("삭제", "댓글을 삭제하시겠습니까?", [
      {
        label: "취소",
        variant: "outline",
        onPress: () => {},
      },
      {
        label: "삭제",
        variant: "primary",
        onPress: () => {
          handleDelete(data);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topLeft}>
          {data.authorPhotoURL ? (
            <Image
              resizeMode="cover"
              source={{ uri: data.authorPhotoURL }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImage}>
              <UserIcon width={20} height={20} />
            </View>
          )}
          <BasicText style={styles.nicknameStyle}>
            {data.authorNickname}
          </BasicText>
        </View>
        {/* {myComment && <View style={styles.topRight}></View>} */}
        <View style={styles.topRight}>
          <Pressable
            hitSlop={5}
            onPress={() =>
              handleReplyPress(
                isReply && data.parentId ? data.parentId : data.id,
                data.authorNickname
              )
            }
          >
            <BasicText style={styles.smallBtn}>답글</BasicText>
          </Pressable>
          {myId && myId === data.authorUid && !data.isDeleted && (
            <View style={styles.ownerBtnSection}>
              <Pressable hitSlop={5} onPress={() => handleEdit(data)}>
                <BasicText style={styles.smallBtn}>수정</BasicText>
              </Pressable>
              <Pressable hitSlop={5} onPress={handleDeleteBtn}>
                <BasicText style={styles.smallBtn}>삭제</BasicText>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <BasicText style={styles.contentSection}>{data.content}</BasicText>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColors.twenty,
  },
  nicknameStyle: {
    ...typography.body14SemiBold,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",

    gap: 20,
  },
  ownerBtnSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  smallBtn: {
    ...typography.caption12Regular,
    color: blackColors.eighty,
  },
  contentSection: {
    ...typography.caption12Regular,
    color: blackColors.eighty,
    marginTop: 8,
    paddingLeft: COMMENT_CONTENT_LEFT_AREA,
  },
});
