import { auth, db } from "@/lib/firebase";
import { IUserTokenManager } from "@/types/auth";
import { FirebaseError } from "firebase/app";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

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

    console.log("여기까진 왔음");

    await updateProfile(user, {
      displayName: nickname,
      photoURL: photoURL || null,
    });

    console.log("여기까진 못옴");

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
    console.log(JSON.stringify(error, null, 2));

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
