import { getMyStats } from "@/api/myDataController";
import BasicButton from "@/components/common/BasicButton";
import BasicContainer from "@/components/common/BasicContainer";
import BasicHeader from "@/components/common/BasicHeader";
import { useAuth } from "@/hooks/useAuth";
import { showOneButtonModal, showTwoButtonModal } from "@/utils/modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  View,
} from "react-native";

import SubLogo from "@/assets/images/icons/sub_logo.svg";
import BasicText from "@/components/common/BasicText";
import { blackColors, primaryColors, typography } from "@/constants/theme";
import { SCREEN_WIDTH } from "@/utils/public";

import { emailSignOut } from "@/api/authController";
import MyPostIcon from "@/assets/images/icons/list_icon.svg";
import CommentIcon from "@/assets/images/icons/message_icon.svg";
import MypageButton from "@/components/mypage/MypageButton";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import useFirebaseUser from "@/hooks/useFirebaseUser";

const PADDING_HORIZONTAL = 32;
const GAP = 12;
const ACTIVITY_WIDTH = (SCREEN_WIDTH - PADDING_HORIZONTAL - GAP) / 2;

export default function MyPageScreen() {
  const router = useRouter();

  const { logout } = useAuth();

  const leaveMutation = useDeleteAccount();

  const { auth } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["myStats", auth?.uid],
    queryFn: () => getMyStats(auth?.uid!),
    enabled: !!auth?.uid,
  });

  const logoutMutation = useMutation({
    mutationFn: emailSignOut,
    onSuccess: async () => {
      showOneButtonModal("로그아웃", "로그아웃 되었습니다!", async () => {
        await logout();
        router.replace("/(auth)/signin");
      });
    },
    onError: () => {
      showOneButtonModal("로그아웃", "로그아웃에 실패했습니다!", () => {});
    },
  });

  const handleChangePassword = () => {
    router.push("/user/change-password");
  };

  const handleLogoutBtn = () => {
    showTwoButtonModal("로그아웃", "정말 로그아웃 하시겠어요?", [
      {
        label: "나중에",
        variant: "outline",
        onPress: () => {},
      },
      {
        label: "로그아웃",
        variant: "primary",
        onPress: async () => {
          logoutMutation.mutate();
        },
      },
    ]);
  };
  const handleLeaveBtn = () => {
    showTwoButtonModal("탈퇴", "정말 탈퇴하시겠어요?", [
      {
        label: "나중에",
        variant: "outline",
        onPress: () => {},
      },
      {
        label: "예",
        variant: "primary",
        onPress: async () => {
          if (auth?.uid) {
            leaveMutation.mutate(auth?.uid);
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push("/user/edit-profile");
  };

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

  if (isLoading || logoutMutation.isPending || leaveMutation.isPending) {
    return <ActivityIndicator />;
  }

  return (
    <BasicContainer style={styles.container}>
      <BasicHeader left={<></>} center={<SubLogo />} />
      <View style={styles.topContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={
              auth?.photoURL
                ? { uri: auth?.photoURL }
                : require("@/assets/images/basic_photo.png")
            }
            style={styles.profileImage}
          />
          <View style={{ gap: 4 }}>
            <BasicText style={styles.nicknameText}>
              {auth?.displayName}
            </BasicText>
            <BasicText style={styles.emailText}>{auth?.email}</BasicText>
          </View>
        </View>
        <BasicButton
          style={styles.profileBtn}
          textStyle={styles.profiltBtnText}
          title="프로필 수정하기"
          onPress={handleEditProfile}
        />
        <View style={styles.myActivitiesContainer}>
          <BasicText style={styles.myActivitiesTitle}>나의 활동</BasicText>
          <View style={styles.myActivitiesRow}>
            <View style={styles.activityBox}>
              <MyPostIcon />
              <View>
                <BasicText style={styles.activityTitle}>내 게시물</BasicText>
                <BasicText style={styles.activityCount}>
                  {stats?.postsCount ?? 0} 개
                </BasicText>
              </View>
            </View>
            <View style={styles.activityBox}>
              <CommentIcon />

              <View>
                <BasicText style={styles.activityTitle}>내 댓글</BasicText>
                <BasicText style={styles.activityCount}>
                  {stats?.commentsCount ?? 0} 개
                </BasicText>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.divideLine} />
      <View style={styles.bottomContainer}>
        <MypageButton
          title={"비밀번호변경"}
          onPress={handleChangePassword}
          borderPosition="bottom"
        />
        <MypageButton
          title={"로그아웃"}
          onPress={handleLogoutBtn}
          borderPosition="bottom"
        />
        <MypageButton
          title={"회원탈퇴"}
          onPress={handleLeaveBtn}
          borderPosition="bottom"
        />
      </View>
    </BasicContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  topContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    marginRight: 16,
  },
  nicknameText: {
    ...typography.title24Bold,
  },
  emailText: {
    ...typography.body16Regular,
  },
  profileBtn: {
    marginTop: 24,
    borderRadius: 50,
    backgroundColor: primaryColors.twenty,
  },
  profiltBtnText: {
    color: blackColors.five,
  },
  myActivitiesContainer: {
    marginTop: 20,
    paddingBottom: 40,
  },
  myActivitiesTitle: {
    ...typography.body16SemiBold,
  },
  myActivitiesRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  activityBox: {
    width: ACTIVITY_WIDTH,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 0.75 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 7,
    backgroundColor: "#fff",
  },
  activityTitle: {
    ...typography.body14Regular,
    color: blackColors.forty,
  },
  activityCount: {
    ...typography.body16SemiBold,
  },
  divideLine: {
    width: SCREEN_WIDTH,
    height: 6,
    backgroundColor: blackColors.twenty,
    marginBottom: 20,
  },

  bottomContainer: {
    paddingHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
