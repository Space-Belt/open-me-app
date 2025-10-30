import { auth, db } from "@/lib/firebase";
import { IPostedData } from "@/types/post";
import { POSTS_PAGE_SIZE } from "@/utils/public";
import {
  collection,
  collectionGroup,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

/********** 내정보 가져오기 **********/
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

/********** 내 게시물 개수 가져오기 **********/
export const getMyPostsCount = async (uid: string): Promise<number> => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("uid", "==", uid));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("게시물 개수 조회 실패:", error);
    return 0;
  }
};

/********** 내 댓글 갯수 가져오기 **********/
export const getMyCommentsCount = async (uid: string): Promise<number> => {
  try {
    // 모든 posts/{postId}/comments에서 내가 쓴 댓글만 조회
    const commentsQuery = query(
      collectionGroup(db, "comments"),
      where("authorUid", "==", uid),
      where("isDeleted", "==", false) // 삭제되지 않은 댓글만
    );
    const snapshot = await getCountFromServer(commentsQuery);
    return snapshot.data().count;
  } catch (error) {
    console.error("댓글 개수 조회 실패:", error);
    return 0;
  }
};

/********** 게시물, 댓글 한번에 가져오기  **********/
export const getMyStats = async (uid: string) => {
  const [postsCount, commentsCount] = await Promise.all([
    getMyPostsCount(uid),
    getMyCommentsCount(uid),
  ]);

  return {
    postsCount,
    commentsCount,
  };
};

/********** 내가 올린게시물 가져오기 **********/
export const fetchMyPostsPaging = async ({
  uid,
  pageParam,
}: {
  uid: string;
  pageParam: any;
}): Promise<{ posts: IPostedData[]; lastDoc?: any }> => {
  try {
    const postsRef = collection(db, "posts");
    let q;

    if (pageParam) {
      q = query(
        postsRef,
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        startAfter(pageParam),
        limit(POSTS_PAGE_SIZE)
      );
    } else {
      q = query(
        postsRef,
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(POSTS_PAGE_SIZE)
      );
    }

    const snap = await getDocs(q);

    const posts = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IPostedData[];

    const lastDoc =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

    return { posts, lastDoc };
  } catch (error) {
    console.error("❌ fetchMyPostsPaging 에러:", error);
    throw error;
  }
};
