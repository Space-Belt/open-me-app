import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadProfileImage = async (
  localUri: string,
  uid: string
): Promise<string> => {
  try {
    if (!storage) throw new Error("Firebase Storage가 초기화되지 않았습니다.");
    const response = await fetch(localUri);

    if (!response.ok) throw new Error("이미지 fetch 실패: " + response.status);

    const blob = await response.blob();
    const fileRef = ref(storage, `profile_images/${uid}_${Date.now()}.jpg`);

    await uploadBytes(fileRef, blob);

    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (e) {
    console.error("uploadProfileImage 에러:", e);
    throw e;
  }
};
