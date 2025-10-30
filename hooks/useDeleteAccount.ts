import { deleteAccount } from "@/api/authController";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

/********** 회원 탈퇴 훅 **********/
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        await logout();
        router.replace("/(auth)/signin");
      }
    },
  });
};
