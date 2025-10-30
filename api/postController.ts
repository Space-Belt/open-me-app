import { db } from "@/lib/firebase";
import { IGetPostedData, IPostData, IPostedData } from "@/types/post";
import { POSTS_PAGE_SIZE } from "@/utils/public";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { uploadPostImages } from "./imageController";

export const createPost = async ({
  title,
  content,
  images,
  uid,
  displayName,
  photoURL,
}: IPostData & { images: string[] }) => {
  // 1. 이미지 업로드 (Storage)
  const imageUrls =
    images.length > 0 ? await uploadPostImages(images, uid) : [];

  // 2. Firestore에 게시물 데이터 추가
  const docRef = await addDoc(collection(db, "posts"), {
    title,
    content,
    imageUrls,
    uid,
    displayName,
    photoURL,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    likeCount: 0,
    commentCount: 0,
  });

  return docRef.id; // 게시물 ID 반환
};

export const fetchPostsPaging = async ({
  pageParam,
}: {
  pageParam?: any;
}): Promise<{ posts: IPostedData[]; lastDoc?: any }> => {
  const postsQuery = pageParam
    ? query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(pageParam),
        limit(POSTS_PAGE_SIZE)
      )
    : query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(POSTS_PAGE_SIZE)
      );

  const snapshot = await getDocs(postsQuery);
  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IPostedData[];

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

  return { posts, lastDoc: newLastDoc };
};

export const fetchPostById = async (id: string) => {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as IGetPostedData;
  }
  return null;
};

export const updatePost = async (
  postId: string,
  {
    title,
    content,
    imageUrls,
  }: {
    title: string;
    content: string;
    imageUrls: string[];
  }
) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    title,
    content,
    imageUrls,
    updatedAt: serverTimestamp(),
  });
};

// 삭제
export const deletePostWithComments = async (postId: string) => {
  const batch = writeBatch(db);

  const commentsCol = collection(db, "posts", postId, "comments");
  const snap = await getDocs(commentsCol);

  snap.docs.forEach((commentDoc) => {
    batch.delete(commentDoc.ref);
  });

  const postRef = doc(db, "posts", postId);
  batch.delete(postRef);

  await batch.commit();
};

// 무한스크롤 형식
