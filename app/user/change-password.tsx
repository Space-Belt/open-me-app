import BasicButton from "@/components/common/BasicButton";
import BasicContainer from "@/components/common/BasicContainer";
import BasicHeader from "@/components/common/BasicHeader";
import BasicInput from "@/components/common/BasicInput";
import { useAuth } from "@/hooks/useAuth";
import useChangePassword from "@/hooks/useChangePassword";
import useSignUpForm from "@/hooks/useSignUpform";

import { handleAuthInput, validatePassword } from "@/utils/auth";
import { showOneButtonModal } from "@/utils/modal";
import { isIOS } from "@/utils/public";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const {
    password,
    setPassword,
    setPasswordError,
    passwordError,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordError,
    setConfirmPasswordError,
    confirmPasswordSuccess,
    handleConfirmPasswordBlur,
  } = useSignUpForm();

  const successCallback = async () => {
    showOneButtonModal(
      "비밀번호 변경",
      "비밀번호 변경 되었습니다.\n재 로그인 후 이용해주세요.",
      async () => {
        await logout();
        router.replace("/(auth)/signin");
      }
    );
  };

  const changePasswordMutate = useChangePassword(successCallback);

  const [prevPassword, SetPrevPassword] = useState<string>("");

  const handleChangePassword = () => {
    const pwdError = validatePassword(password);
    setPasswordError(pwdError);
    if (pwdError) return;
    if (confirmPasswordError) return;

    changePasswordMutate.mutate({
      currentPassword: prevPassword,
      newPassword: password,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIOS ? "padding" : undefined}
      keyboardVerticalOffset={64}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollStyle}>
          <BasicContainer>
            <BasicHeader title="비밀번호 변경" />
            <View style={styles.formStyle}>
              <View>
                <BasicInput
                  label="기본비밀번호"
                  placeholder="이전 비밀번호"
                  isPassword={true}
                  value={prevPassword}
                  onChangeText={SetPrevPassword}
                />
                <BasicInput
                  label="비밀번호"
                  required
                  isPassword={true}
                  value={password}
                  onChangeText={(text: string) =>
                    handleAuthInput(text, setPassword, setPasswordError)
                  }
                  placeholder="(영어, 숫자, 특수문자 포함 8자 이상)"
                  maxLength={20}
                  errorMessage={passwordError}
                />
                <BasicInput
                  isPassword
                  value={confirmPassword}
                  onChangeText={(text: string) =>
                    handleAuthInput(
                      text,
                      setConfirmPassword,
                      setConfirmPasswordError
                    )
                  }
                  onBlur={handleConfirmPasswordBlur}
                  placeholder="비밀번호를 한번 더 입력해주세요"
                  maxLength={20}
                  errorMessage={confirmPasswordError}
                  successMessage={confirmPasswordSuccess}
                />
              </View>
              <BasicButton title="변경하기" onPress={handleChangePassword} />
            </View>
          </BasicContainer>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollStyle: {
    flexGrow: 1,
  },
  formStyle: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
});
