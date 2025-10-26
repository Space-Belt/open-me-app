import BasicButton from "@/components/common/BasicButton";
import BasicContainer from "@/components/common/BasicContainer";
import BasicInput from "@/components/common/BasicInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function SignInScreen() {
  const router = useRouter();
  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {};

  const handleSignUp = () => {
    router.replace("/(auth)/signup");
  };

  return (
    <BasicContainer style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/openme.png")}
          style={styles.logoImg}
        />
      </View>
      <View>
        <BasicInput
          label="아이디"
          value={identification}
          onChangeText={setIdentification}
          placeholder="아이디를 입력해주세요"
        />
        <BasicInput
          label="비밀번호"
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호를 입력해주세요"
        />
        <BasicButton
          title="로그인"
          onPress={() => {}}
          style={styles.btnStyle}
        />
        <BasicButton
          title="회원가입"
          onPress={handleSignUp}
          style={styles.btnStyle}
          variant="outline"
        />
      </View>
    </BasicContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  logoImg: {
    width: 300,
    height: 300 * 0.6,
    resizeMode: "cover",
  },
  btnStyle: {
    marginTop: 20,
  },
});
