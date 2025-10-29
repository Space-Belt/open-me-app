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

import GoogleIcon from "@/assets/images/icons/icon_google.svg";
import { ISecureStoreAuthData } from "@/types/auth";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();

  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await emailSignIn(data.email, data.password),
    onSuccess: async (data) => {
      console.log(data.user);

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
      console.log(JSON.stringify(data, null, 2));
      if (data && data.message) {
        showOneButtonModal("로그인 실패", data.message, () => {});
      }
    },
    onError: (error) => {
      showOneButtonModal("로그인 실패", "로그인 실패했습니다!", () => {});
    },
  });

  const handleSignIn = async () => {
    const pwdError = validatePassword(password);
    const emailError = validateEmailFormat(email);
    setPasswordError(pwdError);
    if (!emailError) {
      setEmailError("이메일을 확인해주세요.");
    }
    if (pwdError) return;

    mutation.mutate({ email, password });
  };

  const handleSignUp = () => {
    router.navigate("/(auth)/signup");
  };

  const handleLookAround = () => {
    router.replace("/(auth)/home");
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
            <BasicHeader
              right={
                <Pressable
                  hitSlop={12}
                  style={styles.lookAroundBtn}
                  onPress={handleLookAround}
                >
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
                />
                <BasicButton
                  title="회원가입"
                  onPress={handleSignUp}
                  style={styles.btnStyle}
                  variant="outline"
                />
                <BasicButton
                  title={""}
                  custom={
                    <View style={styles.snsBtn}>
                      <GoogleIcon />
                      <Text style={styles.snsBtnText}>Google 로그인</Text>
                    </View>
                  }
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
  lookAroundBtn: {},
  lookAroundText: {
    ...typography.body14SemiBold,
    color: primaryColors.sixty,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 35,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  logoImg: {
    width: 300,
    height: 300 * 0.6,
    resizeMode: "cover",
  },
  btnStyle: {
    marginTop: 10,
  },
  snsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  snsBtnText: {
    ...typography.headline20Bold,
    color: primaryColors.sixty,
  },
});
