import BasicButton from "@/components/common/BasicButton";
import BasicContainer from "@/components/common/BasicContainer";
import BasicHeader from "@/components/common/BasicHeader";
import BasicInput from "@/components/common/BasicInput";
import { useSignUpForm } from "@/hooks/useSignUpform";
import { isIOS } from "@/utils/public";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { emailSignUp } from "@/api/authController";
import { useAuth } from "@/hooks/useAuth";
import { handleAuthInput, validatePassword } from "@/utils/auth";
import { showOneButtonModal, showTwoButtonModal } from "@/utils/modal";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();
  const isSocialLogin = false;
  const {
    email,
    setEmail,
    emailError,
    setEmailError,
    emailSuccess,
    nickname,
    nicknameError,
    nicknameSuccess,
    password,
    setPassword,
    passwordError,
    setPasswordError,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordError,
    setConfirmPasswordError,
    confirmPasswordSuccess,
    handleEmailBlur,
    handleNicknameChange,
    handleNicknameBlur,
    handleConfirmPasswordBlur,
  } = useSignUpForm();

  const { login } = useAuth();
  // useMutation 호출
  const mutation = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      nickname: string;
    }) => await emailSignUp(data.email, data.password, data.nickname),
    onSuccess: (data) => {
      showTwoButtonModal(
        "회원가입 성공",
        "회원가입이 완료되었습니다.\n바로 로그인 하시겠어요?",
        [
          {
            label: "나중에",
            variant: "outline",
            onPress: () => {
              router.replace("/(auth)/signin");
            },
          },
          {
            label: "로그인하기",
            variant: "primary",
            onPress: async () => {
              const tokens = {
                uid: data.user.uid,
                email: data.user.email ?? "",
                accessToken: data.token.accessToken,
                refreshToken: data.token.refreshToken,
                expirationTime: data.token.expirationTime,
              };
              try {
                await login(tokens);
                showOneButtonModal("로그인 성공", "로그인 완료!", () => {
                  router.replace("/(tabs)");
                });
              } catch (err: any) {
                console.log(err);
                showOneButtonModal(
                  "로그인 오류",
                  "로그인 실패!\n죄송합니다.\n다시시도해주세요",
                  () => {
                    router.push("/(auth)/signin");
                  }
                );
                throw err;
              }
            },
          },
        ]
      );
    },
    onError: (error) => {
      showOneButtonModal(
        "로그인 오류",
        "로그인 실패!\n죄송합니다.\n다시시도해주세요",
        () => {
          router.push("/(auth)/signin");
        }
      );
    },
  });

  const handleSignUp = () => {
    const pwdError = validatePassword(password);
    setPasswordError(pwdError);
    if (pwdError) return;
    if (confirmPasswordError) return;
    mutation.mutate({ email, password, nickname });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIOS ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <BasicContainer style={styles.container}>
            <BasicHeader title="회원가입" />
            <View style={styles.formStyle}>
              <View>
                <BasicInput
                  label="닉네임"
                  autoFocus={true}
                  value={nickname}
                  required
                  onChangeText={handleNicknameChange}
                  maxLength={15}
                  placeholder="닉네임 입력 (2~15자)"
                  errorMessage={nicknameError}
                  successMessage={nicknameSuccess}
                  onBlur={handleNicknameBlur}
                />
                {!isSocialLogin && (
                  <>
                    <BasicInput
                      label="이메일"
                      required
                      value={email}
                      onChangeText={(text: string) =>
                        handleAuthInput(text, setEmail, setEmailError)
                      }
                      placeholder="이메일 입력"
                      errorMessage={emailError}
                      successMessage={emailSuccess}
                      onBlur={handleEmailBlur}
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
                  </>
                )}
              </View>
              <BasicButton title="가입하기" onPress={handleSignUp} />
            </View>
          </BasicContainer>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formStyle: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
});
