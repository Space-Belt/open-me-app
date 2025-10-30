import { updateUserProfile } from "@/api/authController";
import { ISecureStoreAuthData } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

const useUpdateProfile = (callBack: () => void) => {
  const { auth, login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async (result, variables) => {
      if (result.success && result.updatedData && auth) {
        const updatedAuth: ISecureStoreAuthData = {
          ...auth,
          displayName: result.updatedData.displayName ?? auth.displayName,
          photoURL: result.updatedData.photoURL ?? auth.photoURL,
        };
        await login(updatedAuth);
        queryClient.invalidateQueries({ queryKey: ["myStats", auth.uid] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["myposts", auth.uid] });
        callBack();
      }
    },
  });
};

export default useUpdateProfile;
