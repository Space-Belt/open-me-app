import BasicContainer from "@/components/common/BasicContainer";
import BasicHeader from "@/components/common/BasicHeader";
import BasicInput from "@/components/common/BasicInput";
import BasicText from "@/components/common/BasicText";
import { useSignUpForm } from "@/hooks/useSignUpform";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import CancelIcon from "@/assets/images/icons/close_icon.svg";
import PhotoIcon from "@/assets/images/icons/photo_icon.svg";
import BasicButton from "@/components/common/BasicButton";
import { typography } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useImagePicker } from "@/hooks/useImagePicker";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { showOneButtonModal } from "@/utils/modal";
import { isIOS } from "@/utils/public";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function EditProfileScreen() {
  const router = useRouter();

  const { images, setImages, removeImage, pickImages } = useImagePicker(1);

  const {
    email,
    setEmail,
    nickname,
    nicknameError,
    setNicknameError,
    nicknameSuccess,
    handleNicknameChange,
    handleNicknameBlur,
  } = useSignUpForm();

  const { auth } = useAuth();

  const successCallback = () => {
    showOneButtonModal("수정", "프로필이 수정되었습니다.", () => {
      router.replace("/my-page");
    });
  };

  const updateProfile = useUpdateProfile(successCallback);

  const handleEditInfo = async () => {
    if (auth && nickname.length > 1 && nickname.length < 9) {
      updateProfile.mutate({
        uid: auth?.uid || "",
        nickname,
        newImageUri: images[0] || undefined,
      });
    } else {
      setNicknameError("닉네임은 2~8자입니다.");
    }
  };

  useEffect(() => {
    if (auth) {
      handleNicknameChange(auth.displayName!);
      setEmail(auth.email);
      if (auth.photoURL) {
        setImages([auth.photoURL]);
      }
    }
  }, [auth]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIOS ? "padding" : undefined}
      keyboardVerticalOffset={64}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollStyle}>
          <BasicContainer>
            <BasicHeader title="프로필 수정" />
            <View style={styles.formStyle}>
              <View>
                <View style={styles.profileWrapper}>
                  <BasicText style={[styles.label]}>
                    프로필 사진 (선택)
                  </BasicText>
                  <Pressable onPress={!images[0] ? pickImages : () => {}}>
                    {!images[0] || !auth?.photoURL ? (
                      <View style={styles.image}>
                        <PhotoIcon width={50} height={50} />
                      </View>
                    ) : (
                      <Image
                        source={{ uri: images[0] ? images[0] : auth.photoURL }}
                        resizeMode="cover"
                        style={styles.image}
                      />
                    )}

                    {images[0] && (
                      <Pressable
                        style={styles.deleteBtn}
                        hitSlop={15}
                        onPress={() => {
                          removeImage(0);
                        }}
                      >
                        <CancelIcon width={30} height={30} />
                      </Pressable>
                    )}
                  </Pressable>
                </View>
                <BasicInput
                  label="이메일 (수정불가)"
                  editable={false}
                  value={email}
                  disable={true}
                  onChangeText={setEmail}
                  maxLength={8}
                />
                <BasicInput
                  label="닉네임"
                  value={nickname}
                  required
                  onChangeText={handleNicknameChange}
                  maxLength={8}
                  placeholder="닉네임 입력 (2~8자)"
                  errorMessage={nicknameError}
                  successMessage={nicknameSuccess}
                  onBlur={handleNicknameBlur}
                />
              </View>
              <BasicButton title="수정하기" onPress={handleEditInfo} />
            </View>
          </BasicContainer>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  profileWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollStyle: {
    flexGrow: 1,
  },
  formStyle: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  deleteBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 5,
    borderRadius: 12,
    zIndex: 100,
  },
  label: {
    ...typography.body16SemiBold,
    color: "#333",
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
});
