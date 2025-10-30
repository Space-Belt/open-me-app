import { changePassword } from "@/api/authController";
import { useMutation } from "@tanstack/react-query";

/********** 비밀번호 변경 훅 **********/
const useChangePassword = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (result) => {
      if (result.success && onSuccess) {
        onSuccess();
      }
    },
  });
};

export default useChangePassword;
