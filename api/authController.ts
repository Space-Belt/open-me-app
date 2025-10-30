import { auth, db, storage } from "@/lib/firebase";
import { IUserTokenManager } from "@/types/auth";
import { FirebaseError } from "firebase/app";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";

import { uploadProfileImage } from "@/api/imageController";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";

export const checkEmailDuplication = async (
  email: string
): Promise<boolean> => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const checkNicknameDuplication = async (
  nickname: string
): Promise<boolean> => {
  const q = query(collection(db, "users"), where("nickname", "==", nickname));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const emailSignUp = async (
  email: string,
  password: string,
  nickname: string,
  photoURL?: string
): Promise<{ success: boolean; user: User; token: IUserTokenManager }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const stsTokenManager: IUserTokenManager = (user as any).stsTokenManager;

    await updateProfile(user, {
      displayName: nickname,
      photoURL: photoURL || null,
    });

    await setDoc(doc(db, "users", user.uid), {
      email,
      nickname,
      photoURL: photoURL || null,
      createdAt: serverTimestamp(),
    });

    return { success: true, user: user, token: stsTokenManager };
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};

export const emailSignIn = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  user?: User;
  token?: IUserTokenManager;
  message?: string;
}> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const stsTokenManager: IUserTokenManager = (user as any).stsTokenManager;
    return { success: true, user: user, token: stsTokenManager };
  } catch (error: FirebaseError | any) {
    let message = "로그인에 실패했습니다. 다시 시도해주세요.";

    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        message = "아이디 또는 비밀번호가 올바르지 않습니다.";
        break;
      case "auth/invalid-email":
        message = "이메일 형식이 잘못되었습니다.";
        break;
      case "auth/invalid-credential":
        message = "아이디 또는 비밀번호가 올바르지 않습니다.";
        break;

      case "auth/too-many-requests":
        message = "너무 많은 시도입니다. 잠시 후 다시 시도해주세요.";
        break;
    }

    return { success: false, message };
  }
};

export const emailSignOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const getCurrentUserInfo = () => {
  const user = auth.currentUser;
  if (!user) return null;

  const stsTokenManager = (user as any).stsTokenManager;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    accessToken: stsTokenManager?.accessToken,
    refreshToken: stsTokenManager?.refreshToken,
    expirationTime: stsTokenManager?.expirationTime,
  };
};

export const updateUserProfile = async ({
  uid,
  nickname,
  photoURL,
  newImageUri, // 새 이미지를 업로드할 경우
}: {
  uid: string;
  nickname?: string;
  photoURL?: string | null;
  newImageUri?: string;
}): Promise<{
  success: boolean;
  updatedData?: {
    displayName?: string;
    photoURL?: string | null;
  };
  message?: string;
}> => {
  try {
    const user = auth.currentUser;

    if (!user || user.uid !== uid) {
      throw new Error("인증되지 않은 사용자입니다.");
    }

    let finalPhotoURL = photoURL;

    if (newImageUri) {
      finalPhotoURL = await uploadProfileImage(newImageUri, uid);
    }

    const updateData: any = {};

    const authUpdateData: any = {};
    if (nickname !== undefined) {
      authUpdateData.displayName = nickname;
      updateData.nickname = nickname;
    }
    if (finalPhotoURL !== undefined) {
      authUpdateData.photoURL = finalPhotoURL;
      updateData.photoURL = finalPhotoURL;
    }

    if (Object.keys(authUpdateData).length > 0) {
      await updateProfile(user, authUpdateData);
    }

    if (Object.keys(updateData).length > 0) {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    }

    return {
      success: true,
      updatedData: {
        displayName: nickname,
        photoURL: finalPhotoURL,
      },
    };
  } catch (error) {
    console.error("프로필 업데이트 실패:", error);
    return {
      success: false,
      message: "프로필 업데이트에 실패했습니다.",
    };
  }
};

/**
 *  삭제
 */
export const deleteAccount = async (
  uid: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const user = auth.currentUser;

    if (!user || user.uid !== uid) {
      throw new Error("인증되지 않은 사용자입니다.");
    }

    // 1. 내가 쓴 게시물 조회
    const postsQuery = query(collection(db, "posts"), where("uid", "==", uid));
    const postsSnapshot = await getDocs(postsQuery);

    // 2. 각 게시물과 그에 달린 댓글들 삭제
    for (const postDoc of postsSnapshot.docs) {
      const postId = postDoc.id;
      const postData = postDoc.data();

      // 2-1. 해당 게시물의 모든 댓글 삭제
      const commentsRef = collection(db, "posts", postId, "comments");
      const commentsSnapshot = await getDocs(commentsRef);

      const batch = writeBatch(db);
      commentsSnapshot.docs.forEach((commentDoc) => {
        batch.delete(commentDoc.ref);
      });
      await batch.commit();

      // 2-2. 게시물의 이미지 삭제 (Storage)
      if (postData.imageUrls && postData.imageUrls.length > 0) {
        for (const imageUrl of postData.imageUrls) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.warn("이미지 삭제 실패 (계속 진행):", error);
          }
        }
      }

      // 2-3. 게시물 문서 삭제
      await deleteDoc(doc(db, "posts", postId));
    }

    // 3. 프로필 이미지 삭제 (Storage)
    try {
      const profileImagesRef = ref(storage, `profiles/${uid}`);
      const profileImagesList = await listAll(profileImagesRef);

      if (profileImagesList.items.length > 0) {
        for (const item of profileImagesList.items) {
          await deleteObject(item);
        }
      }
    } catch (error) {
      console.warn("프로필 이미지 삭제 실패 (계속 진행):", error);
    }

    // 4. Firestore users 문서 삭제
    await deleteDoc(doc(db, "users", uid));

    // 5. Authentication 계정 삭제
    await deleteUser(user);

    return { success: true };
  } catch (error: any) {
    console.error("회원 탈퇴 실패:", error);

    // 재인증이 필요한 경우
    if (error.code === "auth/requires-recent-login") {
      return {
        success: false,
        message: "보안을 위해 다시 로그인 후 탈퇴해주세요.",
      };
    }

    return {
      success: false,
      message: "회원 탈퇴에 실패했습니다. 다시 시도해주세요.",
    };
  }
};

// 비밀번호 변경
export const changePassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("인증되지 않은 사용자입니다.");
    }

    // 1. 현재 비밀번호로 재인증
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    await reauthenticateWithCredential(user, credential);
    // 2. 새 비밀번호로 변경
    await updatePassword(user, newPassword);

    return { success: true };
  } catch (error: any) {
    console.error("비밀번호 변경 실패:", error);

    let message = "비밀번호 변경에 실패했습니다.";

    switch (error.code) {
      case "auth/wrong-password":
      case "auth/invalid-credential":
        message = "현재 비밀번호가 올바르지 않습니다.";
        break;
      case "auth/weak-password":
        message = "새 비밀번호는 6자 이상이어야 합니다.";
        break;
      case "auth/requires-recent-login":
        message = "보안을 위해 다시 로그인 후 시도해주세요.";
        break;
      case "auth/too-many-requests":
        message = "너무 많은 시도입니다. 잠시 후 다시 시도해주세요.";
        break;
    }

    return { success: false, message };
  }
};
