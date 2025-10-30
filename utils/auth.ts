export const nicknameRegex = /^[가-힣a-zA-Z0-9._-]{2,8}$/;
const consonantVowelOnlyRegex = /^[ㄱ-ㅎㅏ-ㅣ]+$/;

export const validateEmailFormat = (email: string): boolean =>
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

export const validatePassword = (pwd: string): string | undefined => {
  if (!pwd) return "비밀번호를 입력해 주세요.";
  if (pwd.length < 8) return "비밀번호는 최소 8자 이상이어야 합니다.";
  if (!/[a-z]/.test(pwd)) return "영문 소문자를 포함해야 합니다.";
  if (!/[0-9]/.test(pwd)) return "숫자를 포함해야 합니다.";
  if (!/[^A-Za-z0-9]/.test(pwd)) return "특수문자를 포함해야 합니다.";
  return undefined;
};

export const validateNickname = (nickname: string): string | undefined => {
  if (!nickname) return "닉네임을 입력해 주세요.";
  if (nickname.length < 2 || nickname.length > 8)
    return "닉네임은 2~8글자로 입력해 주세요.";
  if (!nicknameRegex.test(nickname))
    return "한글/영문/숫자/_ . -만 사용 가능해요.";
  if (consonantVowelOnlyRegex.test(nickname))
    return "자음/모음만으로는 닉네임 불가해요.";
  return undefined;
};

export const handleAuthInput = (
  text: string,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  setInput(text);
  setErrorMessage("");
};
