import { db } from "@/lib/firebase";
import { ICreateCommentInput, IGetCommentData } from "@/types/comment";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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
  console.log("댓글 달기 돌아요1111");
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
  console.log("댓글 달기 돌아요22222");
  // 2. 상위 post 문서의 commentCount 증가 (트랜잭션 또는 updateDoc)
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { commentCount: increment(1) });
  console.log("sdfsdfdsf");
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
