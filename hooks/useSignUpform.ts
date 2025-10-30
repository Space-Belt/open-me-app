// hooks/useSignUpForm.ts
import {
  checkEmailDuplication,
  checkNicknameDuplication,
} from "@/api/authController";
import { validateEmailFormat, validateNickname } from "@/utils/auth";
import { useState } from "react";

// 회원 가입 훅
const useSignUpForm = () => {
  // state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [emailSuccess, setEmailSuccess] = useState<string>();

  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState<string>();
  const [nicknameSuccess, setNicknameSuccess] = useState<string>();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();
  const [confirmPasswordSuccess, setConfirmPasswordSuccess] =
    useState<string>();

  // 닉네임 바꾸기
  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setNicknameError(validateNickname(value));
    setNicknameSuccess(undefined);
  };
  // input OnBlur 될때마다 검사
  const handleNicknameBlur = async (prevName?: string) => {
    const err = validateNickname(nickname);
    setNicknameError(err);
    setNicknameSuccess(undefined);
    if (!err) {
      if (prevName !== nickname) {
        const isDuplicated = await checkNicknameDuplication(nickname);
        if (isDuplicated) setNicknameError("이미 사용 중인 닉네임입니다.");
        else setNicknameSuccess("사용 가능한 닉네임입니다!");
      }
    }
  };
  // 이메일 OnBlur 될때마다 검사
  const handleEmailBlur = async () => {
    setEmailError(undefined);
    setEmailSuccess(undefined);
    if (!validateEmailFormat(email)) {
      setEmailError("이메일 형식이 올바르지 않아요.");
      return;
    }
    const isDuplicated = await checkEmailDuplication(email);
    if (isDuplicated) setEmailError("이미 사용 중인 이메일입니다.");
    else setEmailSuccess("사용 가능한 이메일입니다!");
  };
  // 비밀번호 확인 OnBlur 될떄마다 검사
  const handleConfirmPasswordBlur = () => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      setConfirmPasswordSuccess(undefined);
    } else {
      setConfirmPasswordError(undefined);
      setConfirmPasswordSuccess("비밀번호가 일치합니다.");
    }
  };

  return {
    email,
    setEmail,
    emailError,
    setEmailError,
    emailSuccess,
    nickname,
    nicknameError,
    setNicknameError,
    nicknameSuccess,
    password,
    setPassword,
    setPasswordError,
    passwordError,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordError,
    setConfirmPasswordError,
    confirmPasswordSuccess,
    handleEmailBlur,
    handleNicknameChange,
    handleNicknameBlur,
    handleConfirmPasswordBlur,
  };
};

export default useSignUpForm;
