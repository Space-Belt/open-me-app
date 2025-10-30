import { db } from "@/lib/firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";

/********** 좋아요 ! **********/
export const likePost = async (postId: string, userId: string) => {
  const likeRef = doc(db, "posts", postId, "likes", userId);
  // 1. likes 서브컬렉션에 내 userId로 도큐먼트 생성
  await setDoc(likeRef, { createdAt: Date.now() });

  // 2. 게시글 likeCount +1
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { likeCount: increment(1) });
};

/********** 좋아요 취소 **********/
export const unlikePost = async (postId: string, userId: string) => {
  const likeRef = doc(db, "posts", postId, "likes", userId);
  await deleteDoc(likeRef);

  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { likeCount: increment(-1) });
};

/********** 내가 좋아요 누른건지 확인 **********/
export const checkPostLiked = async (postId: string, userId: string) => {
  const likeRef = doc(db, "posts", postId, "likes", userId);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
};
