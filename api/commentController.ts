import { db } from "@/lib/firebase";
import { ICreateCommentInput, IGetCommentData } from "@/types/comment";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

// 댓글 달기
export const createComment = async ({
  postId,
  content,
  authorUid,
  authorNickname,
  authorPhotoURL,
  parentId = undefined,
}: ICreateCommentInput) => {
  try {
    const ref = collection(db, "posts", postId, "comments");
    await addDoc(ref, {
      content,
      authorUid,
      authorNickname,
      authorPhotoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      parentId: parentId || null,
      likeCount: 0,
      isDeleted: false,
    });
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { commentCount: increment(1) });
  } catch (err) {
    console.error("createComment error:", err);
    throw err;
  }
};

// 댓글 다 가져오기
export const fetchComments = async (
  postId: string
): Promise<IGetCommentData[]> => {
  const commentsCol = collection(db, "posts", postId, "comments");
  const q = query(commentsCol, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  const comments = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IGetCommentData[];
  return comments;
};

// 댓글 수정
export const updateComment = async (
  postId: string,
  commentId: string,
  newContent: string
) => {
  const commentRef = doc(db, "posts", postId, "comments", commentId);
  await updateDoc(commentRef, {
    content: newContent,
    updatedAt: serverTimestamp(),
  });
};

// 대댓글 존재 여부 확인
// 댓글이 대댓글을 가지고 있으면 true 반환
export const checkRepliesExist = async (
  postId: string,
  commentId: string
): Promise<boolean> => {
  const commentsCol = collection(db, "posts", postId, "comments");
  const q = query(commentsCol, where("parentId", "==", commentId));
  const snap = await getDocs(q);
  return !snap.empty;
};

// 댓글 삭제
export const deleteComment = async (postId: string, commentId: string) => {
  const hasReplies = await checkRepliesExist(postId, commentId);
  const commentRef = doc(db, "posts", postId, "comments", commentId);
  const postRef = doc(db, "posts", postId);

  if (hasReplies) {
    await updateDoc(commentRef, {
      content: "[삭제된 댓글입니다]",
      isDeleted: true,
      updatedAt: serverTimestamp(),
    });
  } else {
    await deleteDoc(commentRef);
    await updateDoc(postRef, {
      commentCount: increment(-1),
    });
  }
};
