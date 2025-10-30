import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

/********** 사진 한장 url 변경 프로필 사진 **********/
export const uploadProfileImage = async (
  localUri: string,
  uid: string
): Promise<string> => {
  try {
    if (localUri.startsWith("https://")) {
      return localUri;
    }
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

/********** 이미지 여러장 변경 **********/
export const uploadPostImages = async (
  localUris: string[],
  uid: string
): Promise<string[]> => {
  const uploadPromises = localUris.map(async (uri, idx) => {
    if (uri.startsWith("https://")) {
      // 이미 Storage URL인 경우 그대로 사용
      return uri;
    } else {
      const response = await fetch(uri);
      if (!response.ok)
        throw new Error(`이미지 fetch 실패: ${response.status}`);
      const blob = await response.blob();

      const fileRef = ref(storage, `posts/${uid}/${Date.now()}_${idx}.jpg`);
      await uploadBytes(fileRef, blob);

      return await getDownloadURL(fileRef);
    }
  });

  return await Promise.all(uploadPromises);
};
