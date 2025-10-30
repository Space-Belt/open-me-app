import { changePassword } from "@/api/authController";
import { useMutation } from "@tanstack/react-query";

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
