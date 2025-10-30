import { emailSignIn } from "@/api/authController";
import BasicButton from "@/components/common/BasicButton";
import BasicContainer from "@/components/common/BasicContainer";
import BasicHeader from "@/components/common/BasicHeader";
import BasicInput from "@/components/common/BasicInput";
import { primaryColors, typography } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import {
  handleAuthInput,
  validateEmailFormat,
  validatePassword,
} from "@/utils/auth";
import { showOneButtonModal } from "@/utils/modal";
import { isIOS } from "@/utils/public";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { ISecureStoreAuthData } from "@/types/auth";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();

  const { login } = useAuth();

  // 로그인 뮤테이션
  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await emailSignIn(data.email, data.password),
    onSuccess: async (data) => {
      if (data && data.user && data.token) {
        const tokens: ISecureStoreAuthData = {
          uid: data.user.uid,
          email: data.user.email ?? "",
          accessToken: data.token.accessToken,
          refreshToken: data.token.refreshToken,
          expirationTime: data.token.expirationTime,
          displayName: data.user.displayName ?? "",
          photoURL: data.user.photoURL ?? "",
        };

        await login(tokens);
        showOneButtonModal("로그인 성공", "로그인 되었습니다!", () => {
          router.replace("/(tabs)");
        });
      }
      if (data && data.message) {
        showOneButtonModal("로그인 실패", data.message, () => {});
      }
    },
    onError: (error) => {
      showOneButtonModal("로그인 실패", "로그인 실패했습니다!", () => {});
    },
  });
  const handleSignIn = async () => {
    const emailValidationError = validateEmailFormat(email);
    const pwdValidationError = validatePassword(password);
    setPasswordError(pwdValidationError);
    if (!emailValidationError) {
      setEmailError("이메일을 확인해주세요.");
    }
    if (pwdValidationError) return;

    mutation.mutate({ email, password });
  };

  // 가입하기 이동
  const handleSignUp = () => {
    router.navigate("/(auth)/signup");
  };
  // 둘러보기
  const handleLookAround = () => {
    router.replace("/(auth)/home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIOS ? "padding" : undefined}
      keyboardVerticalOffset={10}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollStyle}>
          <BasicContainer>
            <BasicHeader
              right={
                <Pressable hitSlop={12} onPress={handleLookAround}>
                  <Text style={styles.lookAroundText}>둘러보기</Text>
                </Pressable>
              }
            />
            <View style={styles.container}>
              <View style={styles.imageWrapper}>
                <Image
                  source={require("@/assets/images/openme.png")}
                  style={styles.logoImg}
                />
              </View>
              <View style={styles.inputWrapper}>
                <BasicInput
                  label="이메일"
                  value={email}
                  onChangeText={(text: string) =>
                    handleAuthInput(text, setEmail, setEmailError)
                  }
                  errorMessage={emailError}
                  placeholder="이메일을 입력해주세요"
                />
                <BasicInput
                  label="비밀번호"
                  isPassword={true}
                  value={password}
                  onChangeText={(text: string) =>
                    handleAuthInput(text, setPassword, setPasswordError)
                  }
                  placeholder="비밀번호를 입력해주세요"
                  maxLength={20}
                  errorMessage={passwordError}
                />
                <BasicButton
                  title="로그인"
                  onPress={handleSignIn}
                  style={styles.btnStyle}
                  loading={mutation.isPending}
                  disabled={mutation.isPending}
                />
                <BasicButton
                  title="회원가입"
                  onPress={handleSignUp}
                  style={styles.btnStyle}
                  variant="outline"
                />
              </View>
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
    justifyContent: "space-between",
  },
  scrollStyle: {
    flexGrow: 1,
  },
  lookAroundText: {
    ...typography.body14SemiBold,
    color: primaryColors.sixty,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  logoImg: {
    width: 240,
    height: 240 * 0.6,
    resizeMode: "cover",
  },
  btnStyle: {
    marginTop: 10,
  },
});
